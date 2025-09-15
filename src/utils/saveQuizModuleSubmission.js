import {
  COOKIE_ANONYMOUS_ID,
  LOCAL_STORAGE_QUIZ_VALUES,
  QUIZ_MODULE_SUBMISSION_URL,
  SESSION_STORAGE_SESSION_ID_KEY,
} from '../constants';
import { getCookie } from './getCookie';
import {
  getConnectionType,
  getCurrentSlug,
  getCurrentUrl,
  getDomainName,
  getScreenResolution,
} from './windowUtils';

export async function saveQuizModuleSubmission(pabblyUrl, data) {
  if (typeof window === 'undefined') return null;

  try {
    const { phoneNumber, ...formData } = data;
    const { phoneNumber: phone, ...storedData } = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}'
    );
    const searchParams = new URLSearchParams(window.location.search);

    const domainName = getDomainName();
    const domainSlug = getCurrentSlug();
    const finalUrl = getCurrentUrl();
    const screenResolution = getScreenResolution();
    const connectionType = getConnectionType();
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_SESSION_ID_KEY);
    const anonymousId = getCookie(COOKIE_ANONYMOUS_ID);

    let dataJSON = {
      ...Object.fromEntries(searchParams.entries()),
      ...storedData,
      ...formData,
      phoneNumber:
        phoneNumber?.replace(/\D/g, '')?.slice(-10) || phone?.replace(/\D/g, '')?.slice(-10),
      domainName,
      domainSlug,
      finalUrl,
      screenResolution,
      connectionType,
      sessionId,
      anonymousId,
    };

    const response = await fetch(QUIZ_MODULE_SUBMISSION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pabblyUrl: pabblyUrl,
        userId: localStorage.getItem('user_id') || '',
        data: dataJSON,
      }),
    });

    return await response.json();
  } catch (e) {
    console.error('Error while Submitting formData', e);
  }
}
