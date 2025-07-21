import React, { useState, useEffect } from "react";
import "./ZipcodeNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";

const ZipcodeNode = ({ data, setNextDisabled, setFormData }) => {
  const { inputLabel, inputName, placeholder, inputType, validation } = data;
  const { required, pattern, minLength, maxLength, errorMessage } =
    validation || {};
  const [error, setError] = useState("");
  const [value, setValue] = useState("");

  // Update Next button state whenever error or value changes
  useEffect(() => {
    if (error || (required && !value.trim())) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  }, [error, value, required, setNextDisabled]);

  const validateInput = (inputValue) => {
    if (required && !inputValue.trim()) {
      setError("This field is required");
      return false;
    }

    if (pattern && inputValue) {
      const regex = new RegExp(pattern);
      if (!regex.test(inputValue)) {
        setError(errorMessage || "Invalid format");
        return false;
      }
    }

    if (minLength && inputValue.length < minLength) {
      setError(`Minimum ${minLength} characters required`);
      return false;
    }

    if (maxLength && inputValue.length > maxLength) {
      setError(`Maximum ${maxLength} characters allowed`);
      return false;
    }

    setError("");
    return true;
  };

  const handleBlur = (e) => {
    validateInput(e.target.value);
    setFormData((prev) => {
      return { ...prev, [data.nodeName]: e.target.value };
    });
    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [data.nodeName]: e.target.value })
    );
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="zipcode-node">
      <label htmlFor={inputName} className="zipcode-node__label">
        {inputLabel}
        {required && <span className="zipcode-node__required">*</span>}
      </label>
      <input
        id={inputName}
        type={inputType || "text"}
        name={inputName}
        placeholder={placeholder}
        className={`zipcode-node__input input ${
          error ? "zipcode-node__input--error" : ""
        }`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <span className="zipcode-node__error">{error}</span>}
    </div>
  );
};

export default ZipcodeNode;
