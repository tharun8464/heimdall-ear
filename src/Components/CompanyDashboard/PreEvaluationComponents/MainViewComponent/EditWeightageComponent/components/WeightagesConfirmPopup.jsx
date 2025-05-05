import React, { useState, useEffect } from "react";
import { Close } from "@material-ui/icons";
import styles from "../components/WeightagesConfirmPopup.module.css";
import { Divider } from "@mui/material";
import Button from "../../../../../Button/Button";
import useWeightage from "../../../../../../Hooks/useWeightage";
import { deleteWeightageById,deleteAllWeightages } from "../../../../../../service/weightages/getAllWeightages";

const WeightagesConfirmPopup = (
    {
        data,
        jobId,
        setIsWeightageConfirmationPopupOpen,
        setIsWeightageMenuOpen
    }) => {
    const { handleGetAllWeightages } = useWeightage();
    const handleClosePopup = () => {
        setIsWeightageConfirmationPopupOpen(false);
    };

    const handleCancelWeightages = (e) => {
        setIsWeightageConfirmationPopupOpen(false);
    }

    const handleDeleteWeightages = async (e) => {
        let res;
        if(!data){       
            res=await deleteAllWeightages(jobId);
            setIsWeightageMenuOpen(false);
        }else{
            res = await deleteWeightageById(data);
        }        
        if (res) {
            await handleGetAllWeightages(jobId);
        }
        setIsWeightageConfirmationPopupOpen(false);
    }
    return (
        <>
            <div className={styles.Wrapper}>
                <div className={styles.HeadingWrapper}>
                    <h2 className={styles.Heading}>Delete Customized Weightages</h2>
                    <Close onClick={handleClosePopup} sx={{ cursor: "pointer" }} />
                </div>
                <div>
                    <h2 className={styles.Subheading}>Are you sure you want to delete the selected customized weightages?</h2>
                </div>
                <Divider />
                <div className="w-full flex justify-between px-4 pt-2 pb-4">
                    <Button
                        text={"Cancel"}
                        className={styles.CancelWeightage}
                        onClick={(e) => handleCancelWeightages(e)}
                    />
                    <Button
                        text={"Delete"}
                        className={styles.DeleteWeightageBtn}
                        onClick={(e) => handleDeleteWeightages(e)}
                    />
                </div>
            </div>
        </>
    );
};

export default WeightagesConfirmPopup;
