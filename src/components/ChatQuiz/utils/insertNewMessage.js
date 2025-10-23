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

const insertNewMessage = async (chat, index) => {
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
          buttonDiv.appendChild(button);
          lastElement.appendChild(buttonDiv);
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
