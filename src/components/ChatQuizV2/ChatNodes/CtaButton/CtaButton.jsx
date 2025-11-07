import React from 'react';

const CtaButton = ({ text, handleNext }) => {
  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__button-container">
        <button onClick={handleNext}>{text}</button>
      </div>
    </div>
  );
};

export default CtaButton;
