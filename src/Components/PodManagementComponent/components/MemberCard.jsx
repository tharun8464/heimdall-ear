import styles from "./section.module.css";
import logo from "../../../assets/images/prabhir-review.jpg";
import { useState, useRef, useEffect } from "react";
import DropMenu from "./DropMenu/DropMenu";
import { LuGripVertical } from "react-icons/lu";
import usePodMember from "../../../Hooks/usePodMember";
import {useParams} from 'react-router-dom';
import vm_user_placeholder from "../../../assets/images/vm_user_placeholder.png";


const weightageMap = {
  "Reporting Manager": 50,
  "Team Lead": 30,
  "Critical": 20,
  "Non-critical": 10,
  "Reportee": 10,
};

function MemberCard({ firstName, designation, memberId, handleMemberSelection, memberTag, image,isAddedToPod,addedMembers,id}) {
  const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);
  const [dropMenuPosition, setDropMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedTagValue, setSelectedTagValue] = useState("");

  const { handleUpdatePodMemberTag, handleUpdatePodMemberWeightage } = usePodMember();

  const handleDropMenuClick = (event) => {
    // const { pageX, pageY } = event;
    // setDropMenuPosition({ left: pageX - 100, top: pageY + 20 });
    setIsDropMenuOpen(true);
  };

  const closeDropMenu = () => {
    setIsDropMenuOpen(false);
  };

  const handleTagSelection = (selectedTag) => {
    setSelectedTagValue(selectedTag);
    handleUpdatePodMemberTag(memberId, { tag: selectedTag,jobId:id });
    handleUpdatePodMemberWeightage(memberId, { weightage: weightageMap[selectedTag] });
  };

  const handleCheckbox = () => {
    handleMemberSelection(memberId);
  };

const style={opacity:"0.2",pointerEvents:"none"}
  return (
    <>
      <div className={styles.wrapper} 
      style={isAddedToPod&&addedMembers?.includes(id)?{opacity:"0.2",pointerEvents:"none"}:null}
      >
        {isDropMenuOpen ? (
          <DropMenu
            closeDropMenu={closeDropMenu}
            dropMenuPosition={dropMenuPosition}
            handleTagSelection={handleTagSelection}
            memberId={memberId}
            id={id}
          ></DropMenu>
        ) : null}
        <div className={`${styles.common}`} style={{ gap: "14px" }} disabled="true">
          <div>
            <input type="checkbox" className={styles.checkbox} onChange={handleCheckbox} />
          </div>
          <div className={styles.imageContainer}>
            <img src={!image?vm_user_placeholder:image} alt={firstName} />
          </div>
          <div className={styles.textInfo}>
            <p>{firstName}</p>
            <h3>{designation}</h3>
          </div>
        </div>
        <div className={styles.sideContainer}>
          <div className={styles.dropMenuContainer} onClick={(e) => handleDropMenuClick(e)}>
            <div className={styles.common}>
              <p className={styles.AddTagText}>{!memberTag ? "Add Tag" : memberTag}</p>
            </div>
            <div>
              <i className="fa fa-caret-down"></i>
            </div>
          </div>
          {/* <div> */}
          <LuGripVertical style={{ color: "var(--font-grey-75)" }} />
          {/* </div> */}
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

export default MemberCard;
