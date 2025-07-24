import { LOCAL_STORAGE_QUIZ_VALUES } from "../constants/index";

export const pushLocalDataToDataLayer = () => {
  const storedData = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || "{}"
  );

  let data = {};
  Object.entries(storedData).forEach((savedData) => {
    data = {
      ...data,
      [savedData[0]]: savedData[1],
    };
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "quiz",
    data: data,
  });
};
