import React from "react";
import "./OptionNode.css";
import { LOCAL_STORAGE_QUIZ_VALUES } from "../../constants";
import { pushLocalDataToDataLayer } from "../../utils/gtmUtils";

const OptionNode = ({
  data,
  setFormData,
  setJitsuEventData,
  handleOptionClick,
}) => {
  const handleOptionButtonClick = (clickedOptionData, value) => {
    setFormData((prev) => {
      return { ...prev, [data.nodeName]: value };
    });
    const prev =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_QUIZ_VALUES)) || {};
    localStorage.setItem(
      LOCAL_STORAGE_QUIZ_VALUES,
      JSON.stringify({ ...prev, [data.nodeName]: value })
    );

    // Push quiz data to GTM
    pushLocalDataToDataLayer();

    // setJitsuEventData((prev) => {
    //   let newEventData = prev[0];

    //   newEventData = {
    //     ...newEventData,
    //     nextStep: clickedOptionData.next,
    //     answer: value,
    //   };

    //   return [newEventData];
    // });

    handleOptionClick(value, clickedOptionData.next);
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
