import React, { useContext, useEffect, useRef, useState } from 'react';
import { LOCAL_STORAGE_QUIZ_HISTORY, QUIZ_NODE_TYPES } from '../../constants';
import { pushLocalDataToDataLayer } from '../../utils/gtmUtils';
import { QuizConfigContext } from '../AdstiaQuiz';
import DobNode from '../QuizNodes/DobNode';
import EmailNode from '../QuizNodes/EmailNode';
import InputNode from '../QuizNodes/InputNode';
import OptionNode from '../QuizNodes/OptionNode';
import PhoneNode from '../QuizNodes/PhoneNode';
import SelectNode from '../QuizNodes/SelectNode';
import ZipcodeNode from '../QuizNodes/ZipcodeNode';
import './index.css';
import { sortAndRemoveDuplicate } from '../../utils/sortAndRemoveDuplicate';

const RenderNodes = ({
  quizNodes,
  currentSlide,
  setCurrentSlide,
  setFormData,
  setJitsuEventData,
  setSendQuizEventData,
  handleFormSubmit,
}) => {
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window?.location?.search || '') : '';
  const quizConfig = useContext(QuizConfigContext);
  const [nextDisabled, setNextDisabled] = useState({});
  const containerRef = useRef(null);

  const findCurrentSlideNodes = quizNodes.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const isStartingNode = findCurrentSlideNodes.quizCardType === QUIZ_NODE_TYPES.START;
  const findNextSlideId = findCurrentSlideNodes?.next;
  const nextSlideType =
    quizNodes.find((element) => element.quizCardId === String(findNextSlideId))?.quizCardType ||
    null;
  const currentNodeType = findCurrentSlideNodes.nodes[0].nodeType;
  const showNextPreviousButtons = currentNodeType === QUIZ_NODE_TYPES.OPTIONS;
  const tcpaConsent = findCurrentSlideNodes?.nodes?.find(
    (node) => node.nodeType === QUIZ_NODE_TYPES.PHONE
  )?.tcpaConsent;

  // Compute actual disabled state: disabled only if any validation value is true
  const isNextButtonDisabled = Object.values(nextDisabled).some((isInvalid) => isInvalid === true);

  const getSlideHistory = () => {
    try {
      return JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY)) || [];
    } catch {
      return [];
    }
  };

  const setSlideHistory = (history) => {
    sessionStorage.setItem(
      LOCAL_STORAGE_QUIZ_HISTORY,
      JSON.stringify(sortAndRemoveDuplicate(history))
    );
  };

  const setCurrentSlideWithHistory = (slideId) => {
    const history = getSlideHistory();
    history.push(String(currentSlide));
    setSlideHistory(history);
    setCurrentSlide(String(slideId));

    window.history.pushState(
      { step: slideId },
      '',
      `${window.location.pathname}${searchParams?.toString() ? `?${searchParams?.toString()}` : ''}`
    );
  };

  const handleNextButtonClick = () => {
    // If validation fails, trigger blur on all inputs to show error messages
    if (isNextButtonDisabled) {
      // Find all input, select, and textarea elements in the current slide
      const inputs = document.querySelectorAll(
        '.input-node__input, .email-node__input, .phone-node__input, .zipcode-node__input, .dob-node__input'
      );

      // Trigger blur event on each input to show validation errors
      // Note: We must focus first, then blur, because blur events only fire on focused elements
      inputs.forEach((input) => {
        input.focus();
        input.blur();
        // Dispatch blur event to trigger validation
        input.dispatchEvent(new Event('blur', { bubbles: true }));
      });

      return;
    }

    const history = getSlideHistory();
    history.push(String(currentSlide));
    setSlideHistory(history);
    setCurrentSlide(String(findNextSlideId));

    // Push history entry
    window.history.pushState(
      { step: findNextSlideId },
      '',
      `${window.location.pathname}${searchParams?.toString() ? `?${searchParams?.toString()}` : ''}`
    );

    setSendQuizEventData(true);
    // Push quiz data to GTM
    setTimeout(() => {
      pushLocalDataToDataLayer();
    }, 500);
  };

  const handleSubmitButtonClick = (e) => {
    // If validation fails, trigger blur on all inputs to show error messages
    if (isNextButtonDisabled) {
      e.preventDefault(); // Prevent form submission

      // Find all input, select, and textarea elements in the current slide
      const inputs = document.querySelectorAll(
        '.input-node__input, .email-node__input, .phone-node__input, .zipcode-node__input, .dob-node__input'
      );

      // Trigger blur event on each input to show validation errors
      // Note: We must focus first, then blur, because blur events only fire on focused elements
      inputs.forEach((input) => {
        input.focus();
        input.blur();
        input.dispatchEvent(new Event('blur', { bubbles: true }));
      });

      return false;
    }
    // If validation passes, allow form submission
  };

  const handlePreviousButtonClick = () => {
    const history = getSlideHistory();
    if (history.length > 0) {
      const lastSlide = history.pop();
      setSlideHistory(history);
      setCurrentSlide(String(lastSlide));
    }
  };

  const handleJitsuData = (currentNodeName, answer) => {
    setJitsuEventData((prev) => {
      let newEventData = [...prev];
      const currentSlideNodes = findCurrentSlideNodes;

      // Check if jitsuEventData already has data for the current slide
      if (prev.length > 0) {
        newEventData = prev.map((eventData) => {
          const node = currentSlideNodes.nodes.find((n) => n.nodeName === eventData.nodeName);
          return {
            ...eventData,
            currentStep: currentSlide,
            questionKey: eventData.nodeName,
            questionType: node
              ? QUIZ_NODE_TYPES[node.nodeType] || node.nodeType
              : QUIZ_NODE_TYPES[currentNodeType] || currentNodeType,
            nextStep: findNextSlideId,
          };
        });
      } else {
        let previousStep = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || '[]');
        previousStep = previousStep.length > 0 ? previousStep[previousStep.length - 1] : '-';

        currentSlideNodes.nodes.forEach((node) => {
          newEventData.push({
            previousStep,
            nodeName: node?.nodeName,
            currentStep: currentSlide,
            questionKey: node?.nodeName,
            questionType: QUIZ_NODE_TYPES[node?.nodeType] || node?.nodeType,
            nextStep: findNextSlideId,
          });
        });
      }

      if (currentNodeName) {
        newEventData = newEventData.map((eventData) => {
          if (eventData.nodeName === currentNodeName) {
            return {
              ...eventData,
              answer: answer
                ? currentNodeType === QUIZ_NODE_TYPES.DROPDOWN
                  ? answer
                  : true
                : false,
            };
          }
          return eventData;
        });
      }

      return newEventData;
    });
  };

  const handleOptionClick = (answer, next) => {
    const nodeName = findCurrentSlideNodes.nodes[0].nodeName;

    const nextNodeType =
      quizNodes.find((element) => element.quizCardId === String(next))?.quizCardType || null;

    let previousStep = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || '[]');
    previousStep = previousStep.length > 0 ? previousStep[previousStep.length - 1] : '-';

    setJitsuEventData((prev) => {
      let newEventData = {};

      newEventData = {
        previousStep,
        answer,
        currentStep: currentSlide,
        questionKey: prev.nodeName || nodeName,
        questionType: QUIZ_NODE_TYPES.OPTIONS,
        nextStep: next,
      };

      return [newEventData];
    });

    if (nextNodeType !== 'end') {
      setSendQuizEventData(true);
      setCurrentSlideWithHistory(next);
    } else {
      handleFormSubmit(null, next);
    }
  };

  // Initialize nextDisabled object based on current slide's required nodes
  useEffect(() => {
    const validationState = {};
    findCurrentSlideNodes.nodes.forEach((node) => {
      const isRequired = node.validation?.required;
      if (isRequired) {
        // Set to true initially for required nodes (invalid until validated)
        validationState[node.nodeName] = true;
      }
    });
    setNextDisabled(validationState);
  }, [currentSlide]);

  useEffect(() => {
    if (isStartingNode) {
      setSlideHistory([]);
    }

    window.history.replaceState(
      { step: currentSlide },
      '',
      `${window.location.pathname}${searchParams?.toString() ? `?${searchParams?.toString()}` : ''}`
    );

    const onPopState = () => {
      const stepsHistory = getSlideHistory();

      setJitsuEventData([]);

      const step = stepsHistory?.length > 0 ? stepsHistory[stepsHistory.length - 1] : 1;

      if (step) {
        setCurrentSlide(String(step));

        const newStepsHistory =
          stepsHistory?.length > 0 ? stepsHistory.slice(0, stepsHistory.length - 1) : [];
        setSlideHistory(newStepsHistory);
      }
    };

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // // Scroll to top whenever the slide changes
  // useEffect(() => {
  //   // Add a slight delay to ensure DOM update and browser rendering doesn't override scroll
  //   setTimeout(() => {
  //     containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }, 100);
  // }, [currentSlide]);

  return (
    <div className="render-nodes" ref={containerRef}>
      <p className="render-nodes__question">{findCurrentSlideNodes.question}</p>
      <p className="render-nodes__subtext">{findCurrentSlideNodes.subText}</p>
      {findCurrentSlideNodes.nodes.map((quizElement, index) => {
        if (quizElement.nodeType === QUIZ_NODE_TYPES.INPUT) {
          return (
            <InputNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.EMAIL) {
          return (
            <EmailNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.PHONE) {
          return (
            <PhoneNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.ZIPCODE) {
          return (
            <ZipcodeNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.DOB) {
          return (
            <DobNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.OPTIONS) {
          return (
            <OptionNode
              key={index}
              data={quizElement}
              setFormData={setFormData}
              handleOptionClick={handleOptionClick}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.DROPDOWN) {
          return (
            <SelectNode
              key={index}
              data={quizElement}
              setFormData={setFormData}
              handleJitsuData={handleJitsuData}
            />
          );
        }
        return <p key={index}></p>;
      })}
      {nextSlideType !== QUIZ_NODE_TYPES.END && !showNextPreviousButtons && (
        <div className="render-nodes__nav">
          {!isStartingNode && (
            <button
              className="render-nodes__button render-nodes__button--previous"
              type="button"
              onClick={handlePreviousButtonClick}
            >
              {quizConfig.previousButtonText}
            </button>
          )}
          <button
            className={`${isNextButtonDisabled ? 'render-nodes__button--disabled' : ''} render-nodes__button render-nodes__button--next`}
            onClick={handleNextButtonClick}
            type="button"
          >
            {quizConfig.nextButtonText}
          </button>
        </div>
      )}
      {nextSlideType === 'end' && !showNextPreviousButtons && (
        <div className="render-nodes__nav">
          {!isStartingNode && (
            <button
              className="render-nodes__button render-nodes__button--previous"
              type="button"
              onClick={handlePreviousButtonClick}
            >
              {quizConfig.previousButtonText}
            </button>
          )}
          <button
            className="quiz-builder__submit button"
            type="submit"
            onClick={handleSubmitButtonClick}
          >
            {quizConfig.submitButtonText}
          </button>
        </div>
      )}
      {tcpaConsent && (
        <div className="phone-node__tcpa">
          <label className="phone-node__tcpa-label">
            <input type="hidden" checked={true} className="phone-node__tcpa-checkbox" />
            <span
              className="phone-node__tcpa-text"
              dangerouslySetInnerHTML={{
                __html: tcpaConsent.text,
              }}
            ></span>
          </label>
        </div>
      )}
    </div>
  );
};

export default RenderNodes;
