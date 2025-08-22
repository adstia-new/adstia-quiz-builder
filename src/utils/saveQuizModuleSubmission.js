import {
  LOCAL_STORAGE_QUIZ_VALUES,
  QUIZ_MODULE_SUBMISSION_URL,
} from "../constants";
import { getLeadIdTokenValue } from "./getLeadIdTokenValue";
import {
  getConnectionType,
  getCurrentSlug,
  getCurrentUrl,
  getDomainName,
  getScreenResolution,
} from "./windowUtils";

export async function saveQuizModuleSubmission(pabblyUrl, data) {
  try {
    const { phoneNumber, ...formData } = data;
    const { phoneNumber: phone, ...storedData } = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || "{}"
    );

    const domainName = getDomainName();
    const domainSlug = getCurrentSlug();
    const finalUrl = getCurrentUrl();
    const screenResolution = getScreenResolution();
    const connectionType = getConnectionType();

    let dataJSON = {
      ...storedData,
      ...formData,
      phone: phoneNumber,
      domainName,
      domainSlug,
      finalUrl,
      screenResolution,
      connectionType,
    };

    const response = await fetch(QUIZ_MODULE_SUBMISSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pabblyUrl: pabblyUrl,
        userId: localStorage.getItem("user_id") || "",
        data: dataJSON,
      }),
    });

    return await response.json();
  } catch (e) {
    console.error("Error while Submitting formData", e);
  }
}
