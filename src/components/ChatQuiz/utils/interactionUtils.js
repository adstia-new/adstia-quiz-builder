const { createUserResponseMessage } = require('./messageUtils');

const handleInteractionCleanup = (
  elementToRemove,
  chatSectionElement,
  responseText,
  config,
  continueCallback,
  callbackValue
) => {
  elementToRemove.remove();
  createUserResponseMessage(chatSectionElement, responseText, config);
  if (continueCallback) {
    continueCallback(callbackValue || responseText);
  }
};

module.exports = {
  handleInteractionCleanup,
};
