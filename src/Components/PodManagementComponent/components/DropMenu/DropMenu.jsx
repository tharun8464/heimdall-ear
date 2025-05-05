import { useRef, useEffect, useState } from "react";
import styles from "./DropMenu.module.css";
import CustomInput from "../../../CustomInput/CustomInput";
import usePodMember from "../../../../Hooks/usePodMember";

function DropMenu({
  closeDropMenu,
  dropMenuPosition,
  handleTagSelection,
  memberId,
}) {
  // const { top, left } = dropMenuPosition;
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [tagMenuPosition, setTagMenuPosition] = useState({
    topPos: 0,
    leftPos: 0,
  });
  const menuRef = useRef(null);

  const handleTagItem = (e) => {
    const selectedLi = e.target;
    if (selectedLi.tagName === "LI") {
      handleTagSelection(selectedLi.innerText?.slice(0, -3).trim());
    }
  };

  const handleAddTagBtn = (e) => {
    // const { pageX, pageY } = e;
    // setTagMenuPosition({ leftPos: pageX - 350, topPos: pageY - 20 });
    setIsTagMenuOpen(true);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !isTagMenuOpen
      ) {
        closeDropMenu();
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [isTagMenuOpen]);

  return (
    <>
      <div
        className={styles.menuContainer}
        // style={{ top: `${top}px`, left: `${left}px` }}
        ref={menuRef}
      >
        {isTagMenuOpen ? (
          <div>
            <TagMenu
              // tagMenuPosition={tagMenuPosition}
              setIsTagMenuOpen={setIsTagMenuOpen}
              memberId={memberId}
              closeDropMenu={closeDropMenu}
            ></TagMenu>
            {/* <div className={styles.overlay}></div> */}
          </div>
        ) : null}
        <div className={styles.menu}>
          <ul onClick={(e) => handleTagItem(e)}>
            <li className={styles.dropdownItem}>
              Reporting Manager<span className={styles.weightage}>50%</span>
            </li>
            <li className={styles.dropdownItem}>
              Team Lead<span className={styles.weightage}>30%</span>
            </li>
            <li className={styles.dropdownItem}>
              Critical<span className={styles.weightage}>20%</span>
            </li>
            <li className={styles.dropdownItem}>
              Non-critical<span className={styles.weightageN}>10%</span>
            </li>
            <li className={styles.dropdownItem}>
              Reportee<span className={styles.weightageR}>10%</span>
            </li>
          </ul>
        </div>

        <div
          style={{
            width: "100%",
            borderTop: "1px solid var(--border-grey)",
          }}
        ></div>
        <div>
          <button
            className="flex text-white font-bold py-2 w-full text-sm text-center align-center rounded-lg"
            onClick={(e) => handleAddTagBtn(e)}
          >
            <p class="mx-auto flex">
              <p class="py-1 px-2 text-md">
                {" "}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"></path>
                  <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"></path>
                </svg>
              </p>{" "}
              Add Custom tag
            </p>
          </button>
        </div>
      </div>
    </>
  );
}

function TagMenu({
  tagMenuPosition,
  setIsTagMenuOpen,
  memberId,
  closeDropMenu,
}) {
  const [customInputValues, setCustomInputValues] = useState({});
  //console.log"customInputValues:", customInputValues);
  const { handleUpdatePodMemberTag, handleUpdatePodMemberWeightage } =
    usePodMember();

  const handleSaveCustomInput = (selectedTag) => {
    handleUpdatePodMemberTag(memberId, { tag: customInputValues.tag });
    handleUpdatePodMemberWeightage(memberId, {
      weightage: customInputValues.weightage,
    });
    closeDropMenu();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomInputValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleBtnClick = () => {
    // after clicked on save or cancel button on tag menu, must have close the tag menu dropdown.
    setIsTagMenuOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.tagMenuContainer}`}
        // style={{
        //   top: `${tagMenuPosition.topPos}px`,
        //   left: `${tagMenuPosition.leftPos}px`,
        //   zIndex: "110",
        // }}
      >
        <div style={{ padding: "17px 12px 6px 17px", fontSize: "13px" }}>
          <h1>Define Tag</h1>
        </div>
        <div className={`${styles.common} ${styles.container}`}>
          <CustomInput
            placeholder="Tag Name"
            className={styles.fullWidth}
            onChange={handleInputChange}
            name="tag"
            value={customInputValues?.tag}
          ></CustomInput>
        </div>
        <div className={`${styles.common} ${styles.container}`}>
          <CustomInput
            placeholder="Assign weight-age"
            className={styles.fullWidth}
            onChange={handleInputChange}
            name="weightage"
            value={customInputValues?.weightage}
          ></CustomInput>
        </div>
        <div className={`${styles.common} ${styles.buttonContainer}`}>
          <button
            className={styles.btnStyle}
            onClick={(e) => handleSaveCustomInput()}
          >
            Save
          </button>
          <button className={styles.btnStyle} onClick={(e) => handleBtnClick()}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default DropMenu;
