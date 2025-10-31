const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');
const { CSS_CLASSES, ROLES } = require('../constants');
const {
  createElement,
  createMessageWrapper,
  createLoaderElement,
  scrollToBottom,
} = require('./domUtils');

const displayMessageWithLoading = async (chatDiv, messageText, timer) => {
  const loadingElement = createLoaderElement();
  chatDiv.appendChild(loadingElement);
  scrollToBottom();

  await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
  chatDiv.removeChild(loadingElement);

  const messageP = document.createElement('p');

  if (messageText && messageText.includes('{{timer}}') && timer?.count) {
    let timeLeft = timer.count;
    const initialMinutes = Math.floor(timeLeft / 60);
    const initialSeconds = timeLeft % 60;

    const initialTime = `${initialMinutes}:${initialSeconds.toString().padStart(2, '0')}`;
    messageP.innerHTML = messageText.replace('{{timer}}', initialTime);
    chatDiv.appendChild(messageP);
    scrollToBottom();

    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const span = messageP.querySelector('span');
        if (span) {
          span.innerHTML = time;
        }
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);

    return;
  }

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
