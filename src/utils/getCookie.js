export const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    // Trim leading whitespace from the cookie string
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    // Check if this cookie starts with the desired name
    if (cookie.indexOf(name + '=') === 0) {
      // Return the value part of the cookie
      return cookie.substring(name.length + 1);
    }
  }
  return null; // Return null if the cookie is not found
};
