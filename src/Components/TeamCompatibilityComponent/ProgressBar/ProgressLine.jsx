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
      progressPercentage : "0"
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
            <>
            <div
              key={index}
              style={{
                width: widths[index],                
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundColor: item.color
              }}
              className={`progressVisualPart ${additionalClass}`}
            >              
            {compatibilityScore>=0 &&
               <div className="progressIndicatorOverlay" style={{ left: compatibilityScore}}>
                 120
               </div>
              }
            </div>
              </>
          );
          
        })}
        
      </div>
    </>
  );
};

export default ProgressLine;
