import React from 'react';

const LoadingMsg = () => {
  return (
    <div className="chat-quiz-v2__loader">
      <div className="chat-quiz-v2__dot-loader">
        <div className="chat-quiz-v2__dot chat-quiz-v2__dot--1"></div>
        <div className="chat-quiz-v2__dot chat-quiz-v2__dot--2"></div>
        <div className="chat-quiz-v2__dot chat-quiz-v2__dot--3"></div>
      </div>
    </div>
  );
};

export default LoadingMsg;
