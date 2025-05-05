import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PodManagementComponent from "./PodManagementComponent";
import {useParams} from 'react-router-dom';

const PodManagementLaunch = ({handleCreatePodClose}) => {
  const [showPopup , setShowPopup] = React.useState(true)
  const [modal, setModal] = React.useState(true);
  
const {id}=useParams();

  const handleClose = () => {
    setModal(false);
    handleCreatePodClose();
  };

  return (    
   showPopup === true ? (
    <Dialog open={modal} onClose={handleClose} maxWidth="800px" PaperProps={{ style: { borderRadius: 16, overflowX: "hidden" } }}>
    {/* Title Bar */}
    <div className="flex items-center justify-between p-2 bg-white rounded-t-md">
      <h2 className="font-semibold text-[#333333]">Pod Management System</h2>
      <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close" className="ml-2">
        <CloseIcon />
      </IconButton>
    </div>
      {/* Separator Line */}
      <div className="border-b border-gray-300"></div>
      {/* Content */}
      <PodManagementComponent jobId={id} setShowPopup = {setShowPopup} handleCreatePodClose={handleCreatePodClose}/>
  </Dialog>    
   ) : (null)
  );
};

export default PodManagementLaunch;
