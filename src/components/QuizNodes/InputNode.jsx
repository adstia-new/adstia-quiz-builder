import React, { useContext, useEffect, useState } from 'react';
import { LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';
import { QuizConfigContext } from '../AdstiaQuiz';
import './InputNode.css';

const InputNode = ({ data, setNextDisabled, setFormData, handleJitsuData }) => {
  const quizConfig = useContext(QuizConfigContext);
  const { inputLabel, inputName, placeholder, inputType, nodeName, validation } = data;
  const { minLength, maxLength, required, errorMessage } = validation || {};
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Prefill value from localStorage if enabled in quizConfig
  useEffect(() => {
    if (quizConfig?.prefillValues) {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      if (stored[nodeName]) {
        setValue(stored[nodeName]);
        setFormData && setFormData((prev) => ({ ...prev, [nodeName]: stored[nodeName] }));
      }
    }
  }, [quizConfig?.prefillValues, nodeName]);

  useEffect(() => {
    if (setNextDisabled) {
      if (error || (required && !value.trim())) {
        setNextDisabled((prev) => ({ ...prev, [nodeName]: true }));
      } else {
        setNextDisabled((prev) => ({ ...prev, [nodeName]: false }));

        handleJitsuData(nodeName, value);
      }
    }
  }, [error, value, required, setNextDisabled]);

  const validate = (val) => {
    if (required && !val.trim()) {
      return 'This field is required';
    }
    if (minLength && val.length < minLength) {
      return `Minimum ${minLength} characters required`;
    }
    if (maxLength && val.length > maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }
    return '';
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (error) setError('');
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    const err = validate(val);
    setError(err);
    setFormData && setFormData((prev) => ({ ...prev, [nodeName]: val }));
    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(LOCAL_STORAGE_QUIZ_VALUES, JSON.stringify({ ...prev, [nodeName]: val }));
  };

  return (
    <div className="input-node">
      <label htmlFor={inputName} className="input-node__label">
        {inputLabel}
        {required && <span className="input-node__required">*</span>}
      </label>
      <input
        id={inputName}
        type={inputType || 'text'}
        name={inputName}
        placeholder={placeholder}
        className={`input-node__input input${error ? ' input-node__input--error' : ''}`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        maxLength={maxLength || undefined}
      />
      {error && <span className="input-node__error">{error}</span>}
    </div>
  );
};

export default InputNode;
