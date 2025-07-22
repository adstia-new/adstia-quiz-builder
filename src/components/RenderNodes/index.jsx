import React, { useState, useContext } from "react";
import InputNode from "../QuizNodes/InputNode";
import OptionNode from "../QuizNodes/OptionNode";
import SelectNode from "../QuizNodes/SelectNode";
import ZipcodeNode from "../QuizNodes/ZipcodeNode";
import "./index.css";
import DobNode from "../QuizNodes/DobNode";
import EmailNode from "../QuizNodes/EmailNode";
import PhoneNode from "../QuizNodes/PhoneNode";
import { LOCAL_STORAGE_QUIZ_HISTORY, QUIZ_NODE_TYPES } from "../../constants";
import { QuizConfigContext } from "../AdstiaQuiz";

const RenderNodes = ({
  quizNodes,
  currentSlide,
  setCurrentSlide,
  setFormData,
}) => {
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
  const showNextPreviousButtons =
    currentNodeType === QUIZ_NODE_TYPES.OPTIONS;

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
    sessionStorage.setItem(LOCAL_STORAGE_QUIZ_HISTORY, JSON.stringify(history));
  };

  const setCurrentSlideWithHistory = (slideId) => {
    const history = getSlideHistory();
    history.push(String(currentSlide));
    setSlideHistory(history);
    setCurrentSlide(String(slideId));
  };

  const handleNextButtonClick = () => {
    const history = getSlideHistory();
    history.push(String(currentSlide));
    setSlideHistory(history);
    setCurrentSlide(String(findNextSlideId));
  };

  const handlePreviousButtonClick = () => {
    const history = getSlideHistory();
    if (history.length > 0) {
      const lastSlide = history.pop();
      setSlideHistory(history);
      setCurrentSlide(String(lastSlide));
    }
  };

  const handleSubmitButtonClick = () => {
    const nextSlideData =
      quizNodes.find(
        (element) => element.quizCardId === String(findNextSlideId)
      ) || {};
    const endNode = nextSlideData.nodes?.[0];
    if (endNode) {
      // Open new tab immediately if needed
      if (endNode.openInNewTab && endNode.redirectUrl) {
        window.open(endNode.redirectUrl, "_blank");
      }
      // Redirect current tab
      if (endNode.redirectCurrentTab && endNode.redirectCurrentTabUrl) {
        window.location.href = endNode.redirectCurrentTabUrl;
      } else if (endNode.redirectUrl && !endNode.openInNewTab) {
        window.location.href = endNode.redirectUrl;
      }
    }
  };

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
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.OPTIONS) {
          return (
            <OptionNode
              key={index}
              data={quizElement}
              setCurrentSlide={setCurrentSlideWithHistory}
              setFormData={setFormData}
            />
          );
        }
        if (quizElement.nodeType === QUIZ_NODE_TYPES.DROPDOWN) {
          return (
            <SelectNode
              key={index}
              data={quizElement}
              setCurrentSlide={setCurrentSlideWithHistory}
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
            onClick={handleSubmitButtonClick}
          >
            {quizConfig.submitButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default RenderNodes;
