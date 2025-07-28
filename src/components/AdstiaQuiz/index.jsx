import React, { createContext, useEffect, useState } from "react";
import { appendLeadIdScript } from "../../utils/appendLeadIdScript";
import { handleEndNodeRedirect } from "../../utils/handleEndNodeRedirect";
import { saveQueryParamsToLocalStorage } from "../../utils/saveQueryParamsToLocalStorage";
import { sendDataToPabbly } from "../../utils/sendDataToPabbly";
import RenderNodes from "../RenderNodes";
import "./index.css";
import saveLeadsDataToDb from "../../utils/saveLeadsDataToDb";
import { sendDataToJitsuEvent } from "../../utils/saveToJitsuEventUrl";
import { getCurrentSlug, getDomainName } from "../../utils/windowUtils";
import { getESTISOString } from "../../utils/dateTimeUtils";
import { JITSU_EVENT } from "../../constants";
import { sendDataToDatazapp } from "../../utils/sendDataToDatazapp";

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  const startingNode = json.quizJson.find(
    (element) => element.quizCardType === "start"
  ).quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});
  const [jitsuEventData, setJitsuEventData] = useState([]);
  const [sendQuizEventData, setSendQuizEventData] = useState(false);

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

  const sendJitsuEvent = () => {
    const domainName = getDomainName();
    const slug = getCurrentSlug();
    const dateTime = getESTISOString();
    const previousStep =
      jitsuEventData.length > 0 && jitsuEventData[0].previousStep
        ? jitsuEventData[0].previousStep
        : "-";

    if (jitsuEventData.length > 0) {
      jitsuEventData.forEach((eventData) => {
        const { nodeName, ...data } = eventData;

        sendDataToJitsuEvent(
          json.config.jitsuEventUrl,
          JSON.stringify({
            ...data,
            domain: domainName,
            slug,
            dateTime,
            previousStep,
          })
        );
      });
    }
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    setQuizData(formData);
    
    let datazAppData = null;
    
    const { fname, lname, email, phoneNumber } = formData;
    if (fname && lname && email && phoneNumber) {
      datazAppData = await sendDataToDatazapp(fname, lname, email, phoneNumber);
      console.log("Datazapp response:", datazAppData);
    }

    // Send localStorage data to pabblyUrl if present
    if (json.config && json.config.pabblyUrl) {
      await sendDataToPabbly(json.config.pabblyUrl);
    }

    if (json.config && json.config.leadsUrl) {
      await saveLeadsDataToDb(json.config.leadsUrl);
    }

    sendJitsuEvent();
    

    window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
      user_id: localStorage.getItem("user_id") || "",
      session_id: sessionStorage.getItem("session_id") || "",
    });

    // Handle end node redirect logic
    setTimeout(() => {
      handleEndNodeRedirect(json.quizJson, currentSlide);
    }, 1500);
  };

  useEffect(() => {
    if (sendQuizEventData && json.config && json.config.jitsuEventUrl) {
      sendJitsuEvent();

      const currentSlideNodes = json?.quizJson?.find(
        (element) => element.quizCardId === String(currentSlide)
      );

      setJitsuEventData((prev) => {
        let newEventData = [];
        const previousStep =
          prev && prev.length > 0 && prev[0]?.currentStep
            ? prev[0].currentStep
            : "-";

        currentSlideNodes.nodes.forEach((node) => {
          newEventData.push({
            previousStep,
            nodeName: node?.nodeName,
          });
        });

        return newEventData;
      });

      setSendQuizEventData(false);
    }
  }, [jitsuEventData, sendQuizEventData]);

  return (
    <QuizConfigContext.Provider value={json.config}>
      <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
        <RenderNodes
          quizNodes={json.quizJson}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          setFormData={setFormData}
          setJitsuEventData={setJitsuEventData}
          sendQuizEventData={sendQuizEventData}
          setSendQuizEventData={setSendQuizEventData}
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
