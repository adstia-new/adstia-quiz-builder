import React from 'react';
import './RingbaBtn.css';
import { trackPhoneButtonClick } from '../../utils/trackPhoneButtonClick';

const RingbaBtn = ({ role, text, href }) => {
  const handlePhoneClick = (e) => {
    const phoneText = e.currentTarget.href || '';
    const phoneNumber = phoneText.replace(/[^\d]/g, '').slice(-10);
    trackPhoneButtonClick(phoneNumber);
  };

  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__button-container">
        <a className="ringba" href={href} onClick={handlePhoneClick}>
          {text}
        </a>
      </div>
    </div>
  );
};

export default RingbaBtn;
