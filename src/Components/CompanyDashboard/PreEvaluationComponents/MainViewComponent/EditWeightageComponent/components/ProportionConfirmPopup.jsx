import React, { useState, useEffect } from "react";
import { Close } from "@material-ui/icons";
import styles from "../components/ProportionConfirmPopup.module.css";
import { Divider } from "@mui/material";
import Button from "../../../../../Button/Button";
import useWeightage from "../../../../../../Hooks/useWeightage";
import { updateWeightage } from "../../../../../../service/weightages/updateWeightageFlag";
const ProportionConfirmPopup = (
    { data,
        jobId,
        setInputValues,
        setWeightages,
        setIsProportionMenuOpen,
        setIsProportionConfirmPopupOpen,
        setDesiredWeight,
    }) => {
    const { handleCreateWeightage, handleGetAllWeightages } = useWeightage();
    const handleClosePopup = () => {
        setIsProportionConfirmPopupOpen(false);
    };

    const handleCancelProportion = (e) => {
        setIsProportionConfirmPopupOpen(false);
    }

    const handleContinueProportion = async () => {
        //handleCreateWeightage(data, jobId);
        const { weightageId, weightageData } = data;
        await updateWeightage(weightageId, weightageData)
        setDesiredWeight(weightageData?.name);
        // setInputValues({
        //     culture: weightageData?.culture,
        //     cognitive: weightageData.cognitive,
        //     teamCompatibility: weightageData.teamCompatibility,
        //     technical: weightageData.technical,
        // });
        setWeightages({
            culture: 25,
            cognitive: 25,
            teamCompatibility: 25,
            technical: 25,
        });
        // setInputValues({
        //     culture: "25",
        //     cognitive: "25",
        //     teamCompatibility: "25",
        //     technical: "25",
        // });
        // setWeightages({
        //     culture: 25,
        //     cognitive: 25,
        //     teamCompatibility: 25,
        //     technical: 25,
        // });
        await handleGetAllWeightages(jobId);
        setIsProportionMenuOpen(false);
        setIsProportionConfirmPopupOpen(false);
    }
    return (
        <>
            <div className={styles.Wrapper}>
                <div className={styles.HeadingWrapper}>
                    <h2 className={styles.Heading}>Proportion Name already exists</h2>
                    <Close onClick={handleClosePopup} sx={{ cursor: "pointer" }} />
                </div>
                <div>
                    <h2 className={styles.Subheading}>Are you sure you want to replace the existing weightages?</h2>
                </div>
                <Divider />
                <div className="w-full flex justify-between px-4 pt-2 pb-4">
                    <Button
                        text={"Cancel"}
                        className={styles.CancelProp}
                        onClick={(e) => handleCancelProportion(e)}
                    />
                    <Button
                        text={"Continue"}
                        className={styles.ContinuePropBtn}
                        onClick={() => handleContinueProportion()}
                    />
                </div>
            </div>
        </>
    );
};

export default ProportionConfirmPopup;
