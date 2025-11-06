import React from 'react';

const LoadingMsg = () => {
  return (
    <div className="chat-quiz__loader">
      <div className="chat-quiz__dot-loader">
        <div className="chat-quiz__dot chat-quiz__dot--1"></div>
        <div className="chat-quiz__dot chat-quiz__dot--2"></div>
        <div className="chat-quiz__dot chat-quiz__dot--3"></div>
      </div>
    </div>
  );
};

export default LoadingMsg;
