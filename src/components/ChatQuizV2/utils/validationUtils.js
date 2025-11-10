export const validateDob = (year) => {
  const todaysDate = new Date();

  if (year > 1900 && year < todaysDate?.getFullYear()) return true;

  return false;
};

export const validateTextInput = (input) => {
  return input?.length > 0;
};

export const validateZipcode = (zipcode) => {
  return /^\d+$/.test(zipcode) && zipcode?.toString()?.length === 5;
};
