import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./Calender.module.css";
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
import { CheckBox } from "@material-ui/icons";
import { Link } from "react-router-dom";
// import { Field, Form } from "formik";
// import Switch from 'react-switch';
import { Switch } from '@mui/material';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../../../assets/images/UserAvatar.png";
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DateTimePicker from "react-datetime-picker";
import { TiTick } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
// import { Datepicker, Input, Page, setOptions /* localeImport */ } from '@mobiscroll/react';


// setOptions({
//     // localeJs,
//     // themeJs
// });
// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
// import { color } from "html2canvas/dist/types/css/types/color";
// xxxxxxxxxxxxxxxxxxx
const Calender = ({ isMobile, setIsEditing, sendDataToParent }) => {
    const { handleUpdateUserDetails } = useUser();
    const [user, setUser] = useState(null);
    const [countryCode, setcountryCode] = useState([]);
    const [fieldErrors, setFieldErrors] = useState();
    const [passcode, setPasscode] = useState([]);
    const { handlePopupCenterOpen } = usePopup();
    const { userDetails } = useSelector(state => state.user);
    const firstInputRef = useRef();
    const secondInputRef = useRef();
    const thirdInputRef = useRef();
    const fourInputRef = useRef();
    const firstInput2Ref = useRef();
    const secondInput2Ref = useRef();
    const thirdInput2Ref = useRef();
    const fourInput2Ref = useRef();
    const firstInput3Ref = useRef();
    const secondInput3Ref = useRef();
    const thirdInput3Ref = useRef();
    const fourInput3Ref = useRef();
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
    const [dateTimeValue, setDateTimeValue] = useState(null);
    // const [datePicked, setDatePicked] = useState(null)

    const [start, startRef] = useState(null);
    const [end, endRef] = useState(null);
    // const [linksData, setLinksData] = useState({
    //     linkName: "",
    //     link: "",
    //     botton: "",
    //     createdon: "",
    //     activity: "",

    // });
    const linksData = [
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "24",

        },
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "0",

        },
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "5",

        },
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "3",

        },
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "6",

        },
        {
            linkName: "Web Developer",
            link: "https://share.report.com/fegrgadvsfdgfg",
            botton: "butt",
            createdon: "24 may",
            activity: "three",

        },

    ]

    const recentVisit = [
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },
        {
            Name: "Sathish",
            Role: "Product Manager",
            TimeSpent: "15:42",
            Analytics: "View Activity",


        },

    ]
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
        let fieldErrors = {};

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



        // if (!contactDetails?.email || contactDetails?.email.trim() === "") {
        //     fieldErrors.email = "Email is required!";
        // } else {
        //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //     if (!emailRegex.test(contactDetails?.email)) {
        //         fieldErrors.email = "Please enter a valid email!";
        //     } else if (contactDetails.email.length > 50) {
        //         fieldErrors.email = "Email should not be longer than 50 characters!";
        //     }
        // }



        // if (!contactDetails?.contact || contactDetails?.contact.trim() === "") {
        //     fieldErrors.contact = "Contact is required!";
        // } else {
        //     if (contactDetails?.contact.length > 11 || contactDetails?.contact.length <= 6) {
        //         fieldErrors.contact = "Phone should be between 7 to 11 digits!";
        //     }
        //     const phoneRegex = /^[0-9][0-9]+$/
        //     if (!phoneRegex.test(contactDetails?.contact)) {
        //         fieldErrors.contact = "Only numbers are allowed!";
        //     }
        // }



        // Update the fieldErrors state
        setFieldErrors(fieldErrors);

        // Check if there are no errors and proceed
        if (Object.keys(fieldErrors).length === 0) {
            handleUpdateUserDetails({
                user_id: user?._id,
                updates: { data: contactDetails },
            });
            handlePopupCenterOpen(false);
            if (isMobile) {
                setIsEditing(false)
            }
        }
    };

    const handleCancel = () => {
        handlePopupCenterOpen(false);
        // setContactDetails({
        //     firstName: userDetails.user?.firstName,
        //     lastname: userDetails.user?.lastname,
        //     email: userDetails.user?.email,
        //     linkedinurl: userDetails.user?.linkedinurl,
        //     contact: userDetails.user?.contact,
        //     countryCode: userDetails.user?.countryCode,
        //     location: userDetails.user?.location,
        // });
        // if (isMobile) {
        //     setIsEditing(false)
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



    useEffect(() => { }, [passcode])
    const handleFirstInputKeyPress = (event) => {
        // console.log(event.target.value, "aaaaaaaaaaaarreeeeeee", event.target.id)
        let arr1 = [];
        if (event.target.id === "first" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            secondInputRef.current.focus();
        }
        if (event.target.id === "second" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            thirdInputRef.current.focus();

        } if (event.target.id === "third" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            fourInputRef.current.focus();
        }
        if (event.target.id === "fourth" && event.target.value.length >= 1) {
            // alert("aaaaaaaaaaaaa")
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

            // return;
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

        }
        // console.log("aaaaaaaaaaaaaaaaalasttt", passcode)
    };
    const handleSecondInputKeyPress = (event) => {
        // console.log(event.target.value, "aaaaaaaaaaaarreeeeeee", event.target.id)
        let arr1 = [];
        if (event.target.id === "first2" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            secondInput2Ref.current.focus();
        }
        if (event.target.id === "second2" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            thirdInput2Ref.current.focus();

        } if (event.target.id === "third2" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            fourInput2Ref.current.focus();
        }
        if (event.target.id === "fourth2" && event.target.value.length >= 1) {
            // alert("aaaaaaaaaaaaa")
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

            // return;
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

        }
        // console.log("aaaaaaaaaaaaaaaaalasttt", passcode)
    };

    const handleThirdInputKeyPress = (event) => {
        // console.log(event.target.value, "aaaaaaaaaaaarreeeeeee", event.target.id)
        let arr1 = [];
        if (event.target.id === "first3" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            secondInput3Ref.current.focus();
        }
        if (event.target.id === "second3" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            thirdInput3Ref.current.focus();

        } if (event.target.id === "third3" && event.target.value.length >= 1) {
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            fourInput3Ref.current.focus();
        }
        if (event.target.id === "fourth3" && event.target.value.length >= 1) {
            // alert("aaaaaaaaaaaaa")
            // arr1.push(event.target.value)
            // setPasscode(event.target.value)
            setPasscode(prevDetails => ([
                ...prevDetails,
                event.target.value,
            ]));
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

            // return;
            // console.log(event.target.value, "aaaaaaaaaaaarreeeeee77e", event.target.id)

        }
        // console.log("aaaaaaaaaaaaaaaaalasttt", passcode)
    };

    const handleSelectedDateTime = () => {
        let normalDate = dayjs(dateTimeValue).format('DD.MM.YYYY, hh:mm A');
        //console.log('clicked here', normalDate);
        sendDataToParent(dateTimeValue);
        handleCancel();
    }

    const sx2 = {
        '&.MuiContainer-root': {
            width: '300px',
        }
    }
    const sx1 = {

        display: "flex",
        justifyContent: "center",
        '&.MuiMultiSectionDigitalClock-root': {
            // width: "263.16px",
            height: "168px",
            gap: "1rem",
            "& .Mui-selected": {
                // color: "#454545",


                backgroundColor: "rgb(34, 130, 118)",
            },
            "& .MuiPickersDay-dayWithMargin": {
                color: "",
                // backgroundColor: "yellow"
                backgroundColor: "rgb(34, 130, 118)",
                // backgroundColor: "#228276"
            },
            // width: '200px',
            // height: "100px",
            '&.MuiMenuItem-root': {
                width: '180px',
            },
            '&.MuiList-root': {
                width: '65px',
            },
        }
    }

    const sx = {
        // "& .MuiPaper-root": {
        //     backgroundColor: "grey"
        // },
        // "& .MuiCalendarPicker-root": {
        //     backgroundColor: "green"
        // },
        // "& .MuiPickersDay-dayWithMargin": {
        //     color: "",
        //     // backgroundColor: "yellow"
        //     backgroundColor: "rgb(34, 130, 118)",
        //     // backgroundColor: "#228276"
        // },
        // "& .Mui-selected": {
        //     // color: "#454545",


        //     backgroundColor: "rgb(34, 130, 118)",
        // },
        // "& .MuiTabs-root": {
        //     backgroundColor: "orange"
        // },
        // "& .css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root.Mui-selected": {
        //     color: "white",
        //     backgroundColor: "red"
        // },
        "& .css-1wy8uaa-MuiButtonBase-root-MuiPickersDay-root.Mui-selected": {
            color: "#888888",
            backgroundColor: "yellow"
        },
        // '.MuiPickersYear-yearButton.Mui-selected':{
        //     backgroundColor: '#0079FF',
        // "& .MuiPickersDay-today": {
        //     color: "#888888",
        //     backgroundColor: "yellow"
        // },
        // "& .Mui-selected": {
        //     color: "#888888",
        //     backgroundColor: "blue"
        // },
        // "& .MuiDateCalendar-root": {
        //     color: "yellow",
        //     backgroundColor: "red"
        // },

        // '&.MuiPickersDay-root.Mui-selected': {
        //     backgroundColor: "yellow",
        // },
        // ':not(.Mui-selected)': {
        //     backgroundColor: 'violet',
        //     borderColor: "red",
        // },
        // '&:hover': {
        //     backgroundColor: "green",
        //     borderColor: "blue",
        //     transition: 'all 0.5s ease',
        // },
        // '&.MuiPickersDay-root .Mui-selected': {
        //     color: 'pink',
        //     backgroundColor: "red",
        //     borderColor: "yellow",
        //     '&:hover': {
        //         color: 'red',
        //         backgroundColor: "yellow",
        //         borderColor: "blue",
        //         transition: 'all 0.5s ease',
        //     },
        // },
    };
    return (
        isMobile ? <div >

        </div> :

            <div className={styles.Wrapper}>
                {/* <div>
                    <h2 className={styles.Heading}>Contact Details</h2>
                </div> */}
                <div className={styles.Layoutt}>
                    {/* <div className={styles.Spacingbetween}> */}
                    {/* <div className="flex justify-normal gap-5"> */}

                    {/* <h2 className={styles.Heading}>Analytics</h2> */}
                    <div className={styles.Heading}>Expires Date & Time</div>
                    <div className={styles.CancelButtonLayout} onClick={handleCancel}>
                        <CancelIcon style={{ width: "23.71px", height: "23.71px", opacity: "0px", color: "rgba(214, 97, 90, 1)" }} />
                        {/* <button className={styles.CancelButton}>Cancel</button> */}
                    </div>
                    {/* </div> */}
                </div>

                {/* <div className={styles.Upper}> */}
                <div className={styles.Linksgenerated}>
                    <div className={styles.LinksText}>
                        <div className={styles.SelectDatesPlacement}>
                            <div className={styles.SelectDatesText}>
                                Select Dates
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateField', 'TimeField']} cl>
                                    <DateCalendar
                                        style={{
                                            width: "454px",
                                            height: "339px",
                                            // border: "1.68px",
                                            border: "1.68px solid #E3E3E3",
                                            borderRadius: "24px",
                                            background: "#FFFFFF",

                                        }}
                                        slotProps={{
                                            textField: {
                                                size: 'medium',
                                            },
                                            day: {
                                                sx: {
                                                    ['&[data-mui-date="true"] .Mui-selected']: {
                                                        // Reset the background color of the selected date
                                                        backgroundColor: 'blue',
                                                    },
                                                    ':not(.Mui-selected)': {
                                                        backgroundColor: "white",
                                                        borderColor: "white",
                                                    },
                                                    '&.Mui-selected': {
                                                        color: "white",
                                                        backgroundColor: "#228276",
                                                        borderColor: "red",
                                                        ':hover': {
                                                            color: "white",
                                                            backgroundColor: "#228276",
                                                            borderColor: "black",
                                                        },
                                                    },
                                                    ':hover': {
                                                        color: "white",
                                                        backgroundColor: "#228276",
                                                        borderColor: "black",
                                                    },

                                                },
                                            },
                                        }}

                                        value={dateTimeValue}
                                        sx={sx}
                                        onChange={(newValue) => setDateTimeValue(newValue)}
                                    // PopperProps={{
                                    //     sx: popperSx
                                    // }}
                                    />

                                </DemoContainer>
                                {/* <div className={styles.SelectTime}>
                                    <div className={styles.SelectTimeTextLayout}>
                                        <div className={styles.SelectTimeText}>Select Time</div>
                                    </div>
                                    <div className={styles.Clock} >
                                        <MultiSectionDigitalClock sx={sx1} value={dateTimeValue} onChange={(newValue) => setDateTimeValue(newValue)} />
                                    </div>
                                </div> */}
                            </LocalizationProvider>
                        </div>
                    </div>
                    {/* </div> */}


                </div>

                {/* </div> */}
                <div className={styles.Midline}></div>

                <div className={styles.RecentVisit}>
                    {/* <div className={styles.RecentVisitPlacement}> */}
                    <div className={styles.RecentVisitPlacement}>
                        {/* <button className={styles.SaveBtn} >
                            <div className={styles.ApplyText}>Apply</div>
                        </button> */}
                        <button
                            type="submit"
                            className={` ${styles.AddCandidateBtn} focus:outline-none w-fit flex justify-between gap-0 cursor-pointer  rounded-lg bg-[#228276]`} onClick={handleSelectedDateTime}
                        >
                            <div
                                // className="text-[#FFFFFF] text-sm self-center"
                                className={styles.ApplyText}
                            //   onClick={handleShowAddCandidate}
                            >
                                Apply
                            </div>
                            <div className="flex justify-center items-center h-[27px] py-1">
                                {/* <AiOutlinePlus className="text-[#FFFFFF] h-full" /> */}
                                {/* <TiTick  className="text-white text-2xl" /> */}
                                {/* <TiTick style={{ fontSize: "1.2rem" }} className="text-white " /> */}
                                <FaCheck className="text-white " style={{ fontSize: "0.9rem" }} />
                            </div>

                        </button>

                    </div>
                </div>

                {/* table */}


                {/* table */}




                {/* </div> */}



            </div >
    );
};

export default Calender;
