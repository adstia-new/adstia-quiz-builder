import './index.css';
import React, { useEffect } from 'react';
import chatJson from './data/chatJson';
import insertNewMessage from './utils/insertNewMessage';

const ChatQuiz = () => {
  useEffect(() => {
    const { chats, config } = chatJson;
    console.log(chats);

    (async () => {
      for (const chat of chats) {
        await insertNewMessage(chat);
      }
    })();
  }, []);

  return (
    <div className="chat-quiz-container">
      <div className="chats-section" id="chats-section"></div>
    </div>
  );
};

export { ChatQuiz };
