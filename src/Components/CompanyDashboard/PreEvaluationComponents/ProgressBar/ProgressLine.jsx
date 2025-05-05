import React, { useEffect, useState } from "react";
import "./ProgressLine.css";

const ProgressLine = ({
  label,
  compatibilityScore,
  backgroundColor = "#e5e5e5",
  visualParts = [
    {
      percentage: "0%",
      color: "white",
      progressPercentage: "0"
    }
  ],
}) => {
  const [widths, setWidths] = useState(
    visualParts.map(() => {
      return 0;
    })
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidths(
        visualParts.map(item => {
          return item.percentage;
        })
      );
    });
  }, [visualParts]);

  return (
    <>
      <div className="progressVisualFull" style={{ backgroundColor, position: 'relative' }}>
        {visualParts.map((item, index) => {
          const isFirstElement = index === 0;
          const isLastElement = index === visualParts.length - 1;
          const additionalClass = isFirstElement
            ? "roundedLeft"
            : isLastElement
              ? "roundedRight"
              : "";

          return (
            <div
              key={index}
              style={{
                width: widths[index],
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundColor: item.color,
                position: 'relative' // Add this line to make the indicator position relative to the parent
              }}
              className={`progressVisualPart ${additionalClass}`}
            ></div>
          );
        })}
          {compatibilityScore >= 0 && compatibilityScore <= 10 && (
          <div className="progressIndicatorOverlay" style={{ left: `calc(${compatibilityScore}% )` }}>
            120
          </div>
        )}
        {compatibilityScore >= 11 && compatibilityScore <= 50 && (
          <div className="progressIndicatorOverlay" style={{ left: `calc(${compatibilityScore}% - 15px)` }}>
            120
          </div>
        )}
        {compatibilityScore >= 51 && compatibilityScore <=75 && (
          <div className="progressIndicatorOverlay" style={{ left:  `calc(${compatibilityScore}% - 5px)` }}>
            120
          </div>
        )}
          {compatibilityScore >= 76 && compatibilityScore <=100 && (
          <div className="progressIndicatorOverlay" style={{ left:  `calc(${compatibilityScore}% - 2px)` }}>
            120
          </div>
        )}
      </div>
    </>
  );
};

export default ProgressLine;


