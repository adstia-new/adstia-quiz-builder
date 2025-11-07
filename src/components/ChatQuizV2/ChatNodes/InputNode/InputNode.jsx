import React from 'react';
import { validateTextInput } from '../../utils/validationUtils';

const InputNode = ({ id, name, placeholder, buttonText, type = 'text', handleNext }) => {
  const [value, setValue] = useState('19');

  const handleChange = (e) => {
    const currentValue = e?.target?.value;

    setValue(currentValue);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateTextInput(value)) {
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
        />

        <button className="chat-quiz__submit-button" type="submit">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default InputNode;
