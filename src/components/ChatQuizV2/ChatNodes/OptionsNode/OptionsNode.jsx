import React from 'react';
import TextMsg from '../TextMsg/TextMsg';
import { sendDataToJitsuEvent } from '../../utils/saveToJitsuEventUrl';
import { LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';
import { pushLocalDataToDataLayer } from '../../utils/gtmUtils';

const OptionsNode = ({ role, optionsData, handleNext }) => {
  const handleOptionClick = (e) => {
    const label = e?.target?.textContent;
    const value = e?.target?.value;

    // save data to localStorage quiz values
    const storedQuizValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');
    const newQuizValues = { ...storedQuizValues, [optionsData?.name]: value.toString() };

    localStorage.setItem(LOCAL_STORAGE_QUIZ_VALUES, JSON.stringify(newQuizValues));

    // Send data to jitsu
    const jitsuData = {
      questionKey: optionsData?.name,
      answer: value,
      currentStep: `${optionsData?.id}`,
      previousStep: optionsData?.id <= 1 ? '-' : `${optionsData?.id - 1}`,
      nextStep: `${optionsData?.id + 1}`,
    };

    sendDataToJitsuEvent(JSON.stringify(jitsuData));
    pushLocalDataToDataLayer();

    handleNext(<TextMsg role="user" text={label} />, true);
  };
  return (
    <div className="chat-quiz-v2__message--agent">
      <div className="chat-quiz-v2__options-container">
        {optionsData?.options?.map((option, idx) => (
          <button
            key={idx}
            value={option?.value}
            className="chat-quiz-v2__option-button"
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
