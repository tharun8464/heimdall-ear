import { useSelector } from "react-redux";
import styles from "../../../../../assets/stylesheet/stepInfoBox.module.css";

const StepInfoBox = ({ step, inProcessInfo, inProcess, image, detected }) => {
  return (
    <div
      className={`flex items-center justify-center  h-28 ${
        styles.stepInfoBox
      } ${inProcess ? styles.InProcessClass : ""} ${
        image && detected ? "" : styles.BorderClass
      }`}
    >
      {image && detected ? (
        <img
          src={`data:image/png;base64,${image}`}
          className={`h-28 ${styles.Image}`}
          alt=""
        />
      ) : (
        <span className={styles.Text}>{inProcess ? inProcessInfo : step}</span>
      )}
    </div>
  );
};

export default StepInfoBox;
