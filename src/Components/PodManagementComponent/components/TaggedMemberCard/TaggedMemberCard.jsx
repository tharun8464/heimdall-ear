import styles from "./TaggedMemberCard.module.css";
// import logo from "../../../assets/images/logo.png";
import { LuGripVertical } from "react-icons/lu";

// import vm_user_placeholder from "../../../../../assets/images/vm_user_placeholder";
import vm_user_placeholder from "../../../../assets/images/vm_user_placeholder.png";

function TaggedMemberCard({
  isAddedToPod,
  firstName,
  designation,
  memberTag,
  weightage,  
  memberId,
  image,
  selectedMem,
  handleMemberSelection
}) {
  const handleCheckbox = () => {
    handleMemberSelection(memberId);
  };

  return (
    <>
      <div className={styles.wrapper} style={isAddedToPod?{opacity:"0.2",pointerEvents:"none"}:null}>
        <div className={`${styles.common}`} style={{ gap: "14px" }}>
          {!selectedMem&&<div>
            <input type="checkbox" className={styles.checkbox} onChange={handleCheckbox} />
          </div>}
          <div className={styles.imageContainer}>
            <img src={!image?vm_user_placeholder:image} alt={firstName} />
          </div>
          <div className={styles.textInfo}>
            <p>{firstName}</p>
            <h3>{designation}</h3>
          </div>
        </div>
        <div className={styles.sideContainer}>
          <div
            className={`${styles.common} ${styles.dropMenuContainer}`}
            style={{ background: "var(--font-grey-05)", border: "0px" }}
          >
            <div className={styles.common}>
              <p style={{ fontSize: "15px", color: "grey" }}>{memberTag}</p>
            </div>
            <div
              className={styles.common}
              style={{
                backgroundColor: "rgb(60, 136, 122)",
                height: "15px",
                padding: "3px 5px",
                borderRadius: "6px",
              }}
            >
              <p style={{ fontSize: "10px", color: "white" }}>{weightage}%</p>
            </div>
          </div>
          {/* <div><i className={`fas ${styles.gripIcon}`}>&#xf58e;</i></div> */}
          <LuGripVertical />
        </div>
      </div>
      <div
        style={{
          width: "100%",
          borderTop: "2px solid var(--border-grey)",
        }}
      ></div>
    </>
  );
}

export default TaggedMemberCard;
