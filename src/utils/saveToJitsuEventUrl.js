import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants";

export async function sendDataToJitsuEvent(url, data) {
//   const payload = localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES);
  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  } catch (err) {
    console.error("Failed to send data to Pabbly URL:", err);
  }
}
