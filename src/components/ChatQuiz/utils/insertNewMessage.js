const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');

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

const newMessageBasedOnRole = async (chat, chatSectionElement) => {
  if (chat.role === 'agent') {
    const agentChatDiv = document.createElement('div');
    agentChatDiv.className = 'agent-chat-container';

    const loadingP = createLoaderElement();
    agentChatDiv.appendChild(loadingP);
    chatSectionElement.appendChild(agentChatDiv);
    await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
    agentChatDiv.removeChild(loadingP);

    const messageP = document.createElement('p');
    messageP.textContent = chat.text;
    agentChatDiv.appendChild(messageP);
  } else if (chat.role === 'user') {
    const userChatDiv = document.createElement('div');
    userChatDiv.className = 'user-chat-container';

    const loadingP = createLoaderElement();
    userChatDiv.appendChild(loadingP);
    chatSectionElement.appendChild(userChatDiv);
    await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
    userChatDiv.removeChild(loadingP);

    const messageP = document.createElement('p');
    messageP.textContent = chat.text;
    userChatDiv.appendChild(messageP);
  }
};

const insertNewMessage = async (chat, index, continueCallback) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    if (chatSectionElement.children.length > 0) {
      const lastElement = chatSectionElement.children[chatSectionElement.children.length - 1];

      if (lastElement.classList.contains('agent-chat-container') && chat.role === 'agent') {
        const loadingP = createLoaderElement();
        lastElement.appendChild(loadingP);
        await new Promise((resolve) => setTimeout(resolve, DEFAULT_MESSAGE_TIME_INTERVAL));
        lastElement.removeChild(loadingP);

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

            // Add the user response message
            const userChatDiv = document.createElement('div');
            userChatDiv.className = 'user-chat-container';
            const messageP = document.createElement('p');
            messageP.textContent = chat.button.text;
            userChatDiv.appendChild(messageP);
            chatSectionElement.appendChild(userChatDiv);

            // Continue the chat sequence, passing the button text
            if (continueCallback) {
              continueCallback(chat.button.text);
            }
          });

          buttonDiv.appendChild(button);
          lastElement.appendChild(buttonDiv);
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

              // Add the user response message with calculated age (if applicable) or input value
              const userChatDiv = document.createElement('div');
              userChatDiv.className = 'user-chat-container';
              const messageP = document.createElement('p');
              messageP.textContent = displayValue;
              userChatDiv.appendChild(messageP);
              chatSectionElement.appendChild(userChatDiv);

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
          lastElement.appendChild(inputContainer);

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

              // Add the user response message
              const userChatDiv = document.createElement('div');
              userChatDiv.className = 'user-chat-container';
              const messageP = document.createElement('p');
              messageP.textContent = optionText;
              userChatDiv.appendChild(messageP);
              chatSectionElement.appendChild(userChatDiv);

              // Continue the chat sequence, passing the selected option
              if (continueCallback) {
                continueCallback(optionText);
              }
            });

            optionsContainer.appendChild(optionButton);
          });

          lastElement.appendChild(optionsContainer);
        } else {
          const messageP = document.createElement('p');
          messageP.textContent = chat.text;
          lastElement.appendChild(messageP);
        }
      } else {
        await newMessageBasedOnRole(chat, chatSectionElement);
      }
    } else {
      await newMessageBasedOnRole(chat, chatSectionElement);
    }
  }
};

module.exports = insertNewMessage;
