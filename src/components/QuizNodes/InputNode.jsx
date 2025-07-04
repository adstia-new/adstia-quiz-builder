import React from "react";

const InputNode = ({ data }) => {
  const { inputLabel, inputName, placeholder } = data;
  const { minLength, maxLength } = data.validation;
  // console.log(minLength, maxLength);

  return (
    <div>
      <label htmlFor={inputName}>{inputLabel}</label>
      <input
        id={inputName}
        type="text"
        name={inputName}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputNode;
