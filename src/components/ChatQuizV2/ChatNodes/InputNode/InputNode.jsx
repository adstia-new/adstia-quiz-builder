import React from 'react';

const InputNode = ({
  id,
  name,
  placeholder,
  fixedValue = '',
  buttonText,
  type = 'text',
  handleNext,
}) => {
  return (
    <div className="chat-quiz__message--agent">
      <div className="chat-quiz__input-container">
        <input className="chat-quiz__input" type={type} name={name} placeholder={placeholder} />

        <button className="chat-quiz__submit-button" onClick={handleNext}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InputNode;
