import { LOCAL_STORAGE_QUIZ_VALUES } from '../constants/index';
import { getAnonymousId } from './getAnonymousId';

export const pushLocalDataToDataLayer = (eventName = 'quiz') => {
  const user_id = localStorage.getItem('user_id') || '';
  const session_id = sessionStorage.getItem('session_id') || '';
  const anonymous_id = getAnonymousId() || '';
  const storedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');

  let data = {};
  Object.entries(storedData).forEach((savedData) => {
    data = {
      ...data,
      [savedData[0]]: savedData[1],
    };
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    data: { ...data, user_id, session_id, anonymous_id },
  });
};
