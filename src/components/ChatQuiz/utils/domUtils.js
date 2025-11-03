const { CSS_CLASSES, ROLES } = require('../constants');

const createElement = (tagName, className, textContent = '') => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

const createProfileImage = (config, role) => {
  const profileImg = document.createElement('img');
  profileImg.src = config[role].profileImage;
  profileImg.className = CSS_CLASSES.PROFILE_IMAGE;
  profileImg.alt = config[role].name || (role === ROLES.AGENT ? 'Agent' : 'User');
  return profileImg;
};

const createSpacer = () => {
  const spacer = document.createElement('div');
  spacer.style.width = '30px';
  spacer.style.height = '30px';
  return spacer;
};

const createMessageWrapper = (role, config, isLastInSequence = true) => {
  const messageWrapper = document.createElement('div');
  messageWrapper.className = `${CSS_CLASSES.MESSAGE_WITH_PROFILE} chat-quiz__message--${role}`;

  if (isLastInSequence && config && config[role] && config[role].profileImage) {
    messageWrapper.appendChild(createProfileImage(config, role));
  } else if (isLastInSequence) {
    messageWrapper.appendChild(createSpacer());
  }

  const messageContent = createElement('div', CSS_CLASSES.MESSAGE_CONTENT);

  return { messageWrapper, messageContent };
};

const createLoaderElement = () => {
  const loaderContainer = createElement('div', CSS_CLASSES.LOADER_CONTAINER);
  const dotLoader = createElement('div', CSS_CLASSES.DOT_LOADER);
  const dot1 = createElement('div', `${CSS_CLASSES.DOT} ${CSS_CLASSES.DOT_1}`);
  const dot2 = createElement('div', `${CSS_CLASSES.DOT} ${CSS_CLASSES.DOT_2}`);
  const dot3 = createElement('div', `${CSS_CLASSES.DOT} ${CSS_CLASSES.DOT_3}`);

  dotLoader.appendChild(dot1);
  dotLoader.appendChild(dot2);
  dotLoader.appendChild(dot3);
  loaderContainer.appendChild(dotLoader);

  return loaderContainer;
};

const scrollToBottom = () => {
  requestAnimationFrame(() => {
    const chatContainer = document.querySelector('.chat-quiz__container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

module.exports = {
  createElement,
  createProfileImage,
  createSpacer,
  createMessageWrapper,
  createLoaderElement,
  scrollToBottom,
};
