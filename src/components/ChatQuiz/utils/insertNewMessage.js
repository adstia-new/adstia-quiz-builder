const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');

const scrollToBottom = () => {
  requestAnimationFrame(() => {
    const chatContainer = document.querySelector('.chat-quiz-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

const createLoaderElement = () => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loader-container';
  loadingDiv.innerHTML = `
    <div class="dot-loader">
      <div class="dot dot-1"></div>
      <div class="dot dot-2"></div>
      <div class="dot dot-3"></div>
    </div>
  `;
  return loadingDiv;
};

const handleButtonMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'button-container';
  const button = document.createElement('button');
  button.textContent = chat.button.text;

  button.addEventListener('click', () => {
    if (chat.button.onClick) {
      chat.button.onClick();
    }

    buttonDiv.remove();

    createUserResponseMessage(chatSectionElement, chat.button.text, config);

    if (continueCallback) {
      continueCallback(chat.button.text);
    }
  });

  buttonDiv.appendChild(button);
  agentChatDiv.appendChild(buttonDiv);
};

const handleInputMessage = (chat, agentChatDiv, chatSectionElement, continueCallback, config) => {
  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.name = chat.input.name;
  inputField.className = 'chat-input';
  inputField.placeholder = `Enter ${chat.input.name}...`;

  if (chat.input.fixedValue) {
    inputField.value = chat.input.fixedValue;
  }

  const submitButton = document.createElement('button');
  submitButton.textContent = chat.input.buttonText || 'Submit';
  submitButton.className = 'submit-button';

  const handleSubmit = () => {
    const inputValue = inputField.value.trim();

    if (inputValue) {
      let displayValue = inputValue;

      if (chat.input.name === 'age') {
        const currentYear = new Date().getFullYear();
        const birthYear = parseInt(inputValue);
        const age = currentYear - birthYear;

        let quizValues = {};
        try {
          const existingValues = localStorage.getItem('quizValues');
          if (existingValues) {
            quizValues = JSON.parse(existingValues);
          }
        } catch (error) {
          console.warn('Error parsing quizValues from localStorage:', error);
        }

        quizValues.age = age.toString();

        localStorage.setItem('quizValues', JSON.stringify(quizValues));

        displayValue = age.toString();
      }

      inputContainer.remove();

      createUserResponseMessage(chatSectionElement, displayValue, config);

      if (continueCallback) {
        continueCallback(inputValue);
      }
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
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options-container';

  chat.options.options.forEach((optionText) => {
    const optionButton = document.createElement('button');
    optionButton.className = 'option-button';
    optionButton.textContent = optionText;

    optionButton.addEventListener('click', () => {
      if (chat.options.name === 'medicarePartAB' && optionText === 'No') {
        window.location.href = 'https://lander8ert.benefits-advisor.org/blogs';
        return;
      }

      if (chat.options.name) {
        let quizValues = {};
        try {
          const existingValues = localStorage.getItem('quizValues');
          if (existingValues) {
            quizValues = JSON.parse(existingValues);
          }
        } catch (error) {
          console.warn('Error parsing quizValues from localStorage:', error);
        }

        quizValues[chat.options.name] = optionText;

        localStorage.setItem('quizValues', JSON.stringify(quizValues));
      }

      optionsContainer.remove();

      createUserResponseMessage(chatSectionElement, optionText, config);

      if (continueCallback) {
        continueCallback(optionText);
      }
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
  if (chat.role === 'agent') {
    const agentChatDiv = document.createElement('div');
    agentChatDiv.className = 'agent-chat-container';

    if (chat.button) {
      handleButtonMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.input) {
      handleInputMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.options) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      const loadingP = createLoaderElement();
      agentChatDiv.appendChild(loadingP);
      lastMessageContent.appendChild(agentChatDiv);

      scrollToBottom();

      await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
      agentChatDiv.removeChild(loadingP);

      const messageP = document.createElement('p');
      messageP.innerHTML = chat.text;
      agentChatDiv.appendChild(messageP);

      scrollToBottom();
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
  if (chat.role === 'agent') {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-with-profile agent';

    if (isLastInSequence && config && config.agent && config.agent.profileImage) {
      const profileImg = document.createElement('img');
      profileImg.src = config.agent.profileImage;
      profileImg.className = 'profile-image';
      profileImg.alt = config.agent.name || 'Agent';
      messageWrapper.appendChild(profileImg);
    } else if (isLastInSequence) {
      const spacer = document.createElement('div');
      spacer.style.width = '30px';
      spacer.style.height = '30px';
      messageWrapper.appendChild(spacer);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const agentChatDiv = document.createElement('div');
    agentChatDiv.className = 'agent-chat-container';

    if (chat.button) {
      handleButtonMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.input) {
      handleInputMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else if (chat.options) {
      handleOptionsMessage(chat, agentChatDiv, chatSectionElement, continueCallback, config);
    } else {
      const loadingP = createLoaderElement();
      agentChatDiv.appendChild(loadingP);
      messageContent.appendChild(agentChatDiv);
      messageWrapper.appendChild(messageContent);
      chatSectionElement.appendChild(messageWrapper);

      scrollToBottom();

      await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
      agentChatDiv.removeChild(loadingP);

      const messageP = document.createElement('p');
      messageP.innerHTML = chat.text;
      agentChatDiv.appendChild(messageP);

      scrollToBottom();
    }

    if (chat.button || chat.input || chat.options) {
      messageContent.appendChild(agentChatDiv);
      messageWrapper.appendChild(messageContent);
      chatSectionElement.appendChild(messageWrapper);

      scrollToBottom();
    }
  } else if (chat.role === 'user') {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-with-profile user';

    if (isLastInSequence && config && config.user && config.user.profileImage) {
      const profileImg = document.createElement('img');
      profileImg.src = config.user.profileImage;
      profileImg.className = 'profile-image';
      profileImg.alt = config.user.name || 'User';
      messageWrapper.appendChild(profileImg);
    } else if (isLastInSequence) {
      const spacer = document.createElement('div');
      spacer.style.width = '30px';
      spacer.style.height = '30px';
      messageWrapper.appendChild(spacer);
    }

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const userChatDiv = document.createElement('div');
    userChatDiv.className = 'user-chat-container';

    const loadingP = createLoaderElement();
    userChatDiv.appendChild(loadingP);
    messageContent.appendChild(userChatDiv);
    messageWrapper.appendChild(messageContent);
    chatSectionElement.appendChild(messageWrapper);

    scrollToBottom();

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
    userChatDiv.removeChild(loadingP);

    const messageP = document.createElement('p');
    messageP.innerHTML = chat.text;
    userChatDiv.appendChild(messageP);

    scrollToBottom();
  }
};

const insertNewMessage = async (chat, index, continueCallback, config) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    let isConsecutiveMessage = false;
    let lastMessageContent = null;

    if (chatSectionElement.children.length > 0) {
      const lastWrapper = chatSectionElement.children[chatSectionElement.children.length - 1];

      if (lastWrapper.classList.contains('message-with-profile')) {
        const isLastAgent = lastWrapper.classList.contains('agent');
        const isCurrentAgent = chat.role === 'agent';

        if (isLastAgent === isCurrentAgent) {
          isConsecutiveMessage = true;
          lastMessageContent = lastWrapper.querySelector('.message-content');
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
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-with-profile user';

  if (config && config.user && config.user.profileImage) {
    const profileImg = document.createElement('img');
    profileImg.src = config.user.profileImage;
    profileImg.className = 'profile-image';
    profileImg.alt = config.user.name || 'User';
    messageWrapper.appendChild(profileImg);
  } else {
    const spacer = document.createElement('div');
    spacer.style.width = '30px';
    spacer.style.height = '30px';
    messageWrapper.appendChild(spacer);
  }

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const userChatDiv = document.createElement('div');
  userChatDiv.className = 'user-chat-container';
  const messageP = document.createElement('p');
  messageP.textContent = text;
  userChatDiv.appendChild(messageP);

  messageContent.appendChild(userChatDiv);
  messageWrapper.appendChild(messageContent);
  chatSectionElement.appendChild(messageWrapper);

  scrollToBottom();
};

module.exports = insertNewMessage;
