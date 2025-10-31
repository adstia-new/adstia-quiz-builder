export function pushDataToRingbaTags(retries = 2) {
  if (retries === 0) return;

  const quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_KEY) || '{}');
  const searchParams = new URLSearchParams(window.location.search);

  const anonymousId = getCookie(COOKIE_ANONYMOUS_ID);

  const ringbaData = {
    ...quizData,
    ...Object.fromEntries(searchParams.entries()),
    user_id: localStorage.getItem('user_id') || '',
    session_id: sessionStorage.getItem('session_id') || '',
    anonymous_id: anonymousId || '',
  };

  const { screenResolution, ...filteredRingbaData } = ringbaData;

  try {
    const entries = Object.entries(filteredRingbaData);
    window._rgba_tags = window?._rgba_tags || [];

    entries.forEach((i) => {
      window?._rgba_tags?.push({ [i[0]]: i[1] });
    });

    setTimeout(() => {
      pushDataToRingbaTags(--retries);
    }, 1500);
  } catch (err) {
    console.error('Error pushing data to Ringba tags:', err);
  }
}
