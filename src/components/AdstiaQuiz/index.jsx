import React, { createContext, useEffect, useState } from "react";
import { appendLeadIdScript } from "../../utils/appendLeadIdScript";
import { handleEndNodeRedirect } from "../../utils/handleEndNodeRedirect";
import { saveQueryParamsToLocalStorage } from "../../utils/saveQueryParamsToLocalStorage";
import { sendDataToPabbly } from "../../utils/sendDataToPabbly";
import RenderNodes from "../RenderNodes";
import "./index.css";
import saveLeadsDataToDb from "../../utils/saveLeadsDataToDb";

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  const startingNode = json.quizJson.find(
    (element) => element.quizCardType === "start"
  ).quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Save query params to localStorage on mount
    saveQueryParamsToLocalStorage();

    // Add LeadiD script to head only if leadId is present in config
    let cleanup = () => {};
    if (json.config && json.config.leadId) {
      cleanup = appendLeadIdScript(json.config.leadId);
    }
    return cleanup;
  }, [json.config]);

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setQuizData(formData);

    // Send localStorage data to pabblyUrl if present
    if (json.config && json.config.pabblyUrl) {
      await sendDataToPabbly(json.config.pabblyUrl);
    }

    if (json.config && json.config.leadsUrl) {
      await saveLeadsDataToDb(json.config.leadsUrl);
    }

    // Handle end node redirect logic
    handleEndNodeRedirect(json.quizJson, currentSlide);
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
        {json.config && json.config.leadId && (
          <input
            type="hidden"
            name="universal_leadid"
            id="leadid_token"
            value=""
          />
        )}
      </form>
    </QuizConfigContext.Provider>
  );
};

export { QuizBuilder };
