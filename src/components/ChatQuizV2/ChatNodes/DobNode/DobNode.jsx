import React, { useState } from 'react';
import { validateDob } from '../../utils/validationUtils';
import { getCurrentAge } from '../../utils/dobUtils';
import TextMsg from '../TextMsg/TextMsg';
import { sendDataToJitsuEvent } from '../../utils/saveToJitsuEventUrl';
import { LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';
import { pushLocalDataToDataLayer } from '../../utils/gtmUtils';

const DobNode = ({ id, role, name, placeholder, buttonText, type = 'text', handleNext }) => {
  const [value, setValue] = useState('19');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const currentValue = e?.target?.value;

    setError('');
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

      // save data to localStorage quiz values
      const storedQuizValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');
      const newQuizValues = { ...storedQuizValues, age: currentAge.toString() };

      localStorage.setItem(LOCAL_STORAGE_QUIZ_VALUES, JSON.stringify(newQuizValues));

      // Send data to jitsu
      const jitsuData = {
        questionKey: name,
        answer: true,
        currentStep: `${id}`,
        previousStep: id <= 1 ? '-' : `${id - 1}`,
        nextStep: `${id + 1}`,
      };

      sendDataToJitsuEvent(JSON.stringify(jitsuData));

      pushLocalDataToDataLayer();

      handleNext(<TextMsg role="user" text={currentAge} />, true);
    } else {
      setError('Please enter a valid birth year.');
    }
  };

  return (
    <div className="chat-quiz-v2__message--agent">
      <form className="chat-quiz-v2__input-container" onSubmit={handleSubmit}>
        <input
          className="chat-quiz-v2__input"
          type={type}
          name={name}
          placeholder={placeholder}
          onInput={handleChange}
          value={value}
        />

        {error && <span className="chat-quiz-v2__error-message">{error}</span>}

        <button className="chat-quiz-v2__submit-button" type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default DobNode;
