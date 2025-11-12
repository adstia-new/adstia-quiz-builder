import React from 'react';
import TextMsg from '../TextMsg/TextMsg';
import { trackCtaButtonClick } from '../../utils/trackCtaButtonClick';
import { addRingbaScript } from '../../utils/ringbaUtils';

const CtaButton = ({ role, text, handleNext, ringbaScriptId }) => {
  const handleCtaClick = (e) => {
    trackCtaButtonClick(text);
    if (ringbaScriptId) {
      addRingbaScript(ringbaScriptId);
    }
    handleNext(<TextMsg role="user" text={text} />, true);
  };

  return (
    <div className="chat-quiz-v2__message--agent">
      <div className="chat-quiz-v2__button-container">
        <button onClick={handleCtaClick}>{text}</button>
      </div>
    </div>
  );
};

export default CtaButton;
