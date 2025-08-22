import React, { useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_QUIZ_HISTORY, QUIZ_NODE_TYPES } from "../../constants";
import { pushLocalDataToDataLayer } from "../../utils/gtmUtils";
import { QuizConfigContext } from "../AdstiaQuiz";
import DobNode from "../QuizNodes/DobNode";
import EmailNode from "../QuizNodes/EmailNode";
import InputNode from "../QuizNodes/InputNode";
import OptionNode from "../QuizNodes/OptionNode";
import PhoneNode from "../QuizNodes/PhoneNode";
import SelectNode from "../QuizNodes/SelectNode";
import ZipcodeNode from "../QuizNodes/ZipcodeNode";
import "./index.css";
import { sortAndRemoveDuplicate } from "../../utils/sortAndRemoveDuplicate";

const RenderNodes = ({
  quizNodes,
  currentSlide,
  setCurrentSlide,
  setFormData,
  setJitsuEventData,
  setSendQuizEventData,
  handleFormSubmit,
}) => {
  const searchParams = new URLSearchParams(window?.location?.search || "");
  const quizConfig = useContext(QuizConfigContext);
  const [nextDisabled, setNextDisabled] = useState(false);

  const findCurrentSlideNodes = quizNodes.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const isStartingNode =
    findCurrentSlideNodes.quizCardType === QUIZ_NODE_TYPES.START;
  const findNextSlideId = findCurrentSlideNodes?.next;
  const nextSlideType =
    quizNodes.find((element) => element.quizCardId === String(findNextSlideId))
      ?.quizCardType || null;
  const currentNodeType = findCurrentSlideNodes.nodes[0].nodeType;
  const showNextPreviousButtons = currentNodeType === QUIZ_NODE_TYPES.OPTIONS;

  const getSlideHistory = () => {
    try {
      return (
        JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY)) || []
      );
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
      "",
      `${window.location.pathname}${
        searchParams?.toString() ? `?${searchParams?.toString()}` : ""
      }`
    );
  };

  const handleNextButtonClick = () => {
    const history = getSlideHistory();
    history.push(String(currentSlide));
    setSlideHistory(history);
    setCurrentSlide(String(findNextSlideId));

    // Push history entry
    window.history.pushState(
      { step: findNextSlideId },
      "",
      `${window.location.pathname}${
        searchParams?.toString() ? `?${searchParams?.toString()}` : ""
      }`
    );

    setSendQuizEventData(true);
    // Push quiz data to GTM
    setTimeout(() => {
      pushLocalDataToDataLayer();
    }, 500);
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
          return {
            ...eventData,
            currentStep: currentSlide,
            questionKey: `${currentSlide}_${eventData.nodeName}`,
            nextStep: findNextSlideId,
          };
        });
      } else {
        let previousStep = JSON.parse(
          sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || "[]"
        );
        previousStep =
          previousStep.length > 0 ? previousStep[previousStep.length - 1] : "-";

        currentSlideNodes.nodes.forEach((node) => {
          newEventData.push({
            previousStep,
            nodeName: node?.nodeName,
            currentStep: currentSlide,
            questionKey: `${currentSlide}_${node?.nodeName}`,
            nextStep: findNextSlideId,
          });
        });
      }

      if (currentNodeName && answer) {
        newEventData = newEventData.map((eventData) => {
          if (eventData.nodeName === currentNodeName) {
            return {
              ...eventData,
              answer: answer,
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
      quizNodes.find((element) => element.quizCardId === String(next))
        ?.quizCardType || null;

    let previousStep = JSON.parse(
      sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || "[]"
    );
    previousStep =
      previousStep.length > 0 ? previousStep[previousStep.length - 1] : "-";

    setJitsuEventData((prev) => {
      let newEventData = {};

      newEventData = {
        previousStep,
        answer,
        currentStep: currentSlide,
        questionKey: `${currentSlide}_${prev.nodeName || nodeName}`,
        nextStep: next,
      };

      return [newEventData];
    });

    if (nextNodeType !== "end") {
      setSendQuizEventData(true);
      setCurrentSlideWithHistory(next);
    } else {
      handleFormSubmit(null, next);
    }
  };

  useEffect(() => {
    if (isStartingNode) {
      setSlideHistory([]);
    }

    window.history.replaceState(
      { step: currentSlide },
      "",
      `${window.location.pathname}${
        searchParams?.toString() ? `?${searchParams?.toString()}` : ""
      }`
    );

    const onPopState = () => {
      const stepsHistory = getSlideHistory();

      setJitsuEventData([]);

      const step =
        stepsHistory?.length > 0 ? stepsHistory[stepsHistory.length - 1] : 1;

      if (step) {
        setCurrentSlide(String(step));

        const newStepsHistory =
          stepsHistory?.length > 0
            ? stepsHistory.slice(0, stepsHistory.length - 1)
            : [];
        setSlideHistory(newStepsHistory);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="render-nodes">
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
            className="render-nodes__button render-nodes__button--next"
            onClick={handleNextButtonClick}
            disabled={nextDisabled}
            type="button"
          >
            {quizConfig.nextButtonText}
          </button>
        </div>
      )}
      {nextSlideType === "end" && !showNextPreviousButtons && (
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
            disabled={nextDisabled}
          >
            {quizConfig.submitButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default RenderNodes;
