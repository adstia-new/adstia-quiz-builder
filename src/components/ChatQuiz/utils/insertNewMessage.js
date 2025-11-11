const { saveQuizValues } = require('./storageUtils');
const { createElement, createMessageWrapper, scrollToBottom } = require('./domUtils');
const { displayMessageWithLoading } = require('./messageUtils');
const { handleInteractionCleanup } = require('./interactionUtils');
const { validateYear, validateZipcode } = require('./validationUtils');
const { CSS_CLASSES, ROLES } = require('../constants');
const { saveLocationWithZipcode } = require('../../../utils/saveLocationWithZipcode');
const {
  sendDataToJitsuEvent,
  sendJitsuLeadSubmitEvent,
} = require('../../../utils/saveToJitsuEventUrl');
const { LOCAL_STORAGE_QUIZ_VALUES } = require('../../../constants');
const { pushLocalDataToDataLayer } = require('../../../utils/gtmUtils');
const { trackPhoneButtonClick } = require('./trackPhoneButtonClick');
const { trackCtaButtonClick } = require('./trackCtaButtonClick');
const { injectRingbaScript } = require('./ringbaUtils');
const { pushDataToRingbaTags } = require('./pushDataToRgbaTags');

const handlePhoneClick = async (e) => {
  const phoneText = e.currentTarget.href || '';
  const phoneNumber = phoneText.replace(/[^\d]/g, '').slice(-10);
  if (typeof trackPhoneButtonClick === 'function') {
    await trackPhoneButtonClick(phoneNumber);
  }
  window.location.href = e?.target?.href;
};

const handleCtaClick = async (e) => {
  const text = e.target.textContent;

  await trackCtaButtonClick(text);
};

const handleButtonMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const buttonDiv = createElement('div', CSS_CLASSES.BUTTON_CONTAINER);
  const button = createElement(
    chat.button.type === 'ringba' ? 'a' : 'button',
    '',
    chat.button.text
  );

  if (chat.button.type === 'ringba') {
    button.href = chat.button.href;
    button.addEventListener('click', (e) => {
      handlePhoneClick(e);
      if (continueCallback) {
        continueCallback();
      }
    });
  }

  button.addEventListener('click', (e) => {
    if (chat.button.onClick) {
      chat.button.onClick();
    }

    if (chat.button.callRingba === true) {
      injectRingbaScript(config.ringbaScriptId);
    }

    if (chat.button.type !== 'ringba') {
      handleCtaClick(e);

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
  inputField.placeholder = chat.input.placeholder || `Enter ${chat.input.name}...`;

  const fixedValue = chat.input.fixedValue || '';

  if (inputField?.name === 'zipcode') {
    inputField.addEventListener('input', (e) => {
      const currentValue = inputField?.value?.trim();

      if (currentValue?.trim()?.length === 5) {
        saveLocationWithZipcode(currentValue);
      }

      if (currentValue?.trim()?.length > 5) {
        inputField.value = currentValue.slice(0, 5);
      }
    });
  }

  if (fixedValue) {
    inputField.value = fixedValue;

    const enforceFixedValue = () => {
      const currentValue = inputField.value;

      if (!currentValue.startsWith(fixedValue)) {
        inputField.value = fixedValue;
      }

      const cursorPosition = Math.max(fixedValue.length, inputField.selectionStart);
      inputField.setSelectionRange(cursorPosition, cursorPosition);
    };

    inputField.addEventListener('input', (e) => {
      const currentValue = inputField.value;

      if (!currentValue.startsWith(fixedValue)) {
        inputField.value = fixedValue;
        inputField.setSelectionRange(fixedValue.length, fixedValue.length);
        return;
      }

      const userInput = currentValue.substring(fixedValue.length);
      const digitsOnly = userInput.replace(/\D/g, '');

      if (userInput !== digitsOnly) {
        inputField.value = fixedValue + digitsOnly;
        inputField.setSelectionRange(inputField.value.length, inputField.value.length);
      }
    });

    inputField.addEventListener('keydown', (e) => {
      const cursorPosition = inputField.selectionStart;
      if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= fixedValue.length) {
        e.preventDefault();
        inputField.setSelectionRange(fixedValue.length, fixedValue.length);
      }

      if (e.key === 'ArrowLeft' && cursorPosition <= fixedValue.length) {
        e.preventDefault();
        inputField.setSelectionRange(fixedValue.length, fixedValue.length);
      }

      if (e.key === 'Home') {
        e.preventDefault();
        inputField.setSelectionRange(fixedValue.length, fixedValue.length);
      }
    });

    inputField.addEventListener('click', enforceFixedValue);
    inputField.addEventListener('focus', enforceFixedValue);
  }

  const submitButton = createElement(
    'button',
    CSS_CLASSES.SUBMIT_BUTTON,
    chat.input.buttonText || 'Submit'
  );

  const handleSubmit = () => {
    const inputValue = inputField.value.trim();

    if (inputValue) {
      if (chat.input.name === 'age' && !validateYear(inputValue, inputContainer)) {
        return;
      }

      let displayValue = inputValue;

      if (chat.input.name === 'age') {
        const currentYear = new Date().getFullYear();
        const birthYear = parseInt(inputValue);
        const age = currentYear - birthYear;

        saveQuizValues('age', age.toString());

        displayValue = age.toString();
      }

      if (chat.input.name === 'zipcode' && !validateZipcode(inputValue, inputContainer)) {
        return;
      }

      const currentStepId = chat.input.id;

      const inputJitsuData = {
        questionKey: chat.input.name,
        answer: inputValue?.length > 0 ? true : false,
        currentStep: `${currentStepId}`,
        previousStep: currentStepId && currentStepId > 1 ? `${currentStepId - 1}` : '-',
        nextStep: `${currentStepId + 1}`,
      };

      sendDataToJitsuEvent(JSON.stringify(inputJitsuData));
      pushLocalDataToDataLayer();

      if (chat?.input?.isFinalQue) {
        const quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');

        let jsonData = {
          user_id: localStorage.getItem('user_id') || '',
          session_id: sessionStorage.getItem('session_id') || '',
          ...quizData,
        };

        sendJitsuLeadSubmitEvent(jsonData);
        pushDataToRingbaTags();
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

  setTimeout(() => {
    inputField.focus();
    if (fixedValue) {
      inputField.setSelectionRange(fixedValue.length, fixedValue.length);
    }
  }, 100);
};

const handleOptionsMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const optionsContainer = createElement('div', CSS_CLASSES.OPTIONS_CONTAINER);

  const optionsData = chat.optionsData;
  const optionsList = optionsData.options;

  optionsList.forEach((option) => {
    const optionText = typeof option === 'string' ? option : option.label;
    const optionValue = typeof option === 'string' ? option : option.value;
    const optionButton = createElement('button', CSS_CLASSES.OPTION_BUTTON, optionText);

    optionButton.addEventListener('click', () => {
      const currentStepId = optionsData.id;

      const optionJitsuData = {
        questionKey: `${optionsData.name}`,
        answer: `${optionValue?.trim()}`,
        currentStep: `${currentStepId}`,
        previousStep: currentStepId && currentStepId > 1 ? `${currentStepId - 1}` : '-',
        nextStep: `${currentStepId + 1}`,
      };
      sendDataToJitsuEvent(JSON.stringify(optionJitsuData));

      if (chat?.isFinalQue) {
        const quizData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');

        let jsonData = {
          user_id: localStorage.getItem('user_id') || '',
          session_id: sessionStorage.getItem('session_id') || '',
          ...quizData,
        };

        sendJitsuLeadSubmitEvent(jsonData);
        pushDataToRingbaTags();
      }

      if (optionsData.name === 'medicarePartAB' && optionValue?.toLowerCase() === 'no') {
        window.location.href = 'https://lander8ert.benefits-advisor.org/blogs';
        return;
      }

      if (optionsData.name) {
        saveQuizValues(optionsData.name, optionValue);
      }

      pushLocalDataToDataLayer();

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
    } else if (chat.optionsData) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      lastMessageContent.appendChild(agentChatDiv);
      await displayMessageWithLoading(agentChatDiv, chat, chat.timer);
    }

    if (chat.button || chat.input || chat.optionsData) {
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
    } else if (chat.optionsData) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      messageContent.appendChild(agentChatDiv);
      messageWrapper.appendChild(messageContent);
      chatSectionElement.appendChild(messageWrapper);

      await displayMessageWithLoading(agentChatDiv, chat);
    }

    if (chat.button || chat.input || chat.optionsData) {
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

    await displayMessageWithLoading(userChatDiv, chat);
  }
};

const insertNewMessage = async (chat, index, continueCallback, config) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    if (index === 0) {
      chatSectionElement.innerHTML = '';
    }

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

module.exports = insertNewMessage;
