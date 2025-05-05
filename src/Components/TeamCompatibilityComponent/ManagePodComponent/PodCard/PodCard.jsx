import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Popover } from "@headlessui/react";
import styles from "./PodCard.module.css";
import React, { useState } from "react";
import { notify } from "../../../../utils/notify";
import usePod from "../../../../Hooks/usePod";


const PodCard = (props) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false); 
  const [index,setIndex]=useState(); 
  const [colorSelected, setColorSelected] = useState(false);  
  const {handleDeletePod,handleGetAllPods}=usePod();
  const handleRemovePod =async (podId,name) => {    
    const res=await handleDeletePod(podId);     
    await handleGetAllPods(props.jobId);    
    if(res){
      notify(`Pod ${name} is deleted!`,"Success");
    }
  }


  const textColor = "#333333";
  return (
    
    <div onClick={()=>props.togglePods(props)} className={styles.AddedPod} style={{ cursor: "pointer", background:props.selectedPod[props._id]?"#228276":"#2282761A" }}>
      {
        props?.name &&
        (
          <>
            <div className={styles.NamesWrapper}>
              <span className={styles.Name} style={{ color: textColor }}>{props?.name}</span>
              {/* {props?.podFunction && (props.index % 2 ===0) && 
          <div className="Frame1405" style={{width: '100%', height: '100%', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, background: 'rgba(255, 255, 255, 0.30)', borderRadius: 5, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex'}}>
              <div className="Design" style={{color: 'white', fontSize: 14, fontWeight: '510', wordWrap: 'break-word'}}>{props?.podFunction}</div>
          </div>
        }  */}
              {props?.podFunction && //(props.index % 2 !==0) && 
                <div className="Frame1405" style={{ width: '100%', height: '100%', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, background: colorSelected ? '#228276': 'white', borderRadius: 5, overflow: 'hidden',  justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex' }}>
                  <div className="ProductManagement" style={{ color: 'rgba(51, 51, 51, 0.75)', fontSize: 14, fontWeight: '510', wordWrap: 'break-word' }}>{props?.podFunction}</div>
                </div>
              }
            </div>
            <div className="mt-3">
              <div className={styles.ImageWrapper}>
                {props?.members?.map((member, index) => (
                  <React.Fragment key={index}>
                    {member?.image &&
                      <img src={member?.image} alt="" className={`${styles.Img} `} />
                    }
                  </React.Fragment>
                ))}
              </div>
              <Popover className={`relative  text-sm  ${styles.Popover}`}>
                <Popover.Button
                  className="focus:outline-0  border-none rounded-xl text-[#888888]"
                  onClick={() => setIsPopoverVisible(!isPopoverVisible)}
                >
                  <MoreVertIcon className={styles.VertIcon} style={{ color: textColor }} />
                </Popover.Button>
                <Popover.Panel
                  className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                  style={{ display: isPopoverVisible ? "block" : "none" }}
                >
                  <div
                    className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}
                  >
                    {/* <div
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                    >
                      <span
                        className="font-semibold rounded-xl flex w-full justify-left"
                        href="/"
                      onClick={() => handleEditPod(jobId, name, podFunction, podType, members)}
                      >
                        Edit Pod
                      </span>
                    </div> */}
                    <div
                      className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                      onClick={() => handleRemovePod(props._id,props.name)}
                    >
                      <span className="font-semibold rounded-xl flex w-full justify-left">
                        Remove Pod
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </div>
          </>
        )
      }

    </div>
  );
};

export default PodCard;
