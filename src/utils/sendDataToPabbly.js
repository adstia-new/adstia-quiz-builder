// Utility to send localStorage quiz values to Pabbly URL
import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants";

export async function sendDataToPabbly(url) {
  const payload = localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES);
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });
  } catch (err) {
    console.error("Failed to send data to Pabbly URL:", err);
  }
}
