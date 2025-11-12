import { COOKIE_ANONYMOUS_ID, JITSU_EVENT } from '../constants';
import { getESTISOString } from './dateTimeUtils';
import { getCookie } from './getCookie';
import {
  getConnectionType,
  getCurrentSlug,
  getCurrentUrl,
  getDomainName,
  getScreenResolution,
} from './windowUtils';

export async function sendDataToJitsuEvent(data) {
  if (typeof window === 'undefined') return null;

  const EVENT_DATA = JSON.parse(data);
  let nodeName = EVENT_DATA.questionKey;
  nodeName = nodeName?.split('_')?.slice(1)?.join('_') || nodeName;

  let answerValue = EVENT_DATA.answer || false;

  let user_id = localStorage.getItem('user_id');
  if (!user_id) {
    user_id = `user_id_${crypto.randomUUID()}`;
    localStorage.setItem('user_id', user_id);
  }

  try {
    const sessionId = sessionStorage.getItem('session_id') || '';

    window?.jitsu?.track(JITSU_EVENT.QUIZ_DATA, {
      user_id,
      session_id: sessionId,
      question_key: EVENT_DATA.questionKey,
      answer_value: answerValue,
      current_step: EVENT_DATA.currentStep,
      previous_step: EVENT_DATA.previousStep,
      next_step: EVENT_DATA.nextStep,
    });
  } catch (err) {
    console.error('Failed to send data to Jitsu:', err);
  }
}

export const sendJitsuEvent = (jitsuEventData) => {
  if (typeof window === 'undefined') return null;

  const domainName = getDomainName();
  const slug = getCurrentSlug();
  const dateTime = getESTISOString();
  const previousStep =
    jitsuEventData?.length > 0 && jitsuEventData[0].previousStep
      ? jitsuEventData[0].previousStep
      : '-';

  if (jitsuEventData?.length > 0) {
    jitsuEventData.forEach((eventData) => {
      const { nodeName, ...data } = eventData;

      sendDataToJitsuEvent(
        JSON.stringify({
          ...data,
          domain: domainName,
          slug,
          dateTime,
          previousStep,
        })
      );
    });
  }
};

export const sendJitsuLeadSubmitEvent = async (jitsuEventData) => {
  if (typeof window === 'undefined') return null;

  const domainName = getDomainName();
  const domainSlug = getCurrentSlug();
  const finalUrl = getCurrentUrl();
  const screenResolution = getScreenResolution();
  const connectionType = getConnectionType();

  let jsonData = {
    ...jitsuEventData,
    domainName,
    domainSlug,
    finalUrl,
    screenResolution,
    connectionType,
  };

  if (jitsuEventData.phoneNumber) {
    let phoneNumber = jitsuEventData.phoneNumber?.replace(/\D/g, '')?.slice(-10);
    jsonData = {
      ...jsonData,
      phoneNumber,
    };
  }

  const { user_id: userId, ...leadSubmitData } = jsonData;

  window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
    ...leadSubmitData,
    userId: localStorage.getItem('user_id') || '',
    session_id: sessionStorage.getItem('session_id') || '',
  });

  try {
    const { user_id: userId, session_id: sessionId, ...data } = jsonData;
    await fetch('https://server.adstiacms.com/api/save-lead-submit-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        anonymousId: getCookie(COOKIE_ANONYMOUS_ID),
        userId: userId || localStorage.getItem('user_id') || '',
        sessionId: sessionId || sessionStorage.getItem('session_id') || '',
        ...data,
      }),
    });
  } catch (e) {
    console.error('Failed to save leads data');
  }
};
