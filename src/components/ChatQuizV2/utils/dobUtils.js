export const getCurrentAge = (year) => {
  const currentYear = new Date().getFullYear();

  return currentYear - year;
};
