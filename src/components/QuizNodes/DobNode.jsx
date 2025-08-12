import React, { useState, useEffect, useRef, useContext } from "react";
import "./DobNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";
import { QuizConfigContext } from "../AdstiaQuiz";

const DobNode = ({ data, setNextDisabled, setFormData }) => {
  const quizConfig = useContext(QuizConfigContext);
  const fields = data.fields || [];
  const inputRefs = useRef([]);
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.fieldName] = "";
    });
    // Prefill from localStorage if enabled
    if (quizConfig.prefillValues) {
      const stored =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
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
    return initial;
  });
  const [errors, setErrors] = useState(() => {
    const initial = {};
    fields.forEach((f) => {
      initial[f.fieldName] = "";
    });
    return initial;
  });

  useEffect(() => {
    const hasError = Object.values(errors).some(Boolean);
    const hasEmpty = fields.some(
      (f) => f.validation?.required && !values[f.fieldName].trim()
    );
    setNextDisabled(hasError || hasEmpty);
  }, [errors, values, setNextDisabled, fields]);

  const validate = (field, value) => {
    const v = field.validation || {};
    if (v.required && !value.trim()) {
      return "This field is required";
    }
    if (v.pattern && value) {
      const regex = new RegExp(v.pattern);
      if (!regex.test(value)) {
        return v.errorMessage || "Invalid value";
      }
    }
    if (v.minLength && value.length < v.minLength) {
      return `Minimum ${v.minLength} characters required`;
    }
    if (v.maxLength && value.length > v.maxLength) {
      return `Maximum ${v.maxLength} characters allowed`;
    }
    return "";
  };

  const handleChange = (field, e, idx) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field.fieldName]: value }));
    setErrors((prev) => ({ ...prev, [field.fieldName]: "" }));
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

    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [field.fieldName]: value })
    );
    const error = validate(field, value);
    setErrors((prev) => ({ ...prev, [field.fieldName]: error }));
  };

  return (
    <div className="dob-node">
      <label className="dob-node__label">
        {data.inputLabel || "Date of Birth"}{" "}
        <span className="dob-node__required">*</span>
      </label>
      <div className="dob-node__fields">
        {fields.map((field, idx) => (
          <div className="dob-node__field" key={field.fieldName}>
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type={field.fieldType || "text"}
              name={field.fieldName}
              placeholder={field.placeholder}
              className={`dob-node__input input ${
                errors[field.fieldName] ? "dob-node__input--error" : ""
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
