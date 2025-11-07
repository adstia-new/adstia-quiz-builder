import React from 'react';

const TextMsg = ({ role = 'agent', text }) => {
  return (
    <div className={role === 'agent' ? 'chat-quiz__message--agent' : 'chat-quiz__message--user'}>
      <p>{text}</p>
    </div>
  );
};

export default TextMsg;
