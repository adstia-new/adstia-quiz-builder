import { getCookie } from '../../../utils/getCookie';

export async function trackCtaButtonClick(text) {
  window?.jitsu?.track('cta_click', {
    cta_text: text,
    session_id: sessionStorage.getItem('session_id') || '',
    userId: localStorage.getItem('user_id') || '',
  });

  window?.dataLayer?.push({ data: null });

  window?.dataLayer?.push({
    event: 'ctaButtonClick',
    data: {
      cta_text: text,
      session_id: sessionStorage.getItem('session_id') || '',
      user_id: localStorage.getItem('user_id') || '',
      anonymous_id: getCookie('__eventn_id') || '',
    },
  });
}
