import React, { useEffect, useState, useRef } from "react";
import "./SelectNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";

const SelectNode = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (data.defaultOption) {
      const prev =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
      localStorage.setItem(
        LOCAL_STORAGE_QUIZ_VALUES,
        JSON.stringify({ ...prev, [data.nodeName]: data.defaultOption })
      );
      setSelectedOption(data.defaultOption);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [data.nodeName]: option.value })
    );
    setSelectedOption(option.value);
    setIsOpen(false);
  };

  return (
    <div className="select-node" ref={nodeRef}>
      <div
        className={`select-node__selected-option ${
          isOpen ? "select-node__selected-option--open" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption
          ? data.options.find((opt) => opt.value === selectedOption)?.label
          : "Select an option"}
      </div>
      <div
        className={`select-node__options ${
          isOpen ? "select-node__options--open" : ""
        }`}
      >
        {data.options.map((option, index) => {
          const isSelected = selectedOption === option.value;
          return (
            <button
              key={index}
              className={`select-node__option-button${
                isSelected ? " select-node__option-button--selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SelectNode;
