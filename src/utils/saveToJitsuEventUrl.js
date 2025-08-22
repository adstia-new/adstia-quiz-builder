import React from 'react';
import { JITSU_EVENT } from '../constants';
import { getESTISOString } from './dateTimeUtils';
import {
  getConnectionType,
  getCurrentSlug,
  getCurrentUrl,
  getDomainName,
  getScreenResolution,
} from './windowUtils';
import { getLeadIdTokenValue } from './getLeadIdTokenValue';

export async function sendDataToJitsuEvent(data) {
  const EVENT_DATA = JSON.parse(data);
  let nodeName = EVENT_DATA.questionKey;
  nodeName = nodeName?.split('_')?.slice(1)?.join('_') || nodeName;

  let answerValue = EVENT_DATA.answer;

  if (nodeName === 'phoneNumber') {
    answerValue = answerValue?.replace(/\D/g, '')?.slice(-10);
  }

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

export const sendDataToJitsuIdentifyEvent = (data) => {
  let user_id = localStorage.getItem('user_id');
  if (!user_id) {
    user_id = `user_id_${crypto.randomUUID()}`;
    localStorage.setItem('user_id', user_id);
  }

  let jsonData = data;

  if (data.phoneNumber) {
    let phoneNumber = data.phoneNumber?.replace(/\D/g, '')?.slice(-10);

    jsonData = {
      ...data,
      phoneNumber,
    };
  }

  try {
    const sessionId = sessionStorage.getItem('session_id') || '';
    window?.jitsu?.identify(user_id, {
      ...jsonData,
      session_id: sessionId,
      $insert_id: sessionId,
    });
  } catch (err) {
    console.error('Failed to send data to Jitsu identify:', err);
  }
};

export const sendJitsuEvent = (jitsuEventData) => {
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

export const sendJitsuLeadSubmitEvent = (jitsuEventData) => {
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

  window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
    user_id: localStorage.getItem('user_id') || '',
    session_id: sessionStorage.getItem('session_id') || '',
    ...jsonData,
  });
};
