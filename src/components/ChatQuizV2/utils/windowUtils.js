export const getDomainName = () => {
  const location = window.location;

  return location.host;
};

export const getCurrentSlug = () => {
  const location = window.location;

  return location.pathname;
};

export const getCurrentUrl = () => {
  const location = window.location;

  return location.href;
};

export const getScreenResolution = () => {
  return `${window.screen.width}x${window.screen.height}`;
};

export const getConnectionType = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection ? connection.effectiveType || 'unknown' : 'unknown';
};
