import React from "react";
import "./OptionNode.css";

const OptionNode = ({ data, setCurrentSlide, setFormData }) => {
  const handleOptionButtonClick = (clickedOptionData, value) => {
    setFormData((prev) => {
      return { ...prev, [data.nodeName]: value };
    });
    setCurrentSlide(clickedOptionData.next);
  };
  return (
    <div className="option-node">
      {data.options.map((option, index) => {
        return (
          <div
            key={index}
            value={option.value}
            className={`option-node__button ${option.value} ${option.type}`}
            onClick={() => handleOptionButtonClick(option, option.value)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );
};

export default OptionNode;
