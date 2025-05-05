import { Checkbox, Switch } from "@mui/material";
import CustomInput from "../../CustomInput/CustomInput";
import Button from "../../Button/Button";
import styles from "./ConfigureView.module.css"
import usePopup from "../../../Hooks/usePopup";
import SelectExpiryDateTime from "../SelectExpiryDateTime/SelectExpiryDateTime";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from "react";
import AccessControl from "../../AccessControl/AccessControl";

import Calender from "../../../Pages/AdminDashboard/CalenderPopup/Calender";
import PasscodePopup from "../../../Pages/AdminDashboard/PasscodePopup/PasscodePopup";
import PasscodePopupReEnter from "../../../Pages/AdminDashboard/PasscodePopupReEnter/PasscodePopupReEnter";
import { Clear } from "@material-ui/icons";
import { CalendarMonthOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const URL = process.env.REACT_APP_SHARE_REPORT_URL;
const ConfigureView = ({ listId, handleOnChange, dataFromConfigureView, listDetails }) => {

    const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup()
    const [recepientOrg, setRecepientOrg] = useState(true);
    const [showShareLink, setShowShareLink] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(true);
    const [isExpiresChecked, setIsExpiresChecked] = useState(false);
    const [domain, setDomain] = useState("")


    const [dateError, setDateError] = useState(null);

    const [recepientLists, setRecepientsList] = useState([])
    const [dateTime, setDateTime] = useState("");
    const [dateTimeSelected, setDateTimeSelected] = useState(false);

    const [isPasscodeChecked, setIsPasscodeChecked] = useState(false);
    const [passcode, setPasscode] = useState(null);
    const { listDataByJobId } = useSelector(state => state.list);

    const showRecepientOrganisation = (e) => {
        e.preventDefault();
        setIsEmailChecked(!isEmailChecked);
        setRecepientOrg(!recepientOrg);
        sendEmailArray(recepientLists);
        // dataFromConfigureView({ email: recepientLists });
    }

    const sendEmailArray = (data) => {
        dataFromConfigureView({ email: data });
    }

    const showExpiresDate = (e) => {
        e.preventDefault();
        setIsExpiresChecked(!isExpiresChecked);
    }

    // const handleDataFromChild = (data) => {
    //     let localDate = dayjs(data).format('DD.MM.YYYY, hh:mm A');
    //     let UTCDate = dayjs(data).format();
    //     setDateTime(localDate);
    //     if (data) {
    //         setDateTimeSelected(true);
    //     }
    //     dataFromConfigureView({ expiryDate: UTCDate });
    // }

    const handleDataFromChild = (data) => {
        const now = dayjs(); // Current date and time
        const selectedDate = dayjs(data);

        if (selectedDate.isBefore(now, 'minute')) { // Check if the selected date is in the past
            setDateError("Expiry date cannot be in the past.");
            setDateTimeSelected(false); // Ensure the flag is reset if there's an error
            return; // Exit the function early
        }

        let localDate = selectedDate.format('DD.MM.YYYY, hh:mm A');
        let UTCDate = selectedDate.format();

        setDateTime(localDate);
        setDateTimeSelected(true);
        setDateError(null); // Clear any previous error
        dataFromConfigureView({ expiryDate: UTCDate });
    };


    const handleDataFromPasscode = (data) => {
        setPasscode(data);
    }
    useEffect(() => {
        if (passcode) {
            let passcodeDecode = passcode?.passcode;
            dataFromConfigureView({ passcode: passcodeDecode, isShareByEmail: passcode?.isShareByEmail });
        }
    }, [passcode]);

    const showSetPin = (e) => {
        e.preventDefault();
        setIsPasscodeChecked(!isPasscodeChecked);
    }

    const handleDataFromAccessControl = (data) => {
        dataFromConfigureView({ sharedTo: data });
    }

    const handleShowDateRange = () => {
        // handlePopupCenterComponentRender(<SelectExpiryDateTime />)
        handlePopupCenterComponentRender(<Calender sendDataToParent={handleDataFromChild} />)
        handlePopupCenterOpen(true)
    }
    const handleShowPasscode = () => {
        // handlePopupCenterComponentRender(<SelectExpiryDateTime />)
        handlePopupCenterComponentRender(<PasscodePopup sendDataToParent={handleDataFromPasscode} />)
        handlePopupCenterOpen(true)
    }
    const handleShowPasscodeReEnter = () => {

        handlePopupCenterComponentRender(<PasscodePopupReEnter />)
        handlePopupCenterOpen(true)
    }

    const handleShowAccessControlPopup = () => {

        handlePopupCenterComponentRender(<AccessControl listParticipants={listDetails?.sharedTo} sendDataToParent={handleDataFromAccessControl} />)
        handlePopupCenterOpen(true);
    }

    const handleShareLink = () => {
        setShowShareLink(!showShareLink);
    }



    const style = {
        CheckboxClass: {
            padding: 0,
            '&.Mui-checked': {
                color: "#228276",
            }
        }
    }

    const handleCopy = () => {

        const textToCopy = `${URL}/login/${listId}`;
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                toast('Copied to clipboard!');
            })
            .catch((error) => {
                toast.error('Failed to copy!');
            });
    };

    const validateEmail = (email) => {
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // Dots (.), underscores (_), percentage (%), plus (+), and hyphens (-) in the local part of the email.
        if (regex.test(email)) {
            return true;
        } else {
            toast.error('Invalid email!');
            return false;
        }
    }

    const preventMinus = (e) => {
        if (e.code === "NumpadSubtract" || e.code === "Minus") {
            e.preventDefault();
        }
        if (e.target.value > 3) {
            e.preventDefault();
            toast.error("Number should be below 3");
        }
    }

    return (<div className="p-3 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-4">
            <h2 className="font-bold">Account</h2>
            {/* <div className="border p-2 rounded-lg text-[#7b7b7b] flex justify-center items-center">Recipient’s Organisation/ Domain</div> */}
            <CustomInput placeholder="Recipient’s Organisation/ Domain" className="border p-2 rounded-lg text-[#7b7b7b] flex justify-center items-center" onKeyPress={event => {
                if (event.key === "Enter" && event.target.value.trim() && domain?.length <= 40 && validateEmail(domain)) {
                    const updatedRecepientLists = [...recepientLists, event.target.value.trim()]; // Create a new updated list
                    setRecepientsList(updatedRecepientLists); // Update state
                    // dataFromConfigureView({ email: updatedRecepientLists }); // Immediately call with updated list
                    sendEmailArray(updatedRecepientLists);
                    event.target.value = ""; // Clear input
                }
            }} onChange={(e) => setDomain(e.target.value)} errorMessage={domain?.length > 40 ? "domain/email too long" : null} />
            {recepientOrg ? (
                <div className="flex">
                    <div className="flex flex-row gap-x-5 items-center flex-wrap gap-y-2">
                        {recepientLists?.map((item, index) => {
                            return <Button text={item} btnType={"outlined"} className={styles.RecepientOrgBtn} icon={<div onClick={() => {
                                const updatedRecepientLists = ([...recepientLists.slice(0, index), ...recepientLists.slice(index + 1)])
                                setRecepientsList(updatedRecepientLists); // Update state
                                // dataFromConfigureView({ email: updatedRecepientLists }); // Immediately call with updated list
                                sendEmailArray(updatedRecepientLists);
                            }}><Clear fontSize="small" on /></div>} />
                        })}
                    </div>
                </div>
            ) : (null)}
            <div className="flex gap-4 items-center">
                <Checkbox sx={style.CheckboxClass} checked={isEmailChecked} onClick={e => showRecepientOrganisation(e)} />
                <label htmlFor="">Requires Email to view</label>
            </div>
            <div className="flex gap-4 items-center">
                <Checkbox sx={style.CheckboxClass} checked={isExpiresChecked} onClick={e => showExpiresDate(e)} />
                <label htmlFor="">Document Expires</label>
            </div>
        </div>
        <div className="flex flex-col gap-4">
            {isExpiresChecked ? <>
                <span>Select Date Range</span>
                {dateTimeSelected ? (
                    <div className="border-2 border-[#228276] p-2 rounded-lg text-[#7b7b7b] flex justify-items-start items-center" onClick={handleShowDateRange}>
                        <CalendarMonthOutlined />
                        {dateTime}
                    </div>
                ) : (
                    <div className="border p-2 rounded-lg text-[#7b7b7b] flex justify-items-start items-center" onClick={handleShowDateRange}>
                        <CalendarMonthOutlined />
                        Expires on Date and Time
                    </div>
                )}
            </> : (null)}
            {dateError && (
                <div className="text-red-600">{dateError}</div>
            )}
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    <Checkbox sx={style.CheckboxClass} checked={isPasscodeChecked} onClick={e => showSetPin(e)} />
                    <label htmlFor="">Passcode</label>
                </div>
                {isPasscodeChecked ?
                    <span className="text-[var(--primary-green)]" onClick={handleShowPasscode}>Set pin</span>
                    :
                    (null)
                    // <span className="text-[var(--primary-green)]" onClick={handleShowPasscodeReEnter}>Reset</span>
                }
            </div>
            <div className="flex flex-row gap-4 justify-between">
                <div className="flex gap-4 items-center">
                    <Checkbox sx={style.CheckboxClass} />
                    <label htmlFor="">Number of visits</label>
                </div>
                <div className="w-32">
                    <CustomInput type="number" min="0" max="3" style={{ width: '100px !important' }} onChange={e => dataFromConfigureView({ visits: e })} onKeyPress={preventMinus} />
                </div>
            </div>
        </div>
        <div className="flex justify-between">
            <h2 className="font-bold">
                Access Control
            </h2>
            <span className="text-[var(--primary-green)]" onClick={handleShowAccessControlPopup}>Edit Access</span>
        </div>
        <div className="flex flex-col gap-4">
            <h1 className="font-bold text-md">Advanced Features</h1>
            {/* <div className="flex justify-between items-center">
                <span>Add Watermark</span>
                <Switch sx={{

                    "&.MuiSwitch-root .MuiSwitch-switchBase": {
                        color: "#FFFFFF",
                        "&.Mui-checked": {
                            color: "#097969",
                        }
                    },

                    " &.MuiSwitch-root .MuiSwitch-track": {
                        backgroundColor: "#228276",
                    },

                }}
                    name="isWaterMarkAdded"
                    onChange={e => dataFromConfigureView({ isWaterMarkAdded: e })} />
            </div> */}
            <div className="flex justify-between items-center">
                <span>Show Analytics</span>
                <Switch sx={{

                    "&.MuiSwitch-root .MuiSwitch-switchBase": {
                        color: "#FFFFFF",
                        "&.Mui-checked": {
                            color: "#097969",
                        }
                    },

                    " &.MuiSwitch-root .MuiSwitch-track": {
                        backgroundColor: "#228276",
                    },

                }}
                    name="isShowAnalytics"
                    onChange={e => dataFromConfigureView({ isShowAnalytics: e })} />
            </div>
            <div className="flex justify-between items-center">
                <span>Share link manually</span>
                <ContentCopyIcon sx={{
                    color: "#097969",
                    marginRight: "10px",
                    cursor: "pointer",
                }} onClick={handleCopy} />
            </div>
            {/* {showShareLink ? (
                <div className="border-2 p-2 rounded-lg text-[#7b7b7b] flex justify-center items-center border-[#228276]">
                    <span onClick={handleCopy} style={{ overflowX: 'hidden' }}>{URL}/login/{listId}</span>
                </div>
            ) : (null)} */}


        </div>
        {/* <div className={styles.BottomBtnsWrapper}>
            <Button
                text={"Send email"}
                btnType={"primary"}
                className={styles.BtnClass}
            />
        </div> */}
    </div>);
}

export default ConfigureView;
