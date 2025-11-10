import React from 'react';
import './RingbaBtn.css';

const RingbaBtn = ({ text, href }) => {
  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__button-container">
        <a className="ringba" href={href}>
          {text}
        </a>
      </div>
    </div>
  );
};

export default RingbaBtn;
