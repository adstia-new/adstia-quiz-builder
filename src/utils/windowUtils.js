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
