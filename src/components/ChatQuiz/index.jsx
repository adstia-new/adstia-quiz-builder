import './index.css';
import React, { useEffect } from 'react';
import chatJson from './data/chatJson';
import insertNewMessage from './utils/insertNewMessage';

const ChatQuiz = () => {
  useEffect(() => {
    const { chats, config } = chatJson;
    console.log(chats);

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
          await insertNewMessage(chat, i, (buttonText) => {
            // Check if next message is a user message with same text as button
            const nextChat = chats[i + 1];
            const shouldSkipNext =
              nextChat && nextChat.role === 'user' && nextChat.text === buttonText;

            processChatSequence(i + 1, shouldSkipNext);
          });
          return; // Exit the loop, will be resumed by button click
        } else {
          await insertNewMessage(chat, i);
        }
      }
    };

    processChatSequence();
  }, []);

  return (
    <div className="chat-quiz-container">
      <div className="chats-section" id="chats-section"></div>
    </div>
  );
};

export { ChatQuiz };
