import React from "react";

const OptionNode = ({ data }) => {
  console.log(data);
  return (
    <div>
      {data.options.map((option) => {
        // console.log(option);
        return <button value={option.value}>{option.label}</button>;
      })}
    </div>
  );
};

export default OptionNode;
