import React from "react";
import InputNode from "../QuizNodes/InputNode";
import OptionNode from "../QuizNodes/OptionNode";

const RenderNodes = ({ quizNodes, currentSlide, setCurrentSlide }) => {
  console.log({ quizNodes });
  const findCurrentSlideNodes = quizNodes.find(
    (element) => element.quizCardId === String(currentSlide)
  );
  const findNextSlideId = findCurrentSlideNodes.next;
  console.log(findCurrentSlideNodes);

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
        if (quizElement.nodeType === "options") {
          return <OptionNode key={index} data={quizElement} />;
        }
        return <p>Hello</p>;
      })}
      <button>Previous</button>
      <button onClick={handleNextButtonClick}>Next</button>
    </div>
  );
};

export default RenderNodes;
