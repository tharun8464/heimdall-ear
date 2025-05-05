import React, { useState } from "react";
import CustomInput from "../../../CustomInput/CustomInput";
import Button from "../../../Button/Button";
import usePopup from "../../../../Hooks/usePopup";
import styles from "./PodDetailsPopup.module.css";
import { Dialog } from "@mui/material";
import { notify } from "../../../../utils/notify";

const PodDetailsPopup = ({ onSaveFn, setShowPopup }) => {
  const [podDetails, setPodDetails] = useState({});
  const { handlePopupCenterOpen } = usePopup();
  const [selectedFunction,setSelectedFunction]=useState();

  const handleChange = (e) => {
    const selectedVaue=e.target.value;
    setSelectedFunction(selectedVaue);
    setPodDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleClosePopup = () => {
    setShowPopup(true)
    handlePopupCenterOpen(false);
  };

  const handleSave = () => {
    if(!podDetails?.name?.trim()){
      notify("Please enter the pod name!","error");      
    }else if(!(/^[a-zA-Z\s]+$/).test(podDetails?.name)){
      notify("Only alphabets are allowed!","error");      
    }else if(podDetails.podFunction===''||podDetails.podFunction===null || podDetails.podFunction===undefined){
      notify("Please select the pod function!",'error');    
    }else{
      onSaveFn(podDetails);
      handleClosePopup();
      setShowPopup(true)
    }
  };
  const podFunction = [
    { 
    function: "Executive Leadership", 
    subFunction: ["CEO (Chief Executive Officer)", 
    "CTO (Chief Technology Officer)", 
    "CFO (Chief Financial Officer)", 
    "COO (Chief Operating Officer)", 
    "CIO (Chief Information Officer)"] 
    },
    {
    function: "Technology and Development", 
    subFunction: ["Vice President of Engineering or Development", 
    "Directors of Engineering or Development", 
    "Managers of Engineering or Development",
    "Software Engineers",
    "Developers",
    "Programmers",
    "UI/UX Designers"]
    },
     {function:"Project Management",
     subFunction:["Vice President of Project Management",
     "Directors of Project Management",
     "Project Managers",
     "Business Analysts"]
     },
     {function:"Quality Assurance (QA) and Testing",	
     subFunction:["Vice President of QA",
     "Directors of QA",
     "QA Managers",
     "Testers and Quality Analysts"]
     },
     {function:"Infrastructure and Operations",	
     subFunction:["Vice President of IT Operations",
     "Directors of IT Operations",
     "IT Managers",
     "System Administrators",
     "Network Engineers",
     "DevOps Engineers",
     "Database Administrators (DBAs)"]
     },
     {function:"Information Security",	
     subFunction:["Chief Information Security Officer (CISO)",	
     "Security Directors or Managers",
     "Security Analysts",	
     "Ethical Hackers and Security Specialists"]	
     },
     {function:"Data and Analytics",	
     subFunction:["Chief Data Officer (CDO)",	
     "Data Scientists",	
     "Data Analysts"]	
     },
     {function:"Product Management",	
     subFunction:["Vice President of Product Management",	
     "Product Managers",	
     "Associate Product Manager",	
     "Assistant Product Managers",	
     "Product Owners"]	
     },
     {function:"Sales and Marketing",	
     subFunction:["Chief Marketing Officer (CMO)",
     "Chief Sales Officer (CSO)",	
     "Marketing Managers",	
     "Sales Representatives"]
     },
     {function:"Human Resources and Administration",	
     subFunction:["Vice President of HR",	
     "HR Managers",	
     "Administrative Staff"]
     },	
     {function:"Finance and Accounting",	
     subFunction:["Vice President of Finance",	
     "Finance Managers",	
     "Accountants"]
     },	
     {function:"Legal and Compliance",	
     subFunction:["General Counsel",	
     "Legal Counsel",	
     "Compliance Officers"]
     },	
     {function:"Research and Development (R&D)",	
     subFunction:["R&D Directors",	
     "Researchers and Scientists"]
     },	
     {function:"Support and Helpdesk",	
     subFunction:["Vice President of Customer Support",	
     "Support Managers",	
     "Helpdesk Technicians",	
     "Customer Support and Relations",	
     "Customer Support Managers",	
     "Customer Relations Specialists"]
     }
    ]

  return (
    // <Dialog open={modal}  maxWidth="800px" PaperProps={{ style: { borderRadius: 16 } }}>
    <div className={styles.Wrapper}>
      <h1>Enter pod name and function</h1>
      <CustomInput
        placeholder={"Enter pod name"}
        value={podDetails?.name}
        onChange={handleChange}
        name={"name"}
        maxLength={"40"}
      />
      {/* <CustomInput
        placeholder={"Enter pod function"}
        value={podDetails?.podFunction}
        onChange={handleChange}
        name={"podFunction"}
      /> */}
      <div className="space-y-3">
        <select id="podFunction" style={{fontSize:"14px"}} onChange={handleChange} value={selectedFunction} name="podFunction"
          className="border-[0.5px] rounded-lg  border-gray-200 w-full focus:outline-0 focus:border-0 py-2 max-height-20">
          <option value="" >Select pod function</option>
          {podFunction.map((item, index) => (
            <option key={index} value={item.function}>{item.function}</option>
          ))}
        </select>
        <div className="mt-2">
          {/* {roleError && <p className="text-red-500"> Required!</p>} */}
        </div>
      </div>
      <div className={styles.BtnWrapper}>
        <Button text={"Cancel"} btnType={"secondary"} onClick={handleClosePopup} />
        <Button text={"Save"} btnType={"primary"} onClick={handleSave} />
      </div>
    </div>
    // </Dialog>
  );
};

export default PodDetailsPopup;
