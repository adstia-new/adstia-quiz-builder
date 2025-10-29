import './index.css';
import React, { useEffect } from 'react';
import createChatJson from './data/chatJson';
import insertNewMessage from './utils/insertNewMessage';
import AgentOnlineStatus from './components/AgentOnlineStatus';

const ChatQuiz = ({ phoneNumber = '9999999999' }) => {
  const { chats, config } = createChatJson(phoneNumber);
  useEffect(() => {
    const createInteractionCallback = (chats, currentIndex, processChatSequence) => {
      return (userResponse) => {
        const nextChat = chats[currentIndex + 1];
        const shouldSkipNext =
          nextChat && nextChat.role === 'user' && nextChat.text === userResponse;
        processChatSequence(currentIndex + 1, shouldSkipNext);
      };
    };

    const handleInteractiveMessage = async (chat, index) => {
      await insertNewMessage(
        chat,
        index,
        createInteractionCallback(chats, index, processChatSequence),
        config
      );
    };

    const shouldSkipUserMessage = (chat, skipNextUserMessage) => {
      return skipNextUserMessage && chat.role === 'user';
    };

    const processChatSequence = async (startIndex = 0, skipNextUserMessage = false) => {
      for (let i = startIndex; i < chats.length; i++) {
        const chat = chats[i];

        if (shouldSkipUserMessage(chat, skipNextUserMessage)) {
          skipNextUserMessage = false;
          continue;
        }

        if (chat.button || chat.input || chat.options) {
          await handleInteractiveMessage(chat, i);
          return;
        } else {
          await insertNewMessage(chat, i, undefined, config);
        }
      }
    };

    processChatSequence();
  }, []);

  return (
    <div className="chat-quiz__container">
      <AgentOnlineStatus agentName={config.agent.name} />
      <div className="chat-quiz__chats-section" id="chats-section"></div>
    </div>
  );
};

export { ChatQuiz };
