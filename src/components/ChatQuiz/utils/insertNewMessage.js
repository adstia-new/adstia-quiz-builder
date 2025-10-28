const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');

const CSS_CLASSES = {
  LOADER_CONTAINER: 'chat-quiz__loader',
  PROFILE_IMAGE: 'chat-quiz__profile-image',
  MESSAGE_WITH_PROFILE: 'chat-quiz__message--with-profile',
  MESSAGE_CONTENT: 'chat-quiz__message-content',
  AGENT_CHAT_CONTAINER: 'chat-quiz__message--agent',
  USER_CHAT_CONTAINER: 'chat-quiz__message--user',
  BUTTON_CONTAINER: 'chat-quiz__button-container',
  INPUT_CONTAINER: 'chat-quiz__input-container',
  CHAT_INPUT: 'chat-quiz__input',
  SUBMIT_BUTTON: 'chat-quiz__submit-button',
  OPTIONS_CONTAINER: 'chat-quiz__options-container',
  OPTION_BUTTON: 'chat-quiz__option-button',
  DOT_LOADER: 'chat-quiz__dot-loader',
  DOT: 'chat-quiz__dot',
  DOT_1: 'chat-quiz__dot--1',
  DOT_2: 'chat-quiz__dot--2',
  DOT_3: 'chat-quiz__dot--3',
  CHAT_QUIZ_CONTAINER: 'chat-quiz__container',
};

const ROLES = {
  AGENT: 'agent',
  USER: 'user',
};

const getQuizValues = () => {
  try {
    const existingValues = localStorage.getItem('quizValues');
    return existingValues ? JSON.parse(existingValues) : {};
  } catch (error) {
    console.warn('Error parsing quizValues from localStorage:', error);
    return {};
  }
};

