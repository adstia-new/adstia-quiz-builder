import React, { useState, useEffect, useContext } from 'react';
import './PhoneNode.css';
import { LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';
import { QuizConfigContext } from '../AdstiaQuiz';

const formatPhone = (value) => {
  let digits = value?.replace(/\D/g, '');
  digits = digits?.replace(/^1+/, '');
  digits = digits.slice(0, 10);
  if (digits.length === 0) return '+1 ';
  if (digits.length <= 3) return `+1 (${digits}`;
  if (digits.length <= 6) return `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const PhoneNode = ({ data, setNextDisabled, setFormData, handleJitsuData }) => {
  const quizConfig = useContext(QuizConfigContext);
  const { inputLabel, nodeName, placeholder, validation } = data;
  const { required, errorMessage } = validation || {};
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [consentChecked] = useState(true);

  // Prefill value from localStorage if enabled in quizConfig
  useEffect(() => {
    if (quizConfig.prefillValues) {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      if (stored[nodeName]) {
        setValue(formatPhone(stored[nodeName]));
        setFormData &&
          setFormData((prev) => ({
            ...prev,
            [nodeName]: stored[nodeName]?.replace(/\D/g, ''),
          }));
      }
    }
  }, [quizConfig.prefillValues, nodeName]);

  useEffect(() => {
    if (error || (required && !value.trim()) || !consentChecked || validatePhone(value)) {
      setNextDisabled((prev) => ({ ...prev, [nodeName]: true }));
    } else {
      setNextDisabled((prev) => ({ ...prev, [nodeName]: false }));

      handleJitsuData(nodeName, value?.replace(/\D/g, ''));

      setFormData &&
        setFormData((prev) => ({ ...prev, [nodeName]: value?.replace(/\D/g, '').slice(-10) }));

      const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      localStorage.setItem(
        LOCAL_STORAGE_QUIZ_VALUES,
        JSON.stringify({ ...prev, [nodeName]: value?.replace(/\D/g, '').slice(-10) })
      );
    }
  }, [error, value, required, setNextDisabled, consentChecked, nodeName]);

  const validatePhone = (val) => {
    // Extract all digits from the value
    let allDigits = val?.replace(/\D/g, '') || '';
    // Remove leading 1 (country code) if present
    allDigits = allDigits.replace(/^1+/, '');

    if (required && !allDigits) {
      return 'This field is required';
    }
    // Must have exactly 10 digits (US phone number without country code)
    if (allDigits.length !== 10) {
      return errorMessage || 'Invalid Phone Number';
    }
    return '';
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow user to clear the field
    if (raw === '') {
      setValue('');
      if (error) setError('');
      return;
    }
    const formatted = formatPhone(raw);
    setValue(formatted);

    if (error) setError('');
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    const err = validatePhone(val);
    setError(err);
    setFormData &&
      setFormData((prev) => ({ ...prev, [nodeName]: val?.replace(/\D/g, '').slice(-10) }));
  };

  return (
    <div className="phone-node">
      <div className="phone-node__input-container">
        <label className="phone-node__label" htmlFor={nodeName}>
          {inputLabel}
          {required && <span className="phone-node__required">*</span>}
        </label>
        <input
          id={nodeName}
          type="tel"
          name={nodeName}
          placeholder={placeholder}
          className={`phone-node__input input ${error ? 'phone-node__input--error' : ''}`}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={17} // +1 (xxx)-xxx-xxxx
          autoComplete="tel"
        />
        {error && <span className="phone-node__error">{error}</span>}
      </div>
    </div>
  );
};

export default PhoneNode;
