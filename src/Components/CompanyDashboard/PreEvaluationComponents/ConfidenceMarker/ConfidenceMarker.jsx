import { useEffect } from "react";
import styles from "./ConfidenceMarker.module.css";

const ConfidenceMarker = ({ confidence, dataToolTipId }) => {
  confidence = confidence ? confidence : 0;

  // Add a check to multiply confidence by 100 if it's between 0 and 1
  if (confidence > 0 && confidence < 1) {
    confidence *= 100;
  }

  const getHighLowLabel = (percentage) => {
    if (percentage < 40) {
      return "Red-bg";
    }
    if (percentage >= 40 && percentage < 60) {
      return "Yellow-bg";
    }
    if (percentage >= 60 && percentage < 75) {
      return "Green-bg";
    }
    if (percentage >= 75) {
      return "Violet-bg";
    }
  };

  useEffect(() => {
    //console.log("label", confidence);
  }, [confidence]);

  return (
    <div
      data-tooltip-id={dataToolTipId}
      className={`${styles.Wrapper} ${styles[getHighLowLabel(confidence)]}`}
    ></div>
  );
};

export default ConfidenceMarker;
