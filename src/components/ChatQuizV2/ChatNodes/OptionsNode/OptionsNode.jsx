import React from 'react';
import TextMsg from '../TextMsg/TextMsg';

const OptionsNode = ({ optionsData, handleNext }) => {
  const handleOptionClick = (e) => {
    const label = e?.target?.textContent;
    const value = e?.target?.value;
    handleNext(<TextMsg role="user" text={label} />, true);
  };
  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__options-container">
        {optionsData?.options?.map((option, idx) => (
          <button
            key={idx}
            value={option?.value}
            className="chat-quiz__option-button"
            onClick={handleOptionClick}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionsNode;
