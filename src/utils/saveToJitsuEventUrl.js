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

export async function sendDataToJitsuEvent(data) {
  if (typeof window === 'undefined') return null;

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
  if (typeof window === 'undefined') return null;

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
    // const sessionId = sessionStorage.getItem('session_id') || '';
    const {
      user_id: _user_id,
      os: _os,
      osVersion: _os_version,
      browser: _browser,
      browserVersion: _browser_version,
      device: _device,
      deviceModel: _device_model,
      longitude: _longitude,
      latitude: _latitude,
      connectionType: _connection_type,
      countryCode: _country_code,
      finalUrl: _final_url,
      ipAddress: _ip_address,
      screenResolution: _screen_resolution,
      userAgent: _user_agent,
      domainName: _domain_name,
      domainSlug: _domain_slug,
      stateCode: _state_code,
      city: _website_city,
      state: _website_state,
      country: _website_country,
      zipcode: _website_zip,
      session_id: _session_id,
      phoneNumber: _phoneNumber,
      ...dataToSendInIdentifyEvent
    } = jsonData;

    const sendThisDataInIdentify = {
      ...dataToSendInIdentifyEvent,
      $os_version: _os_version,
      $brand: _device,
      $model: _device_model,
      $radio: _connection_type,
      $current_url: _final_url,
      ip: _ip_address,
      $screen_width: window.screen.width,
      $screen_height: window.screen.height,
      $session_id: _session_id,
      $user_agent: _user_agent,
      $domain_slug: _domain_slug,
      $host: _domain_name,
      $state_code: _state_code,
      $zip_code: _website_zip,
      $insert_id: _session_id,
      $phone: _phoneNumber,
    };

    window?.jitsu?.identify(user_id, sendThisDataInIdentify);
  } catch (err) {
    console.error('Failed to send data to Jitsu identify:', err);
  }
};

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

export const sendJitsuLeadSubmitEvent = (jitsuEventData) => {
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

  window?.jitsu?.track(JITSU_EVENT.LEAD_SUBMIT, {
    user_id: localStorage.getItem('user_id') || '',
    session_id: sessionStorage.getItem('session_id') || '',
    ...jsonData,
  });
};
