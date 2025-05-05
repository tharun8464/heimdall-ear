import React from "react";
import "./ProgressIndicators.css";

const ProgressIndicators = ({ progressData }) => {
  return (
    <div className="progressIndicators">
      {progressData.map((item, index) => (
        <div key={index} className="progressIndicator">
          <span>{item.label}</span>
          <span>{item.percentage}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicators;
