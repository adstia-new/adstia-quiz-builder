import { getCookie } from './getCookie';

export async function trackPhoneButtonClick(phone) {
  window?.jitsu?.track('phone_number_click', {
    phone,
    session_id: sessionStorage.getItem('session_id') || '',
    userId: localStorage.getItem('user_id') || '',
  });

  window?.dataLayer?.push({
    event: 'phoneNumberClick',
    data: {
      phone,
      session_id: sessionStorage.getItem('session_id') || '',
      user_id: localStorage.getItem('user_id') || '',
      anonymous_id: getCookie('__eventn_id') || '',
    },
  });
}
