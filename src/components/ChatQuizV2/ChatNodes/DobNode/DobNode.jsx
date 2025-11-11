import React, { useState } from 'react';
import { validateDob } from '../../utils/validationUtils';
import { getCurrentAge } from '../../utils/dobUtils';
import TextMsg from '../TextMsg/TextMsg';

const DobNode = ({ id, role, name, placeholder, buttonText, type = 'text', handleNext }) => {
  const [value, setValue] = useState('19');

  const handleChange = (e) => {
    const currentValue = e?.target?.value;

    if (currentValue < 2) {
      setValue('19');
    } else {
      setValue(currentValue?.slice(0, 4));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateDob(value)) {
      const currentAge = getCurrentAge(value);

      handleNext(<TextMsg role="user" text={currentAge} />, true);
    }
  };

  return (
    <div className="chat-quiz__message--agent">
      <form className="chat-quiz__input-container" onSubmit={handleSubmit}>
        <input
          className="chat-quiz__input"
          type={type}
          name={name}
          placeholder={placeholder}
          onInput={handleChange}
          value={value}
        />

        <button className="chat-quiz__submit-button" type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default DobNode;
