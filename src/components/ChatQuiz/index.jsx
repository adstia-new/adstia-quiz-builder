import './index.css';
import React, { useEffect } from 'react';
import chatJson from './data/chatJson';
import insertNewMessage from './utils/insertNewMessage';
import AgentOnlineStatus from './components/AgentOnlineStatus';

const ChatQuiz = () => {
  useEffect(() => {
    const { chats, config } = chatJson;

    const processChatSequence = async (startIndex = 0, skipNextUserMessage = false) => {
      for (let i = startIndex; i < chats.length; i++) {
        const chat = chats[i];

        // Skip user message if it matches the button text that was just clicked
        if (skipNextUserMessage && chat.role === 'user') {
          skipNextUserMessage = false;
          continue;
        }

        if (chat.button) {
          // For button chats, wait for user interaction before continuing
          await insertNewMessage(
            chat,
            i,
            (buttonText) => {
              // Check if next message is a user message with same text as button
              const nextChat = chats[i + 1];
              const shouldSkipNext =
                nextChat && nextChat.role === 'user' && nextChat.text === buttonText;

              processChatSequence(i + 1, shouldSkipNext);
            },
            config
          );
          return; // Exit the loop, will be resumed by button click
        } else if (chat.input) {
          // For input chats, wait for user input before continuing
          await insertNewMessage(
            chat,
            i,
            (inputValue) => {
              // Check if next message is a user message with same text as input
              const nextChat = chats[i + 1];
              const shouldSkipNext =
                nextChat && nextChat.role === 'user' && nextChat.text === inputValue;

              processChatSequence(i + 1, shouldSkipNext);
            },
            config
          );
          return; // Exit the loop, will be resumed by input submission
        } else if (chat.options) {
          // For options chats, wait for user selection before continuing
          await insertNewMessage(
            chat,
            i,
            (selectedOption) => {
              // Check if next message is a user message with same text as selected option
              const nextChat = chats[i + 1];
              const shouldSkipNext =
                nextChat && nextChat.role === 'user' && nextChat.text === selectedOption;

              processChatSequence(i + 1, shouldSkipNext);
            },
            config
          );
          return; // Exit the loop, will be resumed by option selection
        } else {
          await insertNewMessage(chat, i, undefined, config);
        }
      }
    };

    processChatSequence();
  }, []);

  return (
    <div className="chat-quiz-container">
      <AgentOnlineStatus agentName={chatJson.config.agent.name} />
      <div className="chats-section" id="chats-section"></div>
    </div>
  );
};

export { ChatQuiz };
