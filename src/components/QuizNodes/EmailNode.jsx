import React, { useState, useEffect, useContext } from "react";
import "./EmailNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";
import { QuizConfigContext } from "../AdstiaQuiz";

const EmailNode = ({ data, setNextDisabled, setFormData, handleJitsuData }) => {
  const quizConfig = useContext(QuizConfigContext);
  const { inputLabel, nodeName, placeholder, validation } = data;
  const { required, errorMessage } = validation || {};
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // Prefill value from localStorage if enabled in quizConfig
  useEffect(() => {
    if (quizConfig.prefillValues) {
      const stored =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};

      if (stored[nodeName]) {
        setValue(stored[nodeName]);
        setFormData &&
          setFormData((prev) => ({ ...prev, [nodeName]: stored[nodeName] }));
      }
    }
  }, [quizConfig.prefillValues, nodeName]);

  useEffect(() => {
    if (error || (required && !value.trim())) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);

      handleJitsuData(nodeName, value);
    }
  }, [error, value, required, setNextDisabled]);

  const validateEmail = (val) => {
    if (required && !val.trim()) {
      return "This field is required";
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return errorMessage || "Invalid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (error) setError("");
  };

  const handleBlur = (e) => {
    const val = e.target.value;
    const err = validateEmail(val);
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
    <div className="email-node">
      <label className="email-node__label" htmlFor={nodeName}>
        {inputLabel}{" "}
        {required && <span className="email-node__required">*</span>}
      </label>
      <input
        id={nodeName}
        type="email"
        name={nodeName}
        placeholder={placeholder}
        className={`email-node__input input ${
          error ? "email-node__input--error" : ""
        }`}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="email"
      />
      {error && <span className="email-node__error">{error}</span>}
    </div>
  );
};

export default EmailNode;
