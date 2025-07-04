import React, { useEffect, useState } from "react";
import "./SelectNode.css";

const SelectNode = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (data.defaultOption) {
      const findDefaultOptionData = data.options.find(
        (element) => element.value === data.defaultOption
      );
      setSelectedOption(findDefaultOptionData.label);
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
  };

  return (
    <div className="select-node">
      <div 
        className={`select-node__selected-option ${isOpen ? 'select-node__selected-option--open' : ''}`}
        onClick={toggleDropdown}
      >
        {selectedOption || "Select an option"}
      </div>
      <div className={`select-node__options ${isOpen ? 'select-node__options--open' : ''}`}>
        {data.options.map((option, index) => {
          return (
            <button 
              key={index} 
              className="select-node__option-button"
              onClick={() => handleOptionClick(option)}
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
