import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./PasscodePopupReEnter.module.css";
import React, { useState, useRef } from "react";
import { getStorage, getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";
import { getCountryCode } from "../../../service/api";


// aaaaaaaaaaaaaaaaaaaa
import CancelIcon from '@mui/icons-material/Cancel';
import { CheckBox } from "@material-ui/icons";
// import { color } from "html2canvas/dist/types/css/types/color";
// xxxxxxxxxxxxxxxxxxx
const PasscodePopupReEnter = ({ isMobile, setIsEditing }) => {
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
        setContactDetails({
            firstName: userDetails.user?.firstName,
            lastname: userDetails.user?.lastname,
            email: userDetails.user?.email,
            linkedinurl: userDetails.user?.linkedinurl,
            contact: userDetails.user?.contact,
            countryCode: userDetails.user?.countryCode,
            location: userDetails.user?.location,
        });
        if (isMobile) {
            setIsEditing(false)
        }
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
                    <div className={styles.Heading}>Passcode</div>
                    <div className={styles.CancelButtonLayout}>
                        <CancelIcon style={{ width: "23.71px", height: "23.71px", opacity: "0px", color: "rgba(214, 97, 90, 1)" }} />
                        <button className={styles.CancelButton}>Cancel</button>
                    </div>
                    {/* </div> */}
                </div>
                {/* 1 */}
                <div className={styles.SetupPasscodeWrapper}>
                    <div className={styles.PasscodeWrapper1}>
                        <div className={styles.SetupPasscode}
                        // style={{ marginTop: "0px" }}
                        >

                            <div className={styles.PasscodeText}>
                                Set up Passcode
                            </div>

                            <form>
                                <div className={styles.Inputs}>

                                    <input className={styles.SingleInput} id="first" ref={firstInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="second" ref={secondInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="third" ref={thirdInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="fourth" ref={fourInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                </div>

                            </form>


                        </div>
                        {/* <div className={styles.checkkkk}>Checkbox</div> */}
                        {/* 2 */}
                        <div className={styles.SetupPasscode}
                            style={{ marginTop: "0px" }}>

                            <div className={styles.PasscodeText}>
                                Set up new Passcode
                            </div>

                            <form>
                                <div className={styles.Inputs}>

                                    <input className={styles.SingleInput} id="first2" ref={firstInput2Ref} onKeyUp={handleSecondInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="second2" ref={secondInput2Ref} onKeyUp={handleSecondInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="third2" ref={thirdInput2Ref} onKeyUp={handleSecondInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="fourth2" ref={fourInput2Ref} onKeyUp={handleSecondInputKeyPress} maxLength={1} />
                                </div>

                            </form>

                            {/* <input id="1" type="text" onChange={ValidatePassKey} />
                            <input id="2" type="text" onChange={ValidatePassKey} maxlength="4" />
                            <input id="3" type="text" onChange={ValidatePassKey} maxlength="4" />
                            <input id="4" type="text" maxlength="4"></input> */}

                        </div>
                        {/* 2 */}

                        {/* 3 */}
                        <div className={styles.SetupPasscode}
                            style={{ marginTop: "0px" }}>

                            <div className={styles.PasscodeText}>
                                Re-Enter Passcode
                            </div>


                            <form>
                                <div className={styles.Inputs}>

                                    <input className={styles.SingleInput} id="first3" ref={firstInput3Ref} onKeyUp={handleThirdInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="second3" ref={secondInput3Ref} onKeyUp={handleThirdInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="third3" ref={thirdInput3Ref} onKeyUp={handleThirdInputKeyPress} maxLength={1} />
                                    <input className={styles.SingleInput} id="fourth3" ref={fourInput3Ref} onKeyUp={handleThirdInputKeyPress} maxLength={1} />
                                </div>

                            </form>


                        </div>
                    </div>

                    {/* 3 */}
                    <div className={styles.CheckboxPlacement}>
                        <CheckBox style={{ width: "18px", marginLeft: "1rem", marginRight: "1rem", gap: "1rem", height: "18px", color: "#FFFFFF", border: "1.2px solid #33333340", borderRadius: "5px" }} />
                        {/* <CheckBox className={styles.CheckBox} /> */}
                        <div className={styles.CheckboxText}>Share passcode via email.</div>
                    </div>
                </div>
                {/* 1 */}


                <div className={styles.BottomLayout}>

                    <div className={styles.BottomLine}></div>

                    <div className={styles.InputWrapperBottom}>
                        {/* <button style={{ backgroundColor: "rgba(179, 179, 179, 1)", width: "102px", height: "40px", padding: "12px 24px 12px 24px", gap: "10px", borderRadius: "8px", opacity: "0px", textAlign: "center" }} onClick={handleCancel} >Cancel</button> */}
                        {/* <button className={`px-4 py-1 border rounded-md border-[#B3B3B3] text-[#FFFFFF]`} >Cancel</button> */}
                        <button className={styles.CancelBtn} >
                            Cancel
                        </button>
                        <button className={styles.SaveBtn} >
                            Save
                        </button>
                        {/* <Button btnType={"primary"} text={"Save"} onClick={handleSubmit} /> */}
                    </div>
                </div>
            </div>
    );
};

export default PasscodePopupReEnter;
