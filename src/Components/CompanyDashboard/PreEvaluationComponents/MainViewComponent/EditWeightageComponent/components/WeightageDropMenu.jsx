import { useState } from "react";
import styles from "./WeightageDropMenu.module.css";
import useWeightage from "../../../../../../Hooks/useWeightage";
import { useSelector } from "react-redux";
import { notify } from "../../../../../../utils/notify";
import WeightagesConfirmPopup from "./WeightagesConfirmPopup";
import Button from "../../../../../Button/Button";
function WeightageDropMenu({
weightagesDropMenuPosition,
  setIsWeightageMenuOpen,
  jobId,
}) {  
  const [selectedProportion,setSelectedProportion]=useState();
  const { handleGetAllWeightages } = useWeightage();
  const { weightageData } = useSelector((state) => state.weightage);
  const [isWeightageConfirmationPopupOpen, setIsWeightageConfirmationPopupOpen] = useState(false);
  const [data,setData]=useState(null);

  const handleOpenPopup = () => {
    setIsWeightageConfirmationPopupOpen(true);
};
  const handleDeleteAll=async()=>{
    setData(null);
    handleOpenPopup();
  }

  const handleDelete=async()=>{
        if(!selectedProportion)
            return notify("Please select any proportion!","error");
        let selectedWeightage = [];
        let data1 = [];
        for (let [key, value] of Object.entries(selectedProportion)) {
          data1.push(value);
          selectedWeightage.push(key);
        }  
   
        const data={
            ids:selectedWeightage,
            jobId
        }    
        setData(data);
        handleOpenPopup();     
  }

  const handleCancel = () => {
    setIsWeightageMenuOpen(false);
  };

  const selectProportion=(item)=>{    
    if (selectedProportion && selectedProportion[item._id]) {
        let data = { ...selectedProportion };
        delete data[item._id];
        setSelectedProportion(data);       
      } else {
        setSelectedProportion({ ...selectedProportion, [item._id]: true });        
      }
  }

  return (
    <>
    {isWeightageConfirmationPopupOpen&&<WeightagesConfirmPopup
    data={data}
    jobId={jobId}
    setIsWeightageMenuOpen={setIsWeightageMenuOpen}    
    setIsWeightageConfirmationPopupOpen={setIsWeightageConfirmationPopupOpen}
    />}
      <div
        className={`${styles.tagMenuContainer}`}
        style={{
          top: `${weightagesDropMenuPosition.top}px`,
          left: `${weightagesDropMenuPosition.left}px`,
        }}
      >
        <div style={{ padding: "17px 12px 6px 17px", fontSize: "15px", display:"flex", flexDirection:"row" }}>
            <div><h1 className={styles.enterProportion}>Select Weightage</h1></div>
          <div><button className={styles.deleteAllBtn} onClick={()=>handleDeleteAll()}>Delete All</button></div>
        </div>
        <div className={`${styles.common} ${styles.container}`}>
            {
                weightageData&&weightageData?.map((item)=>(<>
                <div className={styles.fullWidth} onClick={()=>selectProportion(item)} style={{background:selectedProportion&&selectedProportion[item?._id]?"rgb(221, 244, 240)":""}}>{item.name}</div>
                </>))
            }
         
        </div>
        <div className={`${styles.common} ${styles.buttonContainer}`} style={{marginTop:"10px"}}>
          
          <Button text={"Delete"} onClick={()=>handleDelete()} className={styles.deleteWeightage}/>
          <Button text={"Cancel"} className={styles.cancelWeightage} onClick={() => handleCancel()}/>
        
        </div>
      </div>
    </>
  );
}

export default WeightageDropMenu;
