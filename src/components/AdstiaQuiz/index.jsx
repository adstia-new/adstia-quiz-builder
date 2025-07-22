import React, { useState, createContext, useEffect } from "react";
import RenderNodes from "../RenderNodes";
import "./index.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  const startingNode = json.quizJson.find((element) => element.quizCardType === "start").quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});

  // Save query params to localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryObj = {};
    for (const [key, value] of params.entries()) {
      queryObj[key] = value;
    }
    if (Object.keys(queryObj).length > 0) {
      const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      localStorage.setItem(LOCAL_STORAGE_QUIZ_VALUES, JSON.stringify({ ...prev, ...queryObj }));
    }
  }, []);

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
