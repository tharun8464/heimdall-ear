
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./ExportReport.module.css";
import React, { useState, useRef } from "react";

import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";



// aaaaaaaaaaaaaaaaaaaa
import { Close } from "@material-ui/icons";
import DeleteIcon from '@mui/icons-material/Delete';
import edit from "../../../../src/assets/images/edit.svg"
import loop from "../../../../src/assets/images/loop.svg"

// xxxxxxxxxxxxxxxxxxx
const ExportReport = ({ isMobile, setIsEditing }) => {


    const [selectedItems, setSelectedItems] = useState([])



    const handleClose = () => {
        // setShowManageList(false)
    }

    function checkboxHandler(e) {
        let isSelected = e.target.checked;
        let value = e.target.value

        if (isSelected) {
            setSelectedItems([...selectedItems, value])
        } else {
            setSelectedItems((prevData) => {
                return prevData.filter((id) => {
                    return id !== value
                })
            })
        }
    }
    const [reports, setReports] = React.useState([
        {
            title: "Candidate Interview Statistics",
            id: "CIS",
            value: false,
        },
        {
            title: "Candidate Cognitive Games Statistics",
            id: "CCGS",
            value: false,
        },
        {
            title: "Job Notification",
            id: "JN",
            value: false,
        },
        {
            title: "Update Expiry Date",
            id: "UED",
            value: false,
        },
        {
            title: "POD Summary: No. Of Candidates Com...",
            id: "PSNC",
            value: false,
        },
        {
            title: "Employee Psychometric Statistics",
            id: "EPS",
            value: false,
        },
        {
            title: "Employee Culture Statistics",
            id: "ECS",
            value: false,
        },
    ]);





    const [existingSchedule, setExistingSchedule] = React.useState([
        {
            ToText: "xyz1@abc.com",
            id: "CIS",
            value: false,
            CcText: ["xyz1@abc.com", "xyz1@abc.com"],
            TimeText: "1 week",
            Day: "Monday",
            Never: "Never",
        },
        {
            ToText: "xyz2@abc.com",
            id: "CIS",
            value: false,
            CcText: ["xyz2@abc.com", "xyz2@abc.com"],
            TimeText: "2 week",
            Day: "Monday",
            Never: "Never",
        },
        {
            ToText: "xyz3@abc.com",
            id: "CIS",
            value: false,
            CcText: ["xyz3@abc.com", "xyz3@abc.com"],
            TimeText: "3 week",
            Day: "Monday",
            Never: "Never",
        },

    ]);


    return (

        <div className={styles.Wrapper}>

            <div className={styles.Layoutt}>

                <div className={styles.Layoutt2}>
                    <div className={styles.Heading}>Export Report</div>
                    <div className={styles.Heading1}>Select fields for export and export one or schedule an email</div>

                </div>
                <div className={styles.CancelButtonLayout}>
                    <Close className={styles.Close} onClick={handleClose} />

                </div>

            </div>
            <div className={styles.MainTextComponent}>
                <div className={styles.LeftPart}>
                    <div className={styles.CheckboxLayout}>

                        {reports.map((item, index) =>
                            <div className={styles.CheckboxLabelWidth}>

                                <div className={styles.CheckBoxWithLabel} key={index}>

                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        value={item.id}
                                        onChange={checkboxHandler}
                                        style={{ width: "18px", height: "18px", color: "#228276", borderRadius: "5px", border: "1.2px solid #33333340" }}
                                    />

                                    <div className={styles.CheckLabel}>{item.title}</div>

                                </div>
                            </div>
                        )}

                    </div>

                </div>
                <div className={styles.CenterLine}></div>
                <div className={styles.RightPart}>
                    <div className={styles.ExistingScheduleText}>Existing Schedule</div>
                    <div className={styles.Cards}>
                        {existingSchedule.map((item) =>

                            <div className={styles.Card}>
                                <div className={styles.CardTexts}>
                                    <div className={styles.TextIcon}>
                                        <div className={styles.Totext}>
                                            <div className={styles.ToColor}>To</div>
                                            <div className={styles.ToText}>{item.ToText}</div>
                                        </div>


                                        <div className={styles.Twoicons}>
                                            <DeleteIcon style={{ width: "16px", height: "16px", color: "#D6615A" }} />
                                            <img src={edit} style={{ width: "12px", height: "13.5px", color: "#D6615A" }} alt="" />

                                        </div>

                                    </div>
                                    <div className={styles.CcText}>
                                        <div className={styles.ToColor}>Cc</div>

                                        {item.CcText.map((item1) =>
                                            <div className={styles.ToText}>{item1}</div>)}
                                    </div>
                                    <div className={styles.TimeText}>
                                        <div> <img src={loop} style={{ width: "12px", height: "13.5px", color: "#D6615A" }} alt="" /></div>
                                        <div className={styles.TimeTextDay}>{item.TimeText},</div>
                                        <div className={styles.TimeTextDay}>{item.Day}</div>
                                        <div className={styles.Endson}>Ends on</div>
                                        <div className={styles.NeverText}>{item.Never}</div>

                                    </div>
                                </div>

                            </div>
                        )}



                    </div>
                </div>

            </div>

            <div className={styles.BottomLayout}>



                <div className={styles.InputWrapperBottom}>

                    <button className={styles.ExportOnce} >
                        Export Once
                    </button>
                    <button className={styles.ScheduleEmail} >
                        Schedule Email
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ExportReport;
