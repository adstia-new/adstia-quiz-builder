import React, { useState, useEffect } from "react";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";

const InputNode = ({ data, setNextDisabled, setFormData }) => {
  const {
    inputLabel,
    inputName,
    placeholder,
    inputType,
    nodeName,
    validation,
  } = data;
  const { minLength, maxLength, required, errorMessage } = validation || {};
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (setNextDisabled) {
      if (error || (required && !value.trim())) {
        setNextDisabled(true);
      } else {
        setNextDisabled(false);
      }
    }
  }, [error, value, required, setNextDisabled]);

  const validate = (val) => {
    if (required && !val.trim()) {
      return "This field is required";
    }
    if (minLength && val.length < minLength) {
      return `Minimum ${minLength} characters required`;
    }
    if (maxLength && val.length > maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }
    return "";
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (error) setError("");
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    const err = validate(val);
    setError(err);
    setFormData && setFormData((prev) => ({ ...prev, [nodeName]: val }));
    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [nodeName]: val })
    );
  };

  return (
    <div className="input-node">
      <label htmlFor={inputName} className="input-node__label">
        {inputLabel}
        {required && <span className="input-node__required">*</span>}
      </label>
      <input
        id={inputName}
        type={inputType || "text"}
        name={inputName}
        placeholder={placeholder}
        className={`input-node__input input${
          error ? " input-node__input--error" : ""
        }`}
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
