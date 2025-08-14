import {
  LOCAL_STORAGE_QUIZ_VALUES,
  LOCAL_STORAGE_USER_ID_KEY,
} from "../constants";

export const replaceShortcodes = (str) => {
  if (typeof window !== "undefined") {
    const storedShortcodes = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || "{}"
    );

    const userId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY) || "";

    const shortcodes = {
      ...storedShortcodes,
      user_id: userId,
      referral_d: window.location.hostname,
    };

    const replaced = str.replace(/\{\{query\.(.*?)\}\}/g, (_, match) => {
      return shortcodes[match.trim()] || "";
    });

    if (replaced.endsWith("?")) {
      return replaced.slice(0, -1);
    }

    return replaced;
  }
  return "";
};
