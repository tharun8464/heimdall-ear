import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./PasscodePopup.module.css";
import React, { useState, useRef } from "react";
import { getStorage, getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";
import { getCountryCode } from "../../../service/api";


// aaaaaaaaaaaaaaaaaaaa
import CancelIcon from '@mui/icons-material/Cancel';
import { CheckBox } from "@material-ui/icons";
import { toast } from "react-toastify";
// import { color } from "html2canvas/dist/types/css/types/color";
// xxxxxxxxxxxxxxxxxxx
const PasscodePopup = ({ isMobile, setIsEditing, sendDataToParent }) => {
    const { handleUpdateUserDetails } = useUser();
    const [user, setUser] = useState(null);
    const [countryCode, setcountryCode] = useState([]);
    const [fieldErrors, setFieldErrors] = useState();
    const [passcode, setPasscode] = useState(['', '', '', '']);
    const [isShareByEmail, setIsShareByEmail] = useState(true);
    const { handlePopupCenterOpen } = usePopup();
    const { userDetails } = useSelector(state => state.user);
    const firstInputRef = useRef();
    const secondInputRef = useRef();
    const thirdInputRef = useRef();
    const fourInputRef = useRef();
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


    const handleChange = e => {
        const { name, value } = e.target;
        setContactDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (passcode.some(item => ['', 'null', 'undefined'].includes(item))) {
            toast.error('Four digits passcode is required!');
            return;
        }
        if (passcode instanceof Array) {
            setPasscode(passcode);
            let joinPasscode = passcode.join("")
            sendDataToParent({ passcode: joinPasscode, isShareByEmail: isShareByEmail });
            handlePopupCenterOpen(false);
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


    const handleFirstInputKeyPress = (event) => {
        const myPasscodeList = [...passcode];
        if (event.target.id === "first") {
            if (event.key === "Backspace") {
                myPasscodeList[0] = '';
                firstInputRef.current.focus();
                setPasscode(myPasscodeList);
                return;
            }
            myPasscodeList[0] = event.target.value;
            secondInputRef.current.focus();

        }
        if (event.target.id === "second") {
            if (event.key === "Backspace") {
                myPasscodeList[1] = '';
                firstInputRef.current.focus();
                setPasscode(myPasscodeList);
                return;
            }
            myPasscodeList[1] = event.target.value;
            thirdInputRef.current.focus();
        }
        if (event.target.id === "third") {
            if (event.key === "Backspace") {
                myPasscodeList[2] = '';
                secondInputRef.current.focus();
                setPasscode(myPasscodeList);
                return;
            }
            myPasscodeList[2] = event.target.value;
            fourInputRef.current.focus();
        }
        if (event.target.id === "fourth") {
            if (event.key === "Backspace") {
                myPasscodeList[3] = '';
                thirdInputRef.current.focus();
                setPasscode(myPasscodeList);
                return;
            }
            myPasscodeList[3] = event.target.value;
        }
        setPasscode(myPasscodeList);
    };

    useEffect(() => {
    }, [passcode]);

    const style = {
        CheckboxClass: {
            padding: 0,
            '&.Mui-checked': {
                color: "#228276",
            },

        }
    }

    const handleChecked = (data) => {
        setIsShareByEmail(data);
    }

    return (
        isMobile ? <div>

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
                    <div className={styles.CancelButtonLayout} onClick={handleCancel}>
                        <CancelIcon style={{ width: "23.71px", height: "23.71px", opacity: "0px", color: "rgba(214, 97, 90, 1)" }} />
                        {/* <button className={styles.CancelButton}>Cancel</button> */}
                    </div>
                    {/* </div> */}
                </div>
                <div className={styles.SetupPasscodeWrapper}>
                    <div className={styles.SetupPasscodeMain}>
                        <div className={styles.SetupPasscode}>

                            <div className={styles.PasscodeText}>
                                Set up Passcode
                            </div>

                            <form>
                                <div className={styles.Inputs}>

                                    <input onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))} className={styles.SingleInput} id="first" ref={firstInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))} className={styles.SingleInput} id="second" ref={secondInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))} className={styles.SingleInput} id="third" ref={thirdInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                    <input onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))} className={styles.SingleInput} id="fourth" ref={fourInputRef} onKeyUp={handleFirstInputKeyPress} maxLength={1} />
                                </div>

                            </form>

                        </div>
                    </div>
                    <div className={styles.CheckboxPlacement}>
                        {isShareByEmail ? <CheckBox
                            checked={isShareByEmail}
                            sx={style.CheckboxClass}
                            style={{ width: "20px", height: "20px", color: "#228276", marginLeft: "1rem", marginRight: "0.4rem", gap: "1rem", marginTop: "0.2rem", }}
                            onClick={() => handleChecked(!isShareByEmail)}
                        /> :
                            <CheckBox className={styles.CheckBox} onClick={() => handleChecked(!isShareByEmail)} style={{ width: "18px", marginLeft: "1rem", marginRight: "0.5rem", marginTop: "0.2rem", gap: "1rem", height: "18px", color: "#FFFFFF", border: "1.2px solid #33333340", borderRadius: "5px" }} />
                        }
                        <div htmlFor="">Share passcode via email.</div>
                    </div>
                </div>

                <div className={styles.BottomLayout}>

                    <div className={styles.BottomLine}></div>

                    <div className={styles.InputWrapperBottom}>
                        {/* <button style={{ backgroundColor: "rgba(179, 179, 179, 1)", width: "102px", height: "40px", padding: "12px 24px 12px 24px", gap: "10px", borderRadius: "8px", opacity: "0px", textAlign: "center" }} onClick={handleCancel} >Cancel</button> */}
                        {/* <button className={`px-4 py-1 border rounded-md border-[#B3B3B3] text-[#FFFFFF]`} >Cancel</button> */}
                        {/* <button className={styles.CancelButton} onClick={handleCancel}>
                            Cancel
                        </button>
                        <button
                            className={styles.SaveBtn}
                            onClick={handleSubmit}
                            disabled={passcode.some(item => ['', 'null', 'undefined'].includes(item))}
                        >
                            Save
                        </button> */}
                        <Button className={style.CancelButton} btnType={"secondary"} text={"Cancel"} onClick={handleCancel}></Button>
                        <Button className={style.SaveButton} btnType={"primary"} text={"Save"} onClick={handleSubmit}
                        ></Button>
                        {/* <Button btnType={"primary"} text={"Save"} onClick={handleSubmit} /> */}
                    </div>
                </div>
            </div>
    );
};

export default PasscodePopup;
