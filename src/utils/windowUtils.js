export const getDomainName = () => {
  const location = window.location;

  return location.host;
};

export const getCurrentURL = () => {
  const location = window.location;

  return location.href;
};

export const getCurrentSlug = () => {
  const location = window.location;

  return location.pathname;
};

export const getScreenResolutionStr = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  return `${width}x${height}`;
};