const saveQuizValues = (key, value) => {
  const quizValues = getQuizValues();
  quizValues[key] = value;
  localStorage.setItem('quizValues', JSON.stringify(quizValues));
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

const createElement = (tagName, className, textContent = '') => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

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

const scrollToBottom = () => {
  requestAnimationFrame(() => {
    const chatContainer = document.querySelector('.chat-quiz-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
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

const handleButtonMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const buttonDiv = createElement('div', CSS_CLASSES.BUTTON_CONTAINER);
  const button = createElement('button', '', chat.button.text);

  button.addEventListener('click', () => {
    if (chat.button.onClick) {
      chat.button.onClick();
    }

    if (chat.button.type === 'ringba') {
      if (continueCallback) {
        continueCallback();
      }
    } else {
      handleInteractionCleanup(
        buttonDiv,
        chatSectionElement,
        chat.button.text,
        config,
        continueCallback
      );
    }
  });

  buttonDiv.appendChild(button);
  agentChatDiv.appendChild(buttonDiv);
};

const handleInputMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const inputContainer = createElement('div', CSS_CLASSES.INPUT_CONTAINER);
  const inputField = createElement('input', CSS_CLASSES.CHAT_INPUT);

  inputField.type = 'text';
  inputField.name = chat.input.name;
  inputField.placeholder = `Enter ${chat.input.name}...`;

  if (chat.input.fixedValue) {
    inputField.value = chat.input.fixedValue;
  }

  const submitButton = createElement(
    'button',
    CSS_CLASSES.SUBMIT_BUTTON,
    chat.input.buttonText || 'Submit'
  );

  const handleSubmit = () => {
    const inputValue = inputField.value.trim();

    if (inputValue) {
      let displayValue = inputValue;

      if (chat.input.name === 'age') {
        const currentYear = new Date().getFullYear();
        const birthYear = parseInt(inputValue);
        const age = currentYear - birthYear;

        saveQuizValues('age', age.toString());

        displayValue = age.toString();
      }

      handleInteractionCleanup(
        inputContainer,
        chatSectionElement,
        displayValue,
        config,
        continueCallback,
        inputValue
      );
    }
  };

  submitButton.addEventListener('click', handleSubmit);

  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  inputContainer.appendChild(inputField);
  inputContainer.appendChild(submitButton);
  agentChatDiv.appendChild(inputContainer);

  setTimeout(() => inputField.focus(), 100);
};

const handleOptionsMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const optionsContainer = createElement('div', CSS_CLASSES.OPTIONS_CONTAINER);

  chat.options.options.forEach((optionText) => {
    const optionButton = createElement('button', CSS_CLASSES.OPTION_BUTTON, optionText);

    optionButton.addEventListener('click', () => {
      if (chat.options.name === 'medicarePartAB' && optionText === 'No') {
        window.location.href = 'https://lander8ert.benefits-advisor.org/blogs';
        return;
      }

      if (chat.options.name) {
        saveQuizValues(chat.options.name, optionText);
      }

      handleInteractionCleanup(
        optionsContainer,
        chatSectionElement,
        optionText,
        config,
        continueCallback
      );
    });

    optionsContainer.appendChild(optionButton);
  });

  agentChatDiv.appendChild(optionsContainer);
};

const handleConsecutiveMessage = async (
  chat,
  lastMessageContent,
  chatSectionElement,
  continueCallback,
  config
) => {
  if (chat.role === ROLES.AGENT) {
    const agentChatDiv = createElement('div', CSS_CLASSES.AGENT_CHAT_CONTAINER);

    if (chat.button) {
      handleButtonMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.input) {
      handleInputMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.options) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      lastMessageContent.appendChild(agentChatDiv);
      await displayMessageWithLoading(agentChatDiv, chat.text);
    }

    if (chat.button || chat.input || chat.options) {
      lastMessageContent.appendChild(agentChatDiv);

      scrollToBottom();
    }
  }
};

const newMessageBasedOnRole = async (
  chat,
  chatSectionElement,
  config,
  isLastInSequence = true,
  continueCallback
) => {
  if (chat.role === ROLES.AGENT) {
    const { messageWrapper, messageContent } = createMessageWrapper(
      ROLES.AGENT,
      config,
      isLastInSequence
    );
    const agentChatDiv = createElement('div', CSS_CLASSES.AGENT_CHAT_CONTAINER);

    if (chat.button) {
      handleButtonMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.input) {
      handleInputMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.options) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      messageContent.appendChild(agentChatDiv);
      messageWrapper.appendChild(messageContent);
      chatSectionElement.appendChild(messageWrapper);

      await displayMessageWithLoading(agentChatDiv, chat.text);
    }

    if (chat.button || chat.input || chat.options) {
      messageContent.appendChild(agentChatDiv);
      messageWrapper.appendChild(messageContent);
      chatSectionElement.appendChild(messageWrapper);

      scrollToBottom();
    }
  } else if (chat.role === ROLES.USER) {
    const { messageWrapper, messageContent } = createMessageWrapper(
      ROLES.USER,
      config,
      isLastInSequence
    );
    const userChatDiv = createElement('div', CSS_CLASSES.USER_CHAT_CONTAINER);

    messageContent.appendChild(userChatDiv);
    messageWrapper.appendChild(messageContent);
    chatSectionElement.appendChild(messageWrapper);

    await displayMessageWithLoading(userChatDiv, chat.text);
  }
};

const insertNewMessage = async (chat, index, continueCallback, config) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    let isConsecutiveMessage = false;
    let lastMessageContent = null;

    if (chatSectionElement.children.length > 0) {
      const lastWrapper = chatSectionElement.children[chatSectionElement.children.length - 1];

      if (lastWrapper.classList.contains(CSS_CLASSES.MESSAGE_WITH_PROFILE)) {
        const isLastAgent = lastWrapper.classList.contains(`chat-quiz__message--${ROLES.AGENT}`);
        const isCurrentAgent = chat.role === ROLES.AGENT;

        if (isLastAgent === isCurrentAgent) {
          isConsecutiveMessage = true;
          lastMessageContent = lastWrapper.querySelector('.chat-quiz__message-content');
        }
      }
    }

    if (isConsecutiveMessage && lastMessageContent) {
      await handleConsecutiveMessage(
        chat,
        lastMessageContent,
        chatSectionElement,
        continueCallback,
        config
      );
    } else {
      await newMessageBasedOnRole(chat, chatSectionElement, config, true, continueCallback);
    }
  }
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

module.exports = insertNewMessage;
