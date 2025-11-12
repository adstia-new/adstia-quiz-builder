import React from 'react';
import { validateTextInput } from '../../utils/validationUtils';
import TextMsg from '../TextMsg/TextMsg';
import { LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';

const InputNode = ({ id, role, name, placeholder, buttonText, type = 'text', handleNext }) => {
  const [value, setValue] = useState('19');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const currentValue = e?.target?.value;

    setError('');
    setValue(currentValue);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateTextInput(value)) {
      // save data to localStorage quiz values
      const storedQuizValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES) || '{}');
      const newQuizValues = { ...storedQuizValues, [name]: value.toString() };

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

      handleNext(<TextMsg role="user" text={value} />, true);
    } else {
      setError(`Please enter a value.`);
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
        />

        {error && <span className="chat-quiz-v2__error-message">{error}</span>}

        <button className="chat-quiz-v2__submit-button" type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default InputNode;
