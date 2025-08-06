import React, { createContext, useEffect, useState } from "react";
import {
  JITSU_EVENT,
  LOCAL_STORAGE_QUIZ_HISTORY,
  LOCAL_STORAGE_QUIZ_VALUES,
  SESSION_STORAGE_DATAZAPP_KEY,
} from "../../constants";
import { appendLeadIdScript } from "../../utils/appendLeadIdScript";
import { handleEndNodeRedirect } from "../../utils/handleEndNodeRedirect";
import saveLeadsDataToDb from "../../utils/saveLeadsDataToDb";
import { saveQueryParamsToLocalStorage } from "../../utils/saveQueryParamsToLocalStorage";
import {
  sendDataToJitsuIdentifyEvent,
  sendJitsuEvent,
} from "../../utils/saveToJitsuEventUrl";
import { sendDataToDatazapp } from "../../utils/sendDataToDatazapp";
import { sendDataToPabbly } from "../../utils/sendDataToPabbly";
import RenderNodes from "../RenderNodes";
import "./index.css";
import { pushLocalDataToDataLayer } from "../../utils/gtmUtils";
import LoadingScreen from "../ui/LoadingScreen";
import { flushSync } from "react-dom";

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  console.log("adstia-quiz-builder loaded");
  const startingNode = json.quizJson.find(
    (element) => element.quizCardType === "start"
  ).quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});
  const [jitsuEventData, setJitsuEventData] = useState([]);
  const [sendQuizEventData, setSendQuizEventData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Save query params to localStorage on mount
    saveQueryParamsToLocalStorage();

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

    let datazAppData = null;

    const { fname, lname, email, phoneNumber } = formData;
    if (fname && lname && email && phoneNumber) {
      datazAppData = await sendDataToDatazapp(fname, lname, email, phoneNumber);
      sessionStorage.setItem(
        SESSION_STORAGE_DATAZAPP_KEY,
        JSON.stringify(datazAppData)
      );
    }

    // Send localStorage data to pabblyUrl if present
    if (json.config && json.config.pabblyUrl) {
      await sendDataToPabbly(json.config.pabblyUrl, datazAppData);
    }

    if (json.config && json.config.leadsUrl) {
      await saveLeadsDataToDb(json.config.leadsUrl, datazAppData);
    }

    await sendDataToJitsuIdentifyEvent(datazAppData);

    setJitsuEventData((prev) => {
      let newEventData = [...prev];
      if (prev.length > 0) {
        newEventData = prev.map((eventData) => {
          return {
            ...eventData,
            currentStep: eventData.currentStep
              ? eventData.currentStep
              : currentSlide,
            questionKey: eventData.questionKey
              ? eventData.questionKey
              : `${currentSlide}_${eventData.nodeName}`,
            nextStep: eventData.nextStep ? eventData.nextStep : "-",
          };
        });
      }

      sendJitsuEvent(newEventData);
      return newEventData;
    });

    setFormData((prevFormData) => {
      window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
        user_id: localStorage.getItem("user_id") || "",
        session_id: sessionStorage.getItem("session_id") || "",
        ...prevFormData,
      });

      return prevFormData;
    });

    // Push quiz data to GTM
    setTimeout(() => {
      pushLocalDataToDataLayer();
    }, 500);

    // Handle end node redirect logic
    setTimeout(() => {
      handleEndNodeRedirect(json.quizJson, currentSlide, next);
    }, 1500);
  };

  useEffect(() => {
    const currentSlideNodes = json?.quizJson?.find(
      (element) => element.quizCardId === String(currentSlide)
    );

    setJitsuEventData((prev) => {
      let newEventData = [];
      let previousStep = JSON.parse(
        sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || "[]"
      );
      previousStep =
        previousStep.length > 0 ? previousStep[previousStep.length - 1] : "-";

      currentSlideNodes.nodes.forEach((node) => {
        newEventData.push({
          previousStep,
          nodeName: node?.nodeName,
        });
      });

      return newEventData;
    });
  }, [currentSlide]);

  useEffect(() => {
    if (sendQuizEventData && json.config) {
      setTimeout(() => {
        sendJitsuEvent(jitsuEventData);
      }, 500);

      setSendQuizEventData(false);
    }

    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [jitsuEventData, sendQuizEventData, isLoading]);

  useEffect(() => {
    const handlePageShow = () => {
      setIsLoading(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
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
          sendQuizEventData={sendQuizEventData}
          setSendQuizEventData={setSendQuizEventData}
          handleFormSubmit={handleFormSubmission}
        />
        {json.config && json.config.leadId && (
          <input
            type="hidden"
            name="universal_leadid"
            id="leadid_token"
            value=""
          />
        )}
      </form>
    </QuizConfigContext.Provider>
  );
};

export { QuizBuilder };
