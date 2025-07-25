import { JITSU_EVENT, LOCAL_STORAGE_QUIZ_VALUES } from "../constants";

export async function sendDataToJitsuEvent(url, data) {
  const EVENT_DATA = JSON.parse(data);
  let user_id = localStorage.getItem("user_id");
  if (!user_id) {
    user_id = `user_id_${crypto.randomUUID()}`;
    localStorage.setItem("user_id", user_id);
  }
  try {
    window?.jitsu?.track(JITSU_EVENT.QUIZ_DATA, {
      user_id,
      session_id: sessionStorage.getItem("session_id") || "",
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
