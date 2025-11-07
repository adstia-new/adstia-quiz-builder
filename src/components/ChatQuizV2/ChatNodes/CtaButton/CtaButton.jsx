import React from 'react';
import TextMsg from '../TextMsg/TextMsg';
import { trackCtaButtonClick } from '../../utils/trackCtaButtonClick';

const CtaButton = ({ text, handleNext }) => {
  const handleCtaClick = (e) => {
    trackCtaButtonClick(text);
    handleNext(<TextMsg role="user" text={text} />);
  };

  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__button-container">
        <button onClick={handleCtaClick}>{text}</button>
      </div>
    </div>
  );
};

export default CtaButton;
