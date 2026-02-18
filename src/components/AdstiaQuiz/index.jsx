import React, { createContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_QUIZ_VALUES, QUERY_PARAMS } from '../../constants';
import { appendLeadIdScript } from '../../utils/appendLeadIdScript';
import { handleEndNodeRedirect } from '../../utils/handleEndNodeRedirect';
import { sendJitsuEvent, sendJitsuLeadSubmitEvent } from '../../utils/saveToJitsuEventUrl';
import RenderNodes from '../RenderNodes';
import './index.css';
import { pushLocalDataToDataLayer } from '../../utils/gtmUtils';
import LoadingScreen from '../ui/LoadingScreen/LoadingScreen';
import { saveQuizModuleSubmission } from '../../utils/saveQuizModuleSubmission';
import { getLeadIdTokenValue } from '../../utils/getLeadIdTokenValue';

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  const startingNode = json.quizJson.find((element) => element.quizCardType === 'start').quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});
  const [jitsuEventData, setJitsuEventData] = useState([]);
  const [sendQuizEventData, setSendQuizEventData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const leadId = getLeadIdTokenValue();

  useEffect(() => {
    // Add LeadiD script to head only if leadId is present in config
    let cleanup = () => {};
    if (json.config && json.config.leadId) {
      cleanup = appendLeadIdScript(json.config.leadId);
    }
    return cleanup;
  }, [json.config]);

  const handleFormSubmission = async (e, next) => {
    e?.preventDefault();

    setIsLoading(true);
    setQuizData(formData);

    const { email, phoneNumber } = formData;
    const isLongForm =
      searchParams && searchParams.get(QUERY_PARAMS.FORM_TYPE) === 'f' ? true : false;

    const promises = [];

    if (isLongForm && email && phoneNumber) {
      let dataJson = { ...formData };

      if (leadId) {
        dataJson = { ...dataJson, leadId };
      }

      if (json?.config?.includeQueryParams) {
        searchParams?.forEach((value, key) => {
          dataJson[key] = value;
        });
      }

      promises.push(saveQuizModuleSubmission(json.config.pabblyUrl || '', dataJson));
    }

    // Jitsu Event
    promises.push(
      new Promise((resolve) => {
        setJitsuEventData((prev) => {
          sendJitsuEvent(prev);
          setTimeout(() => {
            resolve();
          }, 100);
          return prev;
        });
      })
    );

    const quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');

    let jsonData = {
      user_id: localStorage.getItem('user_id') || '',
      session_id: sessionStorage.getItem('session_id') || '',
      ...quizData,
    };

    if (leadId) {
      jsonData = { ...jsonData, leadId };
    }

    promises.push(
      new Promise((resolve) => {
        sendJitsuLeadSubmitEvent(jsonData);
        setTimeout(() => {
          resolve();
        }, 100);
      })
    );

    // Push quiz data to GTM
    promises.push(
      new Promise((resolve) => {
        pushLocalDataToDataLayer();
        pushLocalDataToDataLayer('Lead');
        setTimeout(() => {
          resolve();
        }, 100);
      })
    );

    // Wait for all promises to settle before redirection
    await Promise.allSettled(promises);

    // Send quiz event for final submission with redirect URL
    const currentNode = json.quizJson.find(
      (element) => element.quizCardId === String(currentSlide)
    );
    const findNextSlideId = next || currentNode?.next;
    const nextSlideData =
      json.quizJson.find((element) => element.quizCardId === String(findNextSlideId)) || {};
    const endNode = nextSlideData.nodes?.[0];

    if (endNode && endNode.redirectUrl) {
      const redirectEventData = {
        previousStep: currentSlide, // The step before submission becomes previous_step
        answer: endNode.redirectUrl,
        currentStep: findNextSlideId, // The end node becomes current_step
        questionKey: endNode.nodeName || 'redirect',
        questionType: 'redirect',
        nextStep: '-',
      };

      promises.push(
        new Promise((resolve) => {
          sendJitsuEvent([redirectEventData]);
          setTimeout(() => {
            resolve();
          }, 100);
        })
      );

      // Wait for redirect event to be sent
      await Promise.allSettled(promises);
    }

    // Handle end node redirect logic after all async tasks
    setTimeout(() => {
      handleEndNodeRedirect(json.quizJson, currentSlide, next);
    }, 200);
  };

  useEffect(() => {
    if (sendQuizEventData && json.config) {
      setTimeout(() => {
        sendJitsuEvent(jitsuEventData);
      }, 500);
      setJitsuEventData([]);

      setSendQuizEventData(false);
    }

    if (isLoading) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [jitsuEventData, sendQuizEventData, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pramas = new URLSearchParams(window.location.search);
      setSearchParams(pramas);
    }

    const handlePageShow = () => {
      setIsLoading(false);
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <QuizConfigContext.Provider value={json.config}>
      {isLoading && <LoadingScreen />}
      <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
        <RenderNodes
          quizNodes={json.quizJson}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          setFormData={setFormData}
          setJitsuEventData={setJitsuEventData}
          setSendQuizEventData={setSendQuizEventData}
          handleFormSubmit={handleFormSubmission}
        />
        {json.config && json.config.leadId && (
          <input type="hidden" name="universal_leadid" id="leadid_token" value="" />
        )}
      </form>
    </QuizConfigContext.Provider>
  );
};

export { QuizBuilder };
