// Utility to send localStorage quiz values to Pabbly URL
import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants";

export async function sendDataToPabbly(url, datazAppData) {
  let payload = localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES);

  if (datazAppData) {
    payload = {
      ...JSON.parse(payload || "{}"),
      ...datazAppData,
    };
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to send data to Pabbly URL:", err);
  }
}
