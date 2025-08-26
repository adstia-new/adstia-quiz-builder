function preservePlaceholders(str) {
  return str.replace(/\{\{.*?\}\}/g, (m) => encodeURIComponent(m));
}

export function mergeUrlWithParams(baseUrl, extraParams) {
  if (typeof window === 'undefined') return null;

  const safeBase = preservePlaceholders(baseUrl);
  const url = new URL(safeBase, window.location.origin);

  extraParams.forEach((value, key) => {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  url.searchParams.set('user_id', localStorage.getItem('user_id') || '');
  url.searchParams.set('referral_d', window.location.host || '');

  return decodeURIComponent(url.toString());
}
