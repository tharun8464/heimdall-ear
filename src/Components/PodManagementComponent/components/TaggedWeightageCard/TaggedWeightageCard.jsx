import styles from "./TaggedWeightageCard.module.css";
import logo from "../../../../assets/images/prabhir-review.jpg";
import { BiSolidLockAlt,BiSolidLockOpen } from "react-icons/bi";
import { LuGripVertical } from "react-icons/lu";
import vm_user_placeholder from "../../../../assets/images/vm_user_placeholder.png";
import { useEffect, useState } from "react";
import usePodMember from "../../../../Hooks/usePodMember";
import { notify } from "../../../../utils/notify";


function TaggedWeightageCard({id,firstName,designation,memberTag,weightage,image }) {
  const [weightageLock,setWeightageLock]=useState(true);
  const [editedValue,setEditedValue]=useState();
  const {handleUpdatePodMemberWeightage}=usePodMember();
  useEffect(()=>{ 
    setEditedValue(weightage);    
  },[]);

  const handleLockOpen= async(id)=>{   
    let data = {
      weightage:editedValue
    }    
    // let res = await handleUpdatePodMemberWeightage(id , data);
    // if(res){
    //   notify("Member weightage is successfully updated" , "success")
    // }
    // setEditedValue(editedValue);
    // setWeightageLock(false);  
    if (Number(editedValue) > 100) {
      setWeightageLock(true);
      notify("Weightage should be less than 100", "error")

    } else {
      let res = await handleUpdatePodMemberWeightage(id, data);
      if (res) {
        notify("Member weightage is successfully updated", "success")
      }
      setEditedValue(editedValue);
      setWeightageLock(false);
    }   
  }

  const handleLockClose= ()=>{    
    setWeightageLock(true);    
  }

  const handlePodMemberWeightageChange=(value)=>{
    setEditedValue(value);   
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={`${styles.common}`} style={{ gap: "14px" }}>
          <div className={styles.imageContainer}>
            <img src={image ?? vm_user_placeholder} alt={firstName} />
          </div>
          <div className={styles.textInfo}>
            <p>{firstName}</p>
            <h3>{designation}</h3>
          </div>
        </div>
        <div className={styles.sideContainer}>
          <div className={`${styles.common}`}>
            <div className={styles.taggedWeightageInfo}>
              <p>{memberTag}</p>
            </div>
            <div className={styles.taggedWeightageInfo}>
              {weightageLock?(<input
                type="text"                
                //defaultValue={`${(memberWeightage)}%`}
                maxLength={"3"}
                value={editedValue}
                onChange={(e) =>
                  handlePodMemberWeightageChange(e.target.value)
                }
                className={styles.EditableInput}
              />
              ):<p>{editedValue}%</p>}
              
            </div>
            <div>
            {weightageLock ?
                  <BiSolidLockOpen onClick = {()=>handleLockOpen(id)} ></BiSolidLockOpen>
                :
                  <BiSolidLockAlt onClick={()=>handleLockClose()}></BiSolidLockAlt>
                }
            </div>
          </div>
          <div>{/* <i className={`fas ${styles.gripIcon}`}>&#xf58e;</i> */}</div>
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

export default TaggedWeightageCard;
