const { DEFAULT_MESSAGE_TIME_INTERVAL } = require('../constants');

const newMessageBasedOnRole = async (chat, chatSectionElement) => {
  if (chat.role === 'agent') {
    const agentChatDiv = document.createElement('div');
    agentChatDiv.className = 'agent-chat-container';

    const messageP = document.createElement('p');

    messageP.textContent = chat.text;
    agentChatDiv.appendChild(messageP);

    chatSectionElement.appendChild(agentChatDiv);
  } else if (chat.role === 'user') {
    const userChatDiv = document.createElement('div');
    userChatDiv.className = 'user-chat-container';

    const messageP = document.createElement('p');
    messageP.textContent = chat.text;
    userChatDiv.appendChild(messageP);

    chatSectionElement.appendChild(userChatDiv);
  }
};

const insertNewMessage = async (chat, index) => {
  const chatSectionElement = document.getElementById('chats-section');

  if (chatSectionElement) {
    if (chatSectionElement.children.length > 0) {
      const lastElement = chatSectionElement.children[chatSectionElement.children.length - 1];

      if (lastElement.classList.contains('agent-chat-container') && chat.role === 'agent') {
        const messageP = document.createElement('p');
        messageP.textContent = chat.text;
        lastElement.appendChild(messageP);
      } else {
        await newMessageBasedOnRole(chat, chatSectionElement);
      }
    } else {
      await newMessageBasedOnRole(chat, chatSectionElement);
    }
  }
};

module.exports = insertNewMessage;
