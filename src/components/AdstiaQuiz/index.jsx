import React, { useState } from "react";
import RenderNodes from "../RenderNodes";
import "./index.css";

const QuizBuilder = ({ json, setQuizData }) => {
  const startingNode = json.quizJson.find((element) => element.quizCardType === "start").quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});

  const handleFormSubmission = (e) => {
    e.preventDefault();
    console.log('form submitted!');
    setQuizData(formData);
  };

  return (
    <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
      <RenderNodes
        quizNodes={json.quizJson}
        quizConfig={json.config}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setFormData={setFormData}
      />
    </form>
  );
};

export { QuizBuilder };
