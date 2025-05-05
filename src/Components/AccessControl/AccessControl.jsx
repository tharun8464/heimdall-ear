import { Card, Dialog, FormControl, FormControlLabel, FormLabel, Input, InputAdornment, OutlinedInput, Radio, RadioGroup, TextField } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from "react";
import styles from "./AccessControl.module.css";
import usePopup from "../../Hooks/usePopup";

import Avatar1 from "../../assets/images/ProfilePictures/Pf1.png";
import Avatar2 from "../../assets/images/ProfilePictures/Pf2.png";
import Avatar3 from "../../assets/images/ProfilePictures/Pf2+.png";
import Avatar from "../../assets/images/UserAvatar.png"
import { CheckCircle, ExpandLess, ExpandMore, Search } from "@material-ui/icons";
import Button from "../Button/Button";

const AccessControl = ({ listParticipants, sendDataToParent }) => {
    const [show, setShow] = useState(true);
    const [checked, setChecked] = useState(false);
    const [authorizedAccess, setAuthorizedAccess] = useState(true);
    const [expand, setExpand] = useState(false);
    const [select, setSelect] = useState(false);
    const [selectedUser, setSelectedUser] = useState(false);
    const { handlePopupCenterOpen } = usePopup();
    const [selectedRecepient, setSelectedRecepient] = useState(listParticipants);

    // const handleDialogShow = () => {
    //     // setShow(false);
    //     handlePopupCenterOpen(false);
    // }

    const handleClick = () => {
        handlePopupCenterOpen(false);
        // sendDataToParent(data);
        // setShow(false);
    }

    const handleChange2 = (event) => {
        setChecked(false);
        setAuthorizedAccess(true);
    }

    const handleChange3 = (event) => {
        setChecked(true);
        setAuthorizedAccess(false);
    }

    const handleBlockUnblock = (data) => {
        let changedArray = selectedRecepient.map((item) =>
            (data?.email === item?.email) ? { ...item, isAuthorized: !item.isAuthorized } : item
        )
        setSelectedRecepient(changedArray);
    }

    useEffect(() => { }, [selectedRecepient]);

    const handleSave = () => {
        sendDataToParent(selectedRecepient);
        handleClick();
    }

    const style = {
        // SaveButton: {
        //     borderRadius: "0.5em",
        //     backgroundColor: "#228276",
        //     margin: "0 2px",
        //     textTransform: "none"
        // },
        // CancelButton: {
        //     borderRadius: "0.5em",
        //     backgroundColor: "#b3b3b3",
        //     margin: "0 2px",
        //     textTransform: "none",
        // },
        RadioButton: {
            '&.Mui-checked': {
                color: '#228276',
            },
        },
        RadioLabel: {
            width: '49%',
            '&, &.Mui-checked': {
                borderColor: '#228276',
                borderWidth: '2px',
                borderRadius: '0.5em',
            },
            // '& .MuiFormControlLabel-root:not(.Mui-checked):after': {
            //     borderColor: 'none',
            // }
        },
        SearchBar: {
            backgroundColor: '#EEEEEE',
            border: '1px',
            borderColor: 'rgba(34, 130, 118, 0.25)',
            borderRadius: '9px',
            margin: '0 5px',
            minWidth: '607px',
            height: '31px',
            justifyContent: 'space-between',
            zIndex: '1',
        },
        RestrictAccessButton: {
            borderRadius: "8px",
            margin: "0 5px",
            textTransform: "none",
            padding: '8px 16px',
            height: '31px',
            width: '152px'
        },
        CicleCheck: {
            color: '#228276',
            marginLeft: 'auto'
        }

    }

    return (
        <div className={styles.Container}>
            <div className={styles.PopupDisplay}>
                <div className={`flex border-b border-gray-200 mb-2 ${styles.PopupHeader}`}>
                    <div className="flex items-center px-2">
                        <span className={styles.HeadingText}>Access Control</span>
                    </div>
                    {/* <button className="flex" onClick={handleClick}>
                        <CancelRoundedIcon color="error" />
                    </button> */}
                    <div className={styles.CancelButtonLayout} onClick={handleClick}>
                        <CancelIcon style={{ width: "23.71px", height: "23.71px", opacity: "0px", color: "rgba(214, 97, 90, 1)" }} />
                        {/* <button className={styles.CancelButton}>Cancel</button> */}
                    </div>
                </div>
                <div className={styles.PopupContent}>
                    <div className="w-full my-2">
                        <FormControl sx={{ width: '100%' }}>
                            <FormLabel id="accessToAsset" sx={{ fontWeight: '590', '&, &.Mui-focused': { color: '#000' } }}>Choose who can access this asset</FormLabel>
                            <RadioGroup aria-labelledby="accessToAsset" defaultValue="authorizedAccess" name="radio-buttons-group" row sx={{ width: '100%', marginLeft: '11px', justifyContent: "space-between" }}>
                                <FormControlLabel value="authorizedAccess" control={<Radio sx={style.RadioButton} onChange={handleChange2} />} label="Authorized access" sx={checked ? null : style.RadioLabel} style={{ minWidth: '49%' }} />
                                <FormControlLabel value="restrictedAccess" control={<Radio sx={style.RadioButton} />} onChange={handleChange3} label="Restricted access" sx={checked ? style.RadioLabel : null} style={{ marginRight: 'auto' }} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <br />

                    {authorizedAccess ? (
                        <div className="">
                            <span>Everyone in the domain with the link can view this file.</span>
                            <div className="flex flex-column flex-start my-2">
                                {/* <div className="flex-row justify-start my-2">
                                    <div className={`flex ${styles.IconsOverlap}`}>
                                        <div className={styles.IconsSandwitched}>
                                            <img src={Avatar1} className={styles.Icon}></img>
                                            <img src={Avatar2} className={styles.Icon}></img>
                                            <img src={Avatar3} className={styles.Icon}></img>
                                        </div>
                                        <span className={styles.IconName}>ValueMatrix.ai</span>
                                    </div>
                                </div>
                                <div className="flex-row justify-start my-2">
                                    <div className={`flex ${styles.IconsOverlap}`}>
                                        <div className={styles.IconsSandwitched}>
                                            <img src={Avatar1} className={styles.Icon}></img>
                                            <img src={Avatar2} className={styles.Icon}></img>
                                            <img src={Avatar3} className={styles.Icon}></img>
                                        </div>
                                        <span className={styles.IconName}>Clevertap</span>
                                    </div>
                                </div> */}
                                {selectedRecepient?.map((item) => (
                                    <div className="flex-row justify-start my-2">
                                        {item?.isAuthorized ? (
                                            <div className={`flex ${styles.IconsOverlap}`}>
                                                <div className={styles.IconsSandwitched}>
                                                    <img src={Avatar} className="h-7 w-7 rounded-full"></img>
                                                </div>
                                                <span className={styles.IconName}>{item?.email}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : (
                        <div className="">
                            <div className="flex flex-column flex-start mb-2">
                                {/* {expand ? (
                                    <div className="flex flex-row justify-between my-2">
                                        <div className={`flex ${styles.IconsOverlap}`}>
                                            <div className={styles.IconsSandwitched}>
                                                <img src={Avatar1} className={styles.Icon}></img>
                                                <img src={Avatar2} className={styles.Icon}></img>
                                                <img src={Avatar3} className={styles.Icon}></img>
                                            </div>
                                            <span className={styles.IconName}>ValueMatrix.ai</span>
                                        </div>
                                        {expand ? (
                                            <ExpandMore onClick={expandClicked} />
                                        ) : (
                                            <ExpandLess onClick={expandClicked} />
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.ExpandBorder}>
                                            <div className={`flex flex-row justify-between mb-2 ${styles.GroupExpand}`} >
                                                <div className={`flex ${styles.IconsOverlap}`}>
                                                    <div className={styles.IconsSandwitched}>
                                                        <img src={Avatar1} className={styles.Icon}></img>
                                                        <img src={Avatar2} className={styles.Icon}></img>
                                                        <img src={Avatar3} className={styles.Icon}></img>
                                                    </div>
                                                    <span className={styles.IconName}>ValueMatrix.ai</span>
                                                </div>
                                                {expand ? (
                                                    <ExpandMore onClick={expandClicked} />
                                                ) : (
                                                    <ExpandLess onClick={expandClicked} />
                                                )}
                                            </div>
                                            <div className="flex flex-row mx-1">
                                                <OutlinedInput id="search-field" placeholder="Search" size="small" startAdornment={
                                                    <InputAdornment>
                                                        <Search position="start" style={{ color: "#228276" }} />
                                                    </InputAdornment>
                                                } sx={style.SearchBar} onSelect={selectClicked} />
                                                <Button variant="outlined" sx={style.RestrictAccessButton} color="error" disabled={!selectedUser}>Restrict Access</Button>
                                            </div>
                                            {select ? (
                                                <div className={`ml-2 rounded overflow-hidden shadow-lg ${styles.SearchCard}`}>
                                                    <div className="cardHeader m-2" style={{ fontSize: '14px' }}>Search Members</div>
                                                    <div className="flex flex-column m-2">
                                                        {selectedUser ? (
                                                            <>
                                                                <div className={`flex items-center py-2 ${styles.SelectedUser}`} onClick={selected1}>
                                                                    <img src={Avatar1} className={styles.SingleIcon} />
                                                                    <span className="mx-2">Nishant Kumar</span>
                                                                    <CheckCircle color="#228276" style={style.CicleCheck} />
                                                                </div>
                                                            </>

                                                        ) : (
                                                            <div className="flex items-center my-2" onClick={selected1}>
                                                                <img src={Avatar1} className={styles.SingleIcon}></img>
                                                                <span className="mx-2">Nishant Kumar</span>
                                                            </div>

                                                        )}
                                                        <div className="flex items-center my-2">
                                                            <img src={Avatar1} className={styles.SingleIcon}></img>
                                                            <span className="mx-2">Nishant Kumar</span>
                                                        </div>
                                                        <div className="flex items-center my-2">
                                                            <img src={Avatar1} className={styles.SingleIcon}></img>
                                                            <span className="mx-2">Nishant Kumar</span>
                                                        </div>
                                                        <div className="flex items-center my-2">
                                                            <img src={Avatar1} className={styles.SingleIcon}></img>
                                                            <span className="mx-2">Nishant Kumar</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (null)}
                                            <div className={`flex p-2 ${styles.IconsOverlap}`}>
                                                <div className={styles.IconsSandwitched}>
                                                    <img src={Avatar1} className={styles.Icon}></img>
                                                </div>
                                                <span className={styles.IconName}>Nishant Kumar</span>
                                                <div className="ml-auto" style={{ color: "#228276" }}>
                                                    Unblock
                                                </div>
                                            </div>

                                        </div>
                                    </>
                                )}
                                <div className="flex flex-row justify-between my-2">
                                    <div className={`flex ${styles.IconsOverlap}`}>
                                        <div className={styles.IconsSandwitched}>
                                            <img src={Avatar1} className={styles.Icon}></img>
                                            <img src={Avatar2} className={styles.Icon}></img>
                                            <img src={Avatar3} className={styles.Icon}></img>
                                        </div>
                                        <span className={styles.IconName}>Clevertap</span>
                                    </div>
                                    <ExpandMore onClick={expandClicked} />
                                </div> */}
                                {selectedRecepient?.map((item, index) => (
                                    <div className="flex-row justify-start my-2">
                                        <div className={`flex ${styles.IconsOverlap}`}>
                                            <div className={styles.IconsSandwitched}>
                                                <img src={Avatar} className="h-7 w-7 rounded-full"></img>
                                            </div>
                                            <span className={styles.IconName}>{item.email}</span>
                                            {item?.isAuthorized ? (
                                                <div className="ml-auto" style={{ color: "#D6615A" }} onClick={() => handleBlockUnblock(item)}>
                                                    Block
                                                </div>
                                            ) : (
                                                <div className="ml-auto" style={{ color: "#228276" }} onClick={() => handleBlockUnblock(item)}>
                                                    Unblock
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    )}
                </div>
                <div className={`border-t border-gray-200 ${styles.PopupFooter}`}>
                    <Button className={style.CancelButton} btnType={"secondary"} text={"Cancel"} onClick={handleClick}></Button>
                    <Button className={style.SaveButton} btnType={"primary"} text={"Save"} onClick={handleSave}></Button>
                </div>
            </div>
        </div >
    )
};

export default AccessControl;