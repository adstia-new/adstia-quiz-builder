const { CSS_CLASSES } = require('./constants');
const { createElement } = require('./domUtils');

const showErrorMessage = (message, inputContainer) => {
  // Remove existing error message if any
  const existingError = inputContainer.querySelector(`.${CSS_CLASSES.ERROR_MESSAGE}`);
  if (existingError) {
    existingError.remove();
  }

  // Create and show new error message
  const errorElement = createElement('div', CSS_CLASSES.ERROR_MESSAGE, message);
  inputContainer.appendChild(errorElement);

  // Remove error message after 3 seconds
  setTimeout(() => {
    if (errorElement.parentNode) {
      errorElement.remove();
    }
  }, 3000);
};

const validateYear = (yearValue, inputContainer) => {
  // Check if input is exactly 4 digits
  if (yearValue.length !== 4) {
    showErrorMessage('Please enter a 4-digit year (e.g., 1990)', inputContainer);
    return false;
  }

  // Additional validation to ensure it's a valid year
  const year = parseInt(yearValue);
  const currentYear = new Date().getFullYear();

  if (isNaN(year) || year < 1900 || year > currentYear) {
    showErrorMessage('Please enter a valid year', inputContainer);
    return false;
  }

  return true;
};

module.exports = {
  showErrorMessage,
  validateYear,
};
