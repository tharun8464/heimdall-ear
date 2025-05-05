import { useState } from "react";
import styles from "./TablePodCard.module.css";
import vm_user_placeholder from "../../../../assets/images/vm_user_placeholder.png";
import defaultImage from "./default-profile-icon-18.jpg";

function TablePodCard(props) {
  let indScore = props?.indvidualCompatibilityScore;
  indScore = Math.round(indScore * 100);
  let memScore;

  if (indScore > 85) {
    memScore = "High+";
  } else if (indScore > 75) {
    memScore = "High";
  } else if (indScore > 65) {
    memScore = "Medium";
  } else {
    memScore = "Low";
  }

  const memberInfo = props?.member || {
    // firstName: props?.name||props?.firstName,
    firstName: props?.name || props?.name,
    tag: props?.tag,
    designation: props?.designation,
    weightage: props?.weightage,
    image: props?.image,
  };

  const memImg =
    props?.member?.image && !props?.member?.image.includes("https://example.com/")
      ? props?.member?.image
      : undefined;

  const getTextColor = () => {
    if (memScore === "Low") {
      return "var(--red-error)";
    } else if (memScore === "High") {
      return "var(--primary-green)";
    } else if (memScore === "Medium") {
      return "var(--brown-warning)";
    } else if (memScore === "High+") {
      return "var(--primary-violet)";
    }
  };

  return (
    <>
      <div
        className="grid grid-cols-3 gap-3 p-3 bg-white rounded-md items-center"
        style={{ margin: "auto" }}>
        {/* Image */}
        <div className="col-span-1 flex">
          <img
            src={memberInfo?.image ? memberInfo.image : vm_user_placeholder}
            alt={props?.name}
            className="w-[35px] h-[35px] object-cover rounded-full"
          />
          {/* Name and Tag */}
          <div>
            <div className={styles.textInfo} style={{ marginLeft: "8px" }}>
              <p>{memberInfo.name || memberInfo.firstName}</p>
              {/* <p>{props?.name|| props?.firstName}</p>               */}
              <h3>{memberInfo?.tag}</h3>
            </div>
          </div>
        </div>

        {/* Name and Tag
        <div className="col-span-1">
        <div className={styles.textInfo}>
            <p>{memberInfo.name || memberInfo.firstName}</p>
            <h3>{memberInfo.tag}</h3>
          </div>
        </div> */}

        {/* Designation and Weightage */}
        <div className="col-span-1 ">
          <div className={`${styles.common} ${styles.InfoContainer}`}>
            <div className={styles.common}>
              <p style={{ fontSize: "15px", color: "grey" }}>{memberInfo.designation}</p>
            </div>
            <div className={`${styles.common} ${styles.PercentStatus}`}>
              <p style={{ fontSize: "10px", color: "white" }}>{memberInfo.weightage}%</p>
            </div>
          </div>
        </div>

        {/* Score */}
        <div className="col-span-1">
          <p
            className={styles.TextStyle}
            style={{
              color: getTextColor(),
            }}>
            {memScore}
          </p>
        </div>
      </div>

      {/* <div
        style={{
          width: "100%",
          borderTop: "2px solid var(--border-grey)",
        }}
      ></div> */}
    </>
  );
}

export default TablePodCard;
