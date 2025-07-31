// Utility to save query params to localStorage under LOCAL_STORAGE_QUIZ_VALUES
import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants";

export function saveQueryParamsToLocalStorage() {
  if(typeof window === "undefined" || !window.location) return null;
  const params = new URLSearchParams(window.location.search);
  const queryObj = {};
  for (const [key, value] of params.entries()) {
    queryObj[key] = value;
  }
  if (Object.keys(queryObj).length > 0) {
    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, ...queryObj })
    );
  }
}
