import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./ReportsCheckboxPopup.module.css";
import React, { useState, useRef } from "react";
import { getStorage, getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";
import { getCountryCode } from "../../../service/api";
import copySolid from "../../../assets/images/copySolid.svg"
import calendar from "../../../assets/images/calendar.svg"

// aaaaaaaaaaaaaaaaaaaa
import CancelIcon from '@mui/icons-material/Cancel';
// import { CheckBox } from "@material-ui/icons";
// import { Checkbox } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';

import { Link } from "react-router-dom";
// import { Field, Form } from "formik";
// import Switch from 'react-switch';
import { Switch } from '@mui/material';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../../../assets/images/UserAvatar.png";
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateTimePicker from "react-datetime-picker";
import { TiTick } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";

// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

// import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
// import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
// import { Datepicker, Input, Page, setOptions /* localeImport */ } from '@mobiscroll/react';

import { Formik, Form, ErrorMessage, Field } from "formik";

// setOptions({
//     // localeJs,
//     // themeJs
// });
// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
// import { color } from "html2canvas/dist/types/css/types/color";
// xxxxxxxxxxxxxxxxxxx
const ReportsCheckboxPopup = ({ isMobile, setIsEditing }) => {
    const { handleUpdateUserDetails } = useUser();
    const [user, setUser] = useState(null);

    const { handlePopupCenterOpen } = usePopup();
    const { userDetails } = useSelector(state => state.user);

    // console.log("userDetailsContact:", userDetails);
    //names are acc to the api
    const [contactDetails, setContactDetails] = useState({
        firstName: "",
        lastname: "",
        email: "",
        linkedinurl: "",
        countryCode: "",
        contact: "",
        location: "",
    });


    const [selectedItems, setSelectedItems] = useState([])

    const [reports, setReports] = React.useState([
        {
            title: "All",
            id: "all",
            value: false,
        },
        {
            title: "VM Lite Report",
            id: "VM_lite",
            value: false,
        },
        {
            title: "Vm Pro Report",
            id: "VM_pro",
            value: false,
        },
        {
            title: "Feedback Report",
            id: "Feedback_report",
            value: false,
        },
        {
            title: "Team Dynamics",
            id: "Team_dynamics",
            value: false,
        },
    ]);



    // useEffect(() => {
    //     if (userDetails?.user) {
    //         setContactDetails({
    //             firstName: userDetails.user?.firstName,
    //             lastname: userDetails.user?.lastname,
    //             email: userDetails.user?.email,
    //             linkedinurl: userDetails.user?.linkedinurl,
    //             contact: userDetails.user?.contact,
    //             countryCode: userDetails.user?.countryCode,
    //             location: userDetails.user?.location,
    //         });
    //     }
    // }, [userDetails]);



    // const handleChange = e => {
    //     const { name, value } = e.target;
    //     setContactDetails(prevDetails => ({
    //         ...prevDetails,
    //         [name]: value,
    //     }));
    // };

    const handleSubmit = () => {


        // const trimmedLinkedinUrl = contactDetails?.linkedinurl?.split("?")[0]
        // contactDetails.linkedinurl = trimmedLinkedinUrl

        // const nameRegex = /^[a-zA-Z ]+$/; // Updated Regex to allow spaces

        // if (!contactDetails?.firstName || contactDetails?.firstName.trim() === "") {
        //     fieldErrors.firstName = "First name is required!";
        // } else if (!nameRegex.test(contactDetails.firstName)) {
        //     fieldErrors.firstName = "First name should not contain special characters!";
        // } else if (contactDetails.firstName.length > 25) {
        //     fieldErrors.firstName = "First name should not be longer than 25 characters!";
        // }

    };


    useEffect(() => {
        const fetchUser = async () => {
            //let user = await getStorage("user");
            let user = getSessionStorage("user");
            user = JSON.parse(user);
            setUser(user);
        };

        fetchUser();
    }, []);



    useEffect(() => {

    }, [selectedItems])


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






    return (
        isMobile ? <div >

        </div> :

            <div className={styles.Wrapper}>

                <div className={styles.Layoutt}>

                    <div className={styles.Heading}>Reports</div>

                </div>
                <div className={styles.CheckboxLayout}>

                    {reports.map((item, index) =>
                        <div className={styles.CheckboxLabelWidth}>

                            <div className={styles.CheckBoxWithLabel} key={index}>

                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    value={item.id}
                                    onChange={checkboxHandler}
                                    style={{ width: "18px", height: "18px", color: "#228276", marginRight: "1rem", gap: "1rem", borderRadius: "5px", border: "1.2px solid #33333340" }}
                                />

                                <div className={styles.CheckLabel}>{item.title}</div>

                            </div>
                        </div>
                    )}
                    {/* </div> */}
                    {/* </div> */}

                    {/* {checkboxLabel.map((x) => {
                        return (
                            <div className={styles.CheckboxLabelWidth}>
                                <div className={styles.CheckBoxWithLabel}>
                                    <Checkbox
                                        checked={true}
                                        // onChange={handleChange}

                                        sx={{
                                            color: "#228276",
                                            '&.Mui-checked': {
                                                color: "#228276",
                                            },
                                        }}
                                        style={{ width: "18px", marginRight: "1rem", gap: "1rem", height: "18px", color: "#FFFFFF", border: "1.2px solid #33333340", borderRadius: "5px", cursor: "pointer" }} />

                                    
                                    <div className={styles.CheckLabel}>{x}</div>
                                </div>
                            </div>
                        )

                    })} */}
                </div>

                <div className={styles.BottomShareButton}>
                    <button
                        type="submit"
                        // className={` ${styles.AddCandidateBtn} focus:outline-none w-fit flex justify-between gap-0 cursor-pointer  rounded-lg bg-[#228276]`}
                        className={` ${styles.AddCandidateBtn} focus:outline-none w-fit flex justify-between gap-0 cursor-pointer  rounded-lg bg-[#228276]`}
                    >
                        <div
                            // className="text-[#FFFFFF] text-sm self-center"
                            className={styles.ApplyText}
                        //   onClick={handleShowAddCandidate}
                        >
                            Share
                        </div>


                    </button>
                </div>


            </div >
    );
};

export default ReportsCheckboxPopup;
