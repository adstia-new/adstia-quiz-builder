const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');
const { CSS_CLASSES, ROLES } = require('../constants');
const {
  createElement,
  createMessageWrapper,
  createLoaderElement,
  scrollToBottom,
} = require('./domUtils');
const { trackPhoneButtonClick } = require('./trackPhoneButtonClick');

const handlePhoneClick = async (e) => {
  const phoneText = e.currentTarget.href || '';
  const phoneNumber = phoneText.replace(/[^\d]/g, '').slice(-10);
  if (typeof trackPhoneButtonClick === 'function') {
    await trackPhoneButtonClick(phoneNumber);
  }
  window.location.href = e?.target?.href;
};

const displayMessageWithLoading = async (chatDiv, chat, timer) => {
  const loadingElement = createLoaderElement();
  chatDiv.appendChild(loadingElement);
  scrollToBottom();

  await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
  chatDiv.removeChild(loadingElement);

  const messageTag = document.createElement(chat?.type === 'ringba' ? 'a' : 'p');

  if (chat?.text && chat?.type === 'ringba') {
    const ringbaNumber = chat?.text?.replace(/[^\d]/g, '').slice(-10);
    messageTag.href = `tel:+1${ringbaNumber}`;
    messageTag.style = 'color: #0e348dff; text-decoration: underline;';
    messageTag.addEventListener('click', (e) => {
      handlePhoneClick(e);
      if (continueCallback) {
        continueCallback();
      }
    });
  }

  if (chat?.text && chat?.text.includes('{{timer}}') && timer?.count) {
    let timeLeft = timer.count;
    const initialMinutes = Math.floor(timeLeft / 60);
    const initialSeconds = timeLeft % 60;

    const initialTime = `${initialMinutes}:${initialSeconds.toString().padStart(2, '0')}`;
    messageTag.innerHTML = chat?.text.replace('{{timer}}', initialTime);
    chatDiv.appendChild(messageTag);
    scrollToBottom();

    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft >= 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const time = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const span = messageTag.querySelector('span');
        if (span) {
          span.innerHTML = time;
        }
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);

    return;
  }

  messageTag.innerHTML = chat?.text;
  chatDiv.appendChild(messageTag);
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
