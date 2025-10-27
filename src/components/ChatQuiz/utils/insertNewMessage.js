const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');

const scrollToBottom = () => {
  // Use requestAnimationFrame to ensure DOM is updated before scrolling
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

const newMessageBasedOnRole = async (chat, chatSectionElement, config, isLastInSequence = true) => {
  if (chat.role === 'agent') {
    // Create wrapper for profile image and message content
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-with-profile agent';

    // Create profile image (only if it's the last message in sequence)
    if (isLastInSequence && config && config.agent && config.agent.profileImage) {
      const profileImg = document.createElement('img');
      profileImg.src = config.agent.profileImage;
      profileImg.className = 'profile-image';
      profileImg.alt = config.agent.name || 'Agent';
      messageWrapper.appendChild(profileImg);
    } else if (isLastInSequence) {
      // Add spacer div to maintain alignment when no profile image
      const spacer = document.createElement('div');
      spacer.style.width = '30px';
      spacer.style.height = '30px';
      messageWrapper.appendChild(spacer);
    }

    // Create message content container
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const agentChatDiv = document.createElement('div');
    agentChatDiv.className = 'agent-chat-container';

    const loadingP = createLoaderElement();
    agentChatDiv.appendChild(loadingP);
    messageContent.appendChild(agentChatDiv);
    messageWrapper.appendChild(messageContent);
    chatSectionElement.appendChild(messageWrapper);

    // Scroll to bottom when loading appears
    scrollToBottom();

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
    agentChatDiv.removeChild(loadingP);

    const messageP = document.createElement('p');
    messageP.innerHTML = chat.text;
    agentChatDiv.appendChild(messageP);

    // Scroll to bottom when message is complete
    scrollToBottom();
  } else if (chat.role === 'user') {
    // Create wrapper for profile image and message content
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-with-profile user';

    // Create profile image (only if it's the last message in sequence)
    if (isLastInSequence && config && config.user && config.user.profileImage) {
      const profileImg = document.createElement('img');
      profileImg.src = config.user.profileImage;
      profileImg.className = 'profile-image';
      profileImg.alt = config.user.name || 'User';
      messageWrapper.appendChild(profileImg);
    } else if (isLastInSequence) {
      // Add spacer div to maintain alignment when no profile image
      const spacer = document.createElement('div');
      spacer.style.width = '30px';
      spacer.style.height = '30px';
      messageWrapper.appendChild(spacer);
    }

    // Create message content container
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const userChatDiv = document.createElement('div');
    userChatDiv.className = 'user-chat-container';

    const loadingP = createLoaderElement();
    userChatDiv.appendChild(loadingP);
    messageContent.appendChild(userChatDiv);
    messageWrapper.appendChild(messageContent);
    chatSectionElement.appendChild(messageWrapper);

    // Scroll to bottom when loading appears
    scrollToBottom();

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
    userChatDiv.removeChild(loadingP);

    const messageP = document.createElement('p');
    messageP.innerHTML = chat.text;
    userChatDiv.appendChild(messageP);

    // Scroll to bottom when message is complete
    scrollToBottom();
  }
};

const insertNewMessage = async (chat, index, continueCallback, config) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    let isConsecutiveMessage = false;
    let lastMessageContent = null;

    // Check if this is a consecutive message from the same role
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
      // Add to existing message content container (no profile image)
      if (chat.role === 'agent') {
        const agentChatDiv = document.createElement('div');
        agentChatDiv.className = 'agent-chat-container';

        if (chat.button) {
          const buttonDiv = document.createElement('div');
          buttonDiv.className = 'button-container';
          const button = document.createElement('button');
          button.textContent = chat.button.text;

          // Add click handler to continue the chat sequence
          button.addEventListener('click', () => {
            // Execute the original button onClick if it exists
            if (chat.button.onClick) {
              chat.button.onClick();
            }

            // Remove the button after clicking
            buttonDiv.remove();

            // Create user response with profile image
            createUserResponseMessage(chatSectionElement, chat.button.text, config);

            // Continue the chat sequence, passing the button text
            if (continueCallback) {
              continueCallback(chat.button.text);
            }
          });

          buttonDiv.appendChild(button);
          agentChatDiv.appendChild(buttonDiv);
        } else if (chat.input) {
          const inputContainer = document.createElement('div');
          inputContainer.className = 'input-container';

          const inputField = document.createElement('input');
          inputField.type = 'text';
          inputField.name = chat.input.name;
          inputField.className = 'chat-input';
          inputField.placeholder = `Enter ${chat.input.name}...`;

          // Set fixed value if provided
          if (chat.input.fixedValue) {
            inputField.value = chat.input.fixedValue;
          }

          const submitButton = document.createElement('button');
          submitButton.textContent = chat.input.buttonText || 'Submit';
          submitButton.className = 'submit-button';

          // Add submit handler
          const handleSubmit = () => {
            const inputValue = inputField.value.trim();

            if (inputValue) {
              let displayValue = inputValue;

              // Only calculate age and save to localStorage if input name is 'age'
              if (chat.input.name === 'age') {
                // Calculate age and save to localStorage
                const currentYear = new Date().getFullYear();
                const birthYear = parseInt(inputValue);
                const age = currentYear - birthYear;

                // Get existing quizValues or create new object
                let quizValues = {};
                try {
                  const existingValues = localStorage.getItem('quizValues');
                  if (existingValues) {
                    quizValues = JSON.parse(existingValues);
                  }
                } catch (error) {
                  console.warn('Error parsing quizValues from localStorage:', error);
                }

                // Set the age value as string
                quizValues.age = age.toString();

                // Save back to localStorage
                localStorage.setItem('quizValues', JSON.stringify(quizValues));

                // Update display value to show age instead of birth year
                displayValue = age.toString();
              }

              // Remove the input container
              inputContainer.remove();

              // Create user response with profile image
              createUserResponseMessage(chatSectionElement, displayValue, config);

              // Continue the chat sequence, passing the input value
              if (continueCallback) {
                continueCallback(inputValue);
              }
            }
          };

          // Add click handler to submit button
          submitButton.addEventListener('click', handleSubmit);

          // Add enter key handler to input field
          inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          });

          inputContainer.appendChild(inputField);
          inputContainer.appendChild(submitButton);
          agentChatDiv.appendChild(inputContainer);

          // Focus on the input field
          setTimeout(() => inputField.focus(), 100);
        } else if (chat.options) {
          // Handle options message type
          const optionsContainer = document.createElement('div');
          optionsContainer.className = 'options-container';

          chat.options.options.forEach((optionText) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option-button';
            optionButton.textContent = optionText;

            optionButton.addEventListener('click', () => {
              // Save the selected option to localStorage if name is provided
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

                // Set the selected option value
                quizValues[chat.options.name] = optionText;

                // Save back to localStorage
                localStorage.setItem('quizValues', JSON.stringify(quizValues));
              }

              // Remove the options container
              optionsContainer.remove();

              // Create user response with profile image
              createUserResponseMessage(chatSectionElement, optionText, config);

              // Continue the chat sequence, passing the selected option
              if (continueCallback) {
                continueCallback(optionText);
              }
            });

            optionsContainer.appendChild(optionButton);
          });

          agentChatDiv.appendChild(optionsContainer);
        } else {
          const loadingP = createLoaderElement();
          agentChatDiv.appendChild(loadingP);
          lastMessageContent.appendChild(agentChatDiv);

          // Scroll to bottom when loading appears
          scrollToBottom();

          await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
          agentChatDiv.removeChild(loadingP);

          const messageP = document.createElement('p');
          messageP.innerHTML = chat.text;
          agentChatDiv.appendChild(messageP);

          // Scroll to bottom when message is complete
          scrollToBottom();
        }

        if (chat.button || chat.input || chat.options) {
          lastMessageContent.appendChild(agentChatDiv);

          // Scroll to bottom when interactive elements are added
          scrollToBottom();
        }
      }
    } else {
      // Create new message wrapper with profile image
      await newMessageBasedOnRole(chat, chatSectionElement, config, true);
    }
  }
};

// Helper function to create user response messages with profile images
const createUserResponseMessage = (chatSectionElement, text, config) => {
  // Create wrapper for profile image and message content
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-with-profile user';

  // Create profile image
  if (config && config.user && config.user.profileImage) {
    const profileImg = document.createElement('img');
    profileImg.src = config.user.profileImage;
    profileImg.className = 'profile-image';
    profileImg.alt = config.user.name || 'User';
    messageWrapper.appendChild(profileImg);
  } else {
    // Add spacer div to maintain alignment when no profile image
    const spacer = document.createElement('div');
    spacer.style.width = '30px';
    spacer.style.height = '30px';
    messageWrapper.appendChild(spacer);
  }

  // Create message content container
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

  // Scroll to bottom when user response is added
  scrollToBottom();
};

module.exports = insertNewMessage;
