import { useState } from "react";
import styles from "./PodManagementMenu.module.css";
import AddBoxIcon from "@mui/icons-material/AddBox";

const PodManagementMenu = ({ setPodViewType, podViewType,setShowCreatePod,showCreatePod,setIsAddToPod,isAddToPod }) => {
  const handleViewType = (viewType) => {
    setPodViewType(viewType);
  };

  return (
    <div className={styles.Wrapper}>
      <span className={styles.Heading}>Pods</span>
      <div className={` ${styles.TabsWrapper} flex flex-row gap-1 bg-[#EEEEEE] rounded-xl`}>
        <div
          className={`rounded-xl px-2 flex ${podViewType === "candidate" ? styles.ActiveTab : ""}`}
          onClick={() => {handleViewType("candidate");setShowCreatePod(false)}}
        >
          <span>Candidate</span>
        </div>
        <div
          className={`rounded-xl px-2 flex ${podViewType === "other" ? styles.ActiveTab : ""}`}
          onClick={() =>{handleViewType("other");setShowCreatePod(false)}}
        >
          <span>Other</span>
          {/* <div className="flex m-auto">Other</div> */}
        </div>
      </div>
      <AddBoxIcon sx={{ color: "var(--font-grey-75)" }} onClick={()=>{setShowCreatePod(!showCreatePod); setIsAddToPod(!isAddToPod)}}/>
    </div>
  );
};

export default PodManagementMenu;
