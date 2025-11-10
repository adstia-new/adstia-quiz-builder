import React, { useState } from 'react';
import { validateZipcode } from '../../utils/validationUtils';
import { saveLocationWithZipcode } from '../../../../utils/saveLocationWithZipcode';
import TextMsg from '../TextMsg/TextMsg';

const ZipcodeNode = ({ id, name, placeholder, buttonText, type = 'text', handleNext }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    // Filter only number upto 5 digits from input value
    const currentValue = e?.target?.value?.replace(/[^\d]/g, '')?.slice(0, 5);

    // if input value is correct zipcode value,
    // fetch zipcode info and save it to local storage
    if (validateZipcode(currentValue)) {
      saveLocationWithZipcode(currentValue);
    }

    setValue(currentValue);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateZipcode(value)) {
      handleNext(<TextMsg role="user" text={value} />, true);
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

export default ZipcodeNode;
