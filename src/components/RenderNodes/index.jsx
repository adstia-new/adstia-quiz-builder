import React, { useState } from "react";
import InputNode from "../QuizNodes/InputNode";
import OptionNode from "../QuizNodes/OptionNode";
import SelectNode from "../QuizNodes/SelectNode";
import ZipcodeNode from "../QuizNodes/ZipcodeNode";
import "./index.css";
import DobNode from "../QuizNodes/DobNode";

const RenderNodes = ({ quizNodes, currentSlide, setCurrentSlide, formData, setFormData }) => {
  const [nextDisabled, setNextDisabled] = useState(false);

  const findCurrentSlideNodes = quizNodes.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const findNextSlideId = findCurrentSlideNodes?.next;
  const currentNodeType = findCurrentSlideNodes.nodes[0].nodeType;
  const showNextPreviousButtons =
    currentNodeType === "options" || currentNodeType === "dropdown";

  const handleNextButtonClick = () => {
    setCurrentSlide(findNextSlideId);
  };

  return (
    <div className="render-nodes">
      <p className="render-nodes__question">{findCurrentSlideNodes.question}</p>
      <p className="render-nodes__subtext">{findCurrentSlideNodes.subText}</p>
      {findCurrentSlideNodes.nodes.map((quizElement, index) => {
        if (quizElement.nodeType === "input") {
          return (
            <InputNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
            />
          );
        }
        if (quizElement.nodeType === "zipcode") {
          return (
            <ZipcodeNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
            />
          );
        }
        if (quizElement.nodeType === "dob") {
          return (
            <DobNode
              key={index}
              data={quizElement}
              setNextDisabled={setNextDisabled}
              setFormData={setFormData}
            />
          );
        }
        if (quizElement.nodeType === "options") {
          return (
            <OptionNode
              key={index}
              data={quizElement}
              setCurrentSlide={setCurrentSlide}
              setFormData={setFormData}
            />
          );
        }
        if (quizElement.nodeType === "dropdown") {
          return <SelectNode key={index} data={quizElement} />;
        }
        return <p key={index}>Hello</p>;
      })}
      {!showNextPreviousButtons && (
        <>
          <button className="render-nodes__button render-nodes__button--previous">
            Previous
          </button>
          <button
            className="render-nodes__button render-nodes__button--next"
            onClick={handleNextButtonClick}
            disabled={nextDisabled}
          >
            Next
          </button>
        </>
      )}
      <button className="quiz-builder__submit button" type="submit">
        Submit
      </button>
    </div>
  );
};

export default RenderNodes;
