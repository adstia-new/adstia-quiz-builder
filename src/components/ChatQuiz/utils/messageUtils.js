const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');
const { CSS_CLASSES, ROLES } = require('../constants');
const {
  createElement,
  createMessageWrapper,
  createLoaderElement,
  scrollToBottom,
} = require('./domUtils');

const displayMessageWithLoading = async (chatDiv, messageText) => {
  const loadingElement = createLoaderElement();
  chatDiv.appendChild(loadingElement);
  scrollToBottom();

  await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
  chatDiv.removeChild(loadingElement);

  const messageP = document.createElement('p');
  messageP.innerHTML = messageText;
  chatDiv.appendChild(messageP);
  scrollToBottom();
};

const createUserResponseMessage = (chatSectionElement, text, config) => {
  const { messageWrapper, messageContent } = createMessageWrapper(ROLES.USER, config);
  const userChatDiv = createElement('div', CSS_CLASSES.USER_CHAT_CONTAINER);
  const messageP = createElement('p', '', text);
  userChatDiv.appendChild(messageP);

  messageContent.appendChild(userChatDiv);
  messageWrapper.appendChild(messageContent);
  chatSectionElement.appendChild(messageWrapper);

  scrollToBottom();
};

module.exports = {
  displayMessageWithLoading,
  createUserResponseMessage,
};
