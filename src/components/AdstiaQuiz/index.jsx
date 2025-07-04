import React, { useState } from "react";
import RenderNodes from "../RenderNodes";
import "./index.css";

const QuizBuilder = ({ json, quizData, setQuizData }) => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const handleFormSubmission = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {};
    for (let [key, value] of formData.entries()) {
      if (values[key]) {
        if (Array.isArray(values[key])) {
          values[key].push(value);
        } else {
          values[key] = [values[key], value];
        }
      } else {
        values[key] = value;
      }
    }
    console.log("Form values:", values);
  };

  return (
    <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
      <RenderNodes
        quizNodes={json.quizJson}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
      <button className="quiz-builder__submit button" type="submit">Submit</button>
    </form>
  );
};

export { QuizBuilder };
