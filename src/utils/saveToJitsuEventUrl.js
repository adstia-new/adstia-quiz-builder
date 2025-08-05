import { JITSU_EVENT, LOCAL_STORAGE_QUIZ_VALUES } from "../constants";
import { getESTISOString } from "./dateTimeUtils";
import { getCurrentSlug, getDomainName } from "./windowUtils";

export async function sendDataToJitsuEvent(data) {
  const EVENT_DATA = JSON.parse(data);
  let nodeName = EVENT_DATA.questionKey;
  nodeName = nodeName?.split("_")?.slice(1)?.join("_") || nodeName;
  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    user_id = `user_id_${crypto.randomUUID()}`;
    localStorage.setItem("user_id", user_id);
  }
  try {
    const sessionId = sessionStorage.getItem("session_id") || "";
    window?.jitsu?.identify(user_id, {
      [nodeName]: EVENT_DATA.answer,
      session_id: sessionId,
      $insert_id: sessionId,
    });
    window?.jitsu?.track(JITSU_EVENT.QUIZ_DATA, {
      user_id,
      session_id: sessionId,
      question_key: EVENT_DATA.questionKey,
      answer_value: EVENT_DATA.answer,
      current_step: EVENT_DATA.currentStep,
      previous_step: EVENT_DATA.previousStep,
      next_step: EVENT_DATA.nextStep,
    });
  } catch (err) {
    console.error("Failed to send data to Jitsu:", err);
  }
}

export const sendDataToJitsuIdentifyEvent = (data) => {
  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    user_id = `user_id_${crypto.randomUUID()}`;
    localStorage.setItem("user_id", user_id);
  }

  try {
    const sessionId = sessionStorage.getItem("session_id") || "";
    window?.jitsu?.identify(user_id, {
      ...data,
      session_id: sessionId,
      $insert_id: sessionId,
    });
  } catch (err) {
    console.error("Failed to send data to Jitsu identify:", err);
  }
};

export const sendJitsuEvent = (jitsuEventData) => {
  const domainName = getDomainName();
  const slug = getCurrentSlug();
  const dateTime = getESTISOString();
  const previousStep =
    jitsuEventData?.length > 0 && jitsuEventData[0].previousStep
      ? jitsuEventData[0].previousStep
      : "-";

  if (jitsuEventData?.length > 0) {
    jitsuEventData.forEach((eventData) => {
      const { nodeName, ...data } = eventData;

      sendDataToJitsuEvent(
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
