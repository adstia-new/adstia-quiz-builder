import React from "react";
import "./OptionNode.css";

const OptionNode = ({ data, setCurrentSlide }) => {
  const handleOptionButtonClick = (clickedOptionData) => {
    setCurrentSlide(clickedOptionData.next);
  };
  return (
    <div className="option-node">
      {data.options.map((option, index) => {
        return (
          <div
            key={index}
            value={option.value}
            className={`option-node__button ${option.value}`}
            onClick={() => handleOptionButtonClick(option)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export default OptionNode;
