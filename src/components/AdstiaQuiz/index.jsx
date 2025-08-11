import React, { createContext, useEffect, useState } from "react";
import {
  JITSU_EVENT,
  LOCAL_STORAGE_QUIZ_HISTORY,
  LOCAL_STORAGE_QUIZ_VALUES,
  QUERY_PARAMS,
  SESSION_STORAGE_DATAZAPP_KEY,
} from "../../constants";
import { appendLeadIdScript } from "../../utils/appendLeadIdScript";
import { handleEndNodeRedirect } from "../../utils/handleEndNodeRedirect";
import saveLeadsDataToDb from "../../utils/saveLeadsDataToDb";
import { saveQueryParamsToLocalStorage } from "../../utils/saveQueryParamsToLocalStorage";
import {
  sendDataToJitsuIdentifyEvent,
  sendJitsuEvent,
} from "../../utils/saveToJitsuEventUrl";
import { sendDataToDatazapp } from "../../utils/sendDataToDatazapp";
import { sendDataToPabbly } from "../../utils/sendDataToPabbly";
import RenderNodes from "../RenderNodes";
import "./index.css";
import { pushLocalDataToDataLayer } from "../../utils/gtmUtils";
import LoadingScreen from "../ui/LoadingScreen";
import { saveQuizModuleSubmission } from "../../utils/saveQuizModuleSubmission";

export const QuizConfigContext = createContext();

const QuizBuilder = ({ json, setQuizData }) => {
  console.log("adstia-quiz-builder running");
  const startingNode = json.quizJson.find(
    (element) => element.quizCardType === "start"
  ).quizCardId;
  const [currentSlide, setCurrentSlide] = useState(startingNode);
  const [formData, setFormData] = useState({});
  const [jitsuEventData, setJitsuEventData] = useState([]);
  const [sendQuizEventData, setSendQuizEventData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let searchParams = null;
  if (typeof window !== "undefined") {
    searchParams = new URLSearchParams(window.location.search);
  }

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

  const handleFormSubmission = async (e, next) => {
    e?.preventDefault();
    setIsLoading(true);

    setQuizData(formData);

    const { email, phoneNumber } = formData;

    const isLongForm =
      searchParams && searchParams.get("formtype") === "f" ? true : false;

    if (
      isLongForm &&
      json.config &&
      json.config.pabblyUrl &&
      email &&
      phoneNumber
    ) {
      await saveQuizModuleSubmission(json.config.pabblyUrl, formData);
    }

    sendJitsuEvent(jitsuEventData);

    const quizData = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || "{}"
    );

    // Jitsu Track Event
    window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
      user_id: localStorage.getItem("user_id") || "",
      session_id: sessionStorage.getItem("session_id") || "",
      ...quizData,
    });

    // Jitus Identify Event
    sendDataToJitsuIdentifyEvent({
      user_id: localStorage.getItem("user_id") || "",
      session_id: sessionStorage.getItem("session_id") || "",
      ...quizData,
    });

    // Push quiz data to GTM
    setTimeout(() => {
      pushLocalDataToDataLayer();
    }, 500);

    // Handle end node redirect logic
    setTimeout(() => {
      handleEndNodeRedirect(json.quizJson, currentSlide, next);
    }, 1500);
  };

  useEffect(() => {
    const currentSlideNodes = json?.quizJson?.find(
      (element) => element.quizCardId === String(currentSlide)
    );

    setJitsuEventData((prev) => {
      let newEventData = [];
      let previousStep = JSON.parse(
        sessionStorage.getItem(LOCAL_STORAGE_QUIZ_HISTORY) || "[]"
      );
      previousStep =
        previousStep.length > 0 ? previousStep[previousStep.length - 1] : "-";

      currentSlideNodes.nodes.forEach((node) => {
        newEventData.push({
          previousStep,
          nodeName: node?.nodeName,
        });
      });

      return newEventData;
    });
  }, [currentSlide]);

  useEffect(() => {
    if (sendQuizEventData && json.config) {
      console.log("sendQuizEventData", sendQuizEventData);
      setTimeout(() => {
        sendJitsuEvent(jitsuEventData);
      }, 500);

      setSendQuizEventData(false);
    }

    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [jitsuEventData, sendQuizEventData, isLoading]);

  useEffect(() => {
    const handlePageShow = () => {
      setIsLoading(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <QuizConfigContext.Provider value={json.config}>
      {isLoading && <LoadingScreen />}
      <form className="quiz-builder__form" onSubmit={handleFormSubmission}>
        <RenderNodes
          quizNodes={json.quizJson}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          setFormData={setFormData}
          setJitsuEventData={setJitsuEventData}
          sendQuizEventData={sendQuizEventData}
          setSendQuizEventData={setSendQuizEventData}
          handleFormSubmit={handleFormSubmission}
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
