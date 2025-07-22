import React, { useState, createContext } from "react";
import RenderNodes from "../RenderNodes";
import "./index.css";

export const QuizConfigContext = createContext();

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
    <QuizConfigContext.Provider value={json.config}>
      <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
        <RenderNodes
          quizNodes={json.quizJson}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          setFormData={setFormData}
        />
      </form>
    </QuizConfigContext.Provider>
  );
};

export { QuizBuilder };
