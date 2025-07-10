import React, { useState } from "react";
import RenderNodes from "../RenderNodes";
import "./index.css";

const QuizBuilder = ({ json, setQuizData }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formData, setFormData] = useState({});

  const handleFormSubmission = (e) => {
    e.preventDefault();
    setQuizData(formData);
  };

  return (
    <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
      <RenderNodes
        quizNodes={json.quizJson}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        formData={formData}
        setFormData={setFormData}
      />
    </form>
  );
};

export { QuizBuilder };
