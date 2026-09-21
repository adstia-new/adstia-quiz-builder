import { getCookie } from '../../../utils/getCookie';
import { clarityEvent } from '../../../utils/clarity';

export async function trackPhoneButtonClick(phone) {
  const quizValues = (() => {
    try {
      return JSON.parse(localStorage.getItem('quizValues') || '{}');
    } catch {
      return {};
    }
  })();

  window?.jitsu?.track('phone_number_click', {
    ...quizValues,
    phone,
    session_id: sessionStorage.getItem('session_id') || '',
    userId: localStorage.getItem('user_id') || '',
  });

  clarityEvent('phone_number_click');

  window?.dataLayer?.push({ data: null });

  window?.dataLayer?.push({
    event: 'phoneNumberClick',
    data: {
      ...quizValues,
      phone,
      session_id: sessionStorage.getItem('session_id') || '',
      user_id: localStorage.getItem('user_id') || '',
      anonymous_id: getCookie('__eventn_id') || '',
    },
  });
}
