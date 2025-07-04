import React from "react";

const OptionNode = ({ data, setCurrentSlide }) => {
  const handleOptionButtonClick = (clickedOptionData) => {
    setCurrentSlide(clickedOptionData.next);
  };
  return (
    <div>
      {data.options.map((option, index) => {
        return (
          <button
            key={index}
            value={option.value}
            onClick={() => handleOptionButtonClick(option)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default OptionNode;
