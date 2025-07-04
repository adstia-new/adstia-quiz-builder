import React from "react";
import InputNode from "../QuizNodes/InputNode";
import OptionNode from "../QuizNodes/OptionNode";
import SelectNode from "../QuizNodes/SelectNode";
import ZipcodeNode from "../QuizNodes/ZipcodeNode";

const RenderNodes = ({ quizNodes, currentSlide, setCurrentSlide }) => {
  //   console.log({ quizNodes });
  const findCurrentSlideNodes = quizNodes.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const findNextSlideId = findCurrentSlideNodes?.next;
  const currentNodeType = findCurrentSlideNodes.nodes[0].nodeType;
  const showNextPreviousButtons =
    currentNodeType === "options" || currentNodeType === "dropdown";
  //   const currentNodeType =
  console.log({findCurrentSlideNodes});

  const handleNextButtonClick = () => {
    setCurrentSlide(findNextSlideId);
  };

  return (
    <div>
      <p>{findCurrentSlideNodes.question}</p>
      {findCurrentSlideNodes.nodes.map((quizElement, index) => {
        if (quizElement.nodeType === "input") {
          return <InputNode key={index} data={quizElement} />;
        }
        if (quizElement.nodeType === "zipcode") {
          return <ZipcodeNode key={index} data={quizElement} />;
        }
        if (quizElement.nodeType === "options") {
          return <OptionNode key={index} data={quizElement} setCurrentSlide={setCurrentSlide} />;
        }
        if (quizElement.nodeType === "dropdown") {
          return <SelectNode key={index} data={quizElement} />;
        }
        return <p>Hello</p>;
      })}
      {!showNextPreviousButtons && (
        <>
          <button>Previous</button>
          <button onClick={handleNextButtonClick}>Next</button>
        </>
      )}
    </div>
  );
};

export default RenderNodes;
