import { QUIZ_MODULE_SUBMISSION_URL } from "../constants";

export async function saveQuizModuleSubmission(pabblyUrl, data) {
  try {
    const response = await fetch(QUIZ_MODULE_SUBMISSION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pabblyUrl: pabblyUrl,
        userId: localStorage.getItem("user_id") || "",
        data: {
          fname: data.fname || "",
          lname: data.lname || "",
          email: data.email || "",
          phone: data.phoneNumber || "",
          websiteZip: data.websiteZip || "",
        },
      }),
    });

    return await response.json();
  } catch (e) {
    console.error("Error while Submitting formData", e);
  }
}
