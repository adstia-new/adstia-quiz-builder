import React, { useState, useEffect, useRef, useContext } from 'react';
import './DobNode.css';
import { DOB_FIELDS, LOCAL_STORAGE_QUIZ_VALUES } from '../../constants';
import { QuizConfigContext } from '../AdstiaQuiz';

const DobNode = ({ data, setNextDisabled, setFormData, handleJitsuData }) => {
  const quizConfig = useContext(QuizConfigContext);
  const fields = data.fields || [];
  const inputRefs = useRef([]);
  const { nodeName } = data;
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.fieldName] = '';
    });
    return initial;
  });

  useEffect(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.fieldName] = '';
    });

    // Prefill from localStorage if enabled
    if (quizConfig.prefillValues) {
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      fields.forEach((f) => {
        if (stored[f.fieldName]) {
          initial[f.fieldName] = stored[f.fieldName];
          setFormData((prev) => ({
            ...prev,
            [f.fieldName]: stored[f.fieldName],
          }));
        }
      });
    }

    setValues(initial);
  }, [quizConfig.prefillValues, nodeName]);

  useEffect(() => {
    const hasError = Object.values(errors).some(Boolean);
    const hasEmpty = fields.some((f) => f.validation?.required && !values[f.fieldName]?.trim());
    setNextDisabled((prev) => ({ ...prev, [nodeName]: hasError || hasEmpty }));
  }, [errors, values, setNextDisabled, fields, nodeName]);

  const validate = (field, value) => {
    const v = field.validation || {};
    if (v.required && !value.trim()) {
      return 'This field is required';
    }
    if (v.pattern && value) {
      const regex = new RegExp(v.pattern);
      if (!regex.test(value)) {
        return v.errorMessage || 'Invalid value';
      }
    }
    if (v.minLength && value.length < v.minLength) {
      return `Minimum ${v.minLength} characters required`;
    }
    if (v.maxLength && value.length > v.maxLength) {
      return `Maximum ${v.maxLength} characters allowed`;
    }

    if (field.fieldName === DOB_FIELDS.DOB_YEAR && value) {
      const year = parseInt(value, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear) {
        return `Year must be between 1900 and ${currentYear}`;
      }
    }

    // Check if full date is in the future
    const dayVal = field.fieldName === DOB_FIELDS.DOB_DAY ? value : values[DOB_FIELDS.DOB_DAY];
    const monthVal =
      field.fieldName === DOB_FIELDS.DOB_MONTH ? value : values[DOB_FIELDS.DOB_MONTH];
    const yearVal = field.fieldName === DOB_FIELDS.DOB_YEAR ? value : values[DOB_FIELDS.DOB_YEAR];

    if (dayVal && monthVal && yearVal) {
      const d = parseInt(dayVal, 10);
      const m = parseInt(monthVal, 10);
      const y = parseInt(yearVal, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 0-indexed
      const currentDay = now.getDate();

      if (y === currentYear) {
        if (m > currentMonth || (m === currentMonth && d > currentDay)) {
          return 'Date cannot be in the future';
        }
      }
    }

    return '';
  };

  const handleChange = (field, e, idx) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field.fieldName]: value }));
    setErrors((prev) => ({ ...prev, [field.fieldName]: '' }));
    const maxLength = field.validation?.maxLength;
    if (maxLength && value.length === maxLength) {
      if (inputRefs.current[idx + 1]) {
        inputRefs.current[idx + 1].focus();
      }
    }
  };

  const handleBlur = (field, e) => {
    const value = e.target.value;
    setFormData((prev) => {
      return { ...prev, [field.fieldName]: value };
    });

    const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [field.fieldName]: value })
    );
    const error = validate(field, value);
    setErrors((prev) => ({ ...prev, [field.fieldName]: error }));
  };

  useEffect(() => {
    if (
      values &&
      values[DOB_FIELDS.DOB_MONTH] &&
      values[DOB_FIELDS.DOB_DAY] &&
      values[DOB_FIELDS.DOB_YEAR]
    ) {
      const answer = `${values[DOB_FIELDS.DOB_MONTH]}-${
        values[DOB_FIELDS.DOB_DAY]
      }-${values[DOB_FIELDS.DOB_YEAR]}`;

      handleJitsuData(nodeName, answer);
    }
  }, [values]);

  // Calculate and save age in localStorage on successful validation
  useEffect(() => {
    const hasError = Object.values(errors).some(Boolean);
    const allFieldsFilled =
      values[DOB_FIELDS.DOB_MONTH] && values[DOB_FIELDS.DOB_DAY] && values[DOB_FIELDS.DOB_YEAR];

    if (!hasError && allFieldsFilled) {
      const month = parseInt(values[DOB_FIELDS.DOB_MONTH], 10);
      const day = parseInt(values[DOB_FIELDS.DOB_DAY], 10);
      const year = parseInt(values[DOB_FIELDS.DOB_YEAR], 10);

      // Calculate age
      const today = new Date();
      const birthDate = new Date(year, month - 1, day); // month is 0-indexed in Date
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Save age to localStorage
      const prev = JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      localStorage.setItem(LOCAL_STORAGE_QUIZ_VALUES, JSON.stringify({ ...prev, age }));
    }
  }, [values, errors]);

  return (
    <div className="dob-node">
      <label className="dob-node__label">
        {data.inputLabel || 'Date of Birth'} <span className="dob-node__required">*</span>
      </label>
      <div className="dob-node__fields">
        {fields.map((field, idx) => (
          <div className="dob-node__field" key={field.fieldName}>
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type={field.fieldType || 'text'}
              name={field.fieldName}
              placeholder={field.placeholder}
              className={`dob-node__input input ${
                errors[field.fieldName] ? 'dob-node__input--error' : ''
              }`}
              value={values[field.fieldName]}
              onChange={(e) => handleChange(field, e, idx)}
              onBlur={(e) => handleBlur(field, e)}
              maxLength={field.validation?.maxLength}
            />
            {errors[field.fieldName] && (
              <span className="dob-node__error">{errors[field.fieldName]}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DobNode;
