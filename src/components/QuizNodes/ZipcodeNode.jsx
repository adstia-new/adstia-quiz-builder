import React, { useState, useEffect, useContext } from "react";
import "./ZipcodeNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES, QUIZ_NODE_TYPES } from "../../constants";
import { QuizConfigContext } from "../AdstiaQuiz";
import { saveLocationWithZipcode } from "../../utils/saveLocationWithZipcode";

const ZipcodeNode = ({
  data,
  setNextDisabled,
  setFormData,
  setJitsuEventData,
}) => {
  const quizConfig = useContext(QuizConfigContext);
  const { inputLabel, inputName, placeholder, inputType, validation } = data;
  const { required, pattern, minLength, maxLength, errorMessage } =
    validation || {};
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const nodeName = "zipcode";

  // Prefill value from localStorage if enabled in quizConfig
  useEffect(() => {
    if (quizConfig.prefillValues) {
      const stored =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      if (stored[data.nodeName]) {
        setValue(stored[data.nodeName]);
        setFormData((prev) => {
          return { ...prev, [data.nodeName]: stored[data.nodeName] };
        });

        setJitsuEventData((prev) => {
          const newEventData = prev.map((eventData) => {
            if (eventData?.nodeName === nodeName) {
              return {
                ...eventData,
                answer: stored[nodeName],
              };
            }

            return eventData;
          });

          return newEventData;
        });

        (async () => {
          await saveLocationWithZipcode(stored[data.nodeName]);
        })();
      }
    }
  }, [quizConfig.prefillValues, data.nodeName]);

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

  const handleBlur = async (e) => {
    const val = e.target.value;
    validateInput(val);
    setFormData((prev) => {
      return { ...prev, [data.nodeName]: val };
    });

    await saveLocationWithZipcode(val);

    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [data.nodeName]: val })
    );
  };

  const handleChange = (e) => {
    let numericValue = e.target.value.replace(/\D/g, "");
    setValue(numericValue);
    
    setJitsuEventData((prev) => {
      const newEventData = prev.map((eventData) => {
        return {
          ...eventData,
          answer: numericValue,
        };
      });

      return newEventData;
    });
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
        type="text"
        name={inputName}
        placeholder={placeholder}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={maxLength}
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
