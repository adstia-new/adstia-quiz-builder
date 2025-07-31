export const getAnonymousId = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "__eventn_id") {
      return decodeURIComponent(value);
    }
  }

  return null; // Cookie not found
};
