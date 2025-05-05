import useUser from "../../../Hooks/useUser";
import styles from "./Analytics.module.css";
import React, { useState, useRef } from "react";
import { getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";
import copySolid from "../../../assets/images/copySolid.svg"
import calendar from "../../../assets/images/calendar.svg"
import CancelIcon from '@mui/icons-material/Cancel';
import { Switch } from '@mui/material';
import { BiDotsVerticalRounded } from "react-icons/bi";
import Avatar from "../../../assets/images/UserAvatar.png";
import AnalyticsPopup from "../AnalyticsPopup/AnalyticsPopup";
import useList from "../../../Hooks/useList";
import { useParams } from "react-router-dom";


const Analytics = ({ isMobile, setIsEditing, jobId }) => {
    //const { handleUpdateUserDetails } = useUser();
    const { handleGetListByJobId } = useList();
    const [user, setUser] = useState(null);
    const [passcode, setPasscode] = useState([]);
    const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup();
    const { listDataByJobId } = useSelector(state => state.list);
    const url = "https://share.report.com";

    useEffect(() => {
        const initial = async () => {
            await handleGetListByJobId(jobId);
        }
        initial();
    }, []);

    // const linksData = [
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "24",

    //     },
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "0",

    //     },
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "5",

    //     },
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "3",

    //     },
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "6",

    //     },
    //     {
    //         linkName: "Web Developer",
    //         link: "https://share.report.com/fegrgadvsfdgfg",
    //         botton: "butt",
    //         createdon: "24 may",
    //         activity: "three",

    //     },

    // ]

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

    const handleCancel = () => {
        handlePopupCenterOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            let user = getSessionStorage("user");
            user = JSON.parse(user);
            setUser(user);
        };

        fetchUser();
    }, []);



    useEffect(() => { }, [passcode])

    const handleViewActivity = () => {
        handlePopupCenterOpen(true)
        handlePopupCenterComponentRender(<AnalyticsPopup />)
    }
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
                    <div className={styles.Heading}>Analytics</div>
                    <div className={styles.CancelButtonLayout} onClick={handleCancel}>
                        <CancelIcon style={{ width: "23.71px", height: "23.71px", opacity: "0px", color: "rgba(214, 97, 90, 1)" }} />
                        {/* <button className={styles.CancelButton}>Cancel</button> */}
                    </div>
                    {/* </div> */}
                </div>

                {/* <div className={styles.Upper}> */}
                <div className={styles.Linksgenerated}>
                    <div className={styles.LinksText}>
                        <div className={styles.LinksgeneratedText}>
                            Links Generated
                        </div>
                        <div className="flex gap-1">
                            <img
                                src={calendar}
                                className={styles.CalendarIcon}
                            // style={{ fill: "#888888" }}
                            // onClick={handleShowFilter}
                            />

                            <div className={styles.Extendtime}>
                                Extend Time
                            </div>
                        </div>
                    </div>
                    {/* </div> */}

                    <div
                        className={`overflow-hidden ${styles.SharedMembersTable}`}
                        style={{ overflowY: "scroll" }}
                    >
                        {/* <div
                        className={`overflow-hidden `}
                    style={{ overflowY: "scroll" }}
                    > */}
                        {/* <table className="w-full"> */}
                        <table className={`w-[100%]   `}>

                            {/* table header, name, status etc */}
                            {/* {showTableHeader ? ( */}
                            {true ? (
                                <thead className="bg-transperent">
                                    <tr className={`w-[100%] ${styles.HeadingRow} `}>
                                        {/* <th scope="col" className="text-sm font-medium text-[#888888]  px-6">
                      <Checkbox />
                    </th> */}
                                        <th
                                            scope="col"

                                            // className="text-sm font-medium text-[#888888] w-[25%]"
                                            // onClick={() => handleAscend("Name")}
                                            className={`bg-white ${styles.TableHeaderText} w-[25%]`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row gap-2 items-center">
                                                <div className={styles.IconWrapper}>
                                                    {/* <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                                                    <AiFillCaretDown style={{ fontSize: ".6rem" }} /> */}
                                                </div>
                                                <div className={styles.HeadingText}>Link Name</div>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-white w-[40%]"
                                            // onClick={() => handleAscend("Talent Match")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {/* <div className="flex flex-row gap-2 items-center"> */}
                                            <div className="flex justify-center gap-2 items-center">

                                                <div className={styles.HeadingText}>
                                                    {" "}
                                                    Link
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-white"
                                            // className="text-sm font-medium text-[#888888] bg-green-300 w-[20%]"
                                            // className=" "
                                            // onClick={() => handleAscend("Invitation Status")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row gap-2 items-center justify-center">

                                                <div className={styles.HeadingText}>

                                                    Created on
                                                </div>
                                            </div>


                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-white"
                                            // className="text-sm font-medium text-[#888888] "
                                            // onClick={() => handleAscend("Invitation Status")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row gap-2 items-center justify-center">

                                                <div className={styles.HeadingText}>
                                                    {" "}
                                                    Activity
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                            ) : null}
                            {/* {filteredCandidates?.length === 0 ? ( */}
                            {false ? (
                                <div className="flex items-center justify-center ">
                                    <p>No matching candidates found.</p>
                                </div>

                            ) : (
                                <tbody>
                                    {listDataByJobId?.listData?.length > 0 && listDataByJobId?.listData?.map((candidate, index) => {
                                        return (
                                            <tr className={`h-4 ${styles.RowMeasurement}  `}>
                                                <td className={`text-start pl-4 py-2 ${styles.LinkNameText}`}>
                                                    {candidate.listName}
                                                </td>
                                                <td className="text-center flex  justify-between py-1">
                                                    <div className={` ${styles.LinkIcon}`}>
                                                        <div className={styles.LinkText}> {url + "/" + (candidate?._id.length > 15 ? "....." : candidate?._id)}</div>
                                                        <img
                                                            src={copySolid}
                                                            className={styles.CopySolid}
                                                        // onClick={handleShowFilter}
                                                        />
                                                    </div>
                                                    <Switch
                                                        // checked={true}
                                                        // onChange={handleChange}
                                                        // inputProps={{ "aria-label": "controlled" }}
                                                        // style={{
                                                        //     fontSize: "0.6rem", color: "#228276", offColor: "#228276", width: "32px",
                                                        //     height: "17px",
                                                        //     uncheckedIcon: false,

                                                        //     borderRadius: "30px"

                                                        // }}
                                                        // style={{ Color: "#228276" }}
                                                        // trackColor={{ true: 'red', false: 'yellow' }}
                                                        sx={{

                                                            // '&.Mui-checked': {
                                                            //     transform: 'translateX(16px)',
                                                            //     color: '#fff',
                                                            //     '& + .MuiSwitch-track': {
                                                            //         // backgroundColor: '#2ECA45',
                                                            //         backgroundColor: '#65C466',

                                                            //     },
                                                            // },
                                                            // "& .MuiSwitch-switchBase": {
                                                            //     "&.Mui-checked": {
                                                            //         "+ .MuiSwitch-track": {
                                                            //             backgroundColor: "#228276"
                                                            //         },
                                                            //         ".MuiSwitch-thumb": {
                                                            //             backgroundColor: "#228276"
                                                            //         }
                                                            //     }
                                                            // }

                                                            "&.MuiSwitch-root .MuiSwitch-switchBase": {
                                                                color: "#FFFFFF"
                                                            },

                                                            // "&.MuiSwitch-root .Mui-checked": {
                                                            //     color: "#228276"
                                                            // },
                                                            // "&.Mui-checked + .MuiSwitch-track": {
                                                            //     backgroundColor: "#097969",
                                                            // },
                                                            "&.MuiSwitch-root .Mui-checked .MuiSwitch-switchBase": {
                                                                color: "#FFFFFF"
                                                            },

                                                            " &.MuiSwitch-root .MuiSwitch-track": {
                                                                // color: "#228276",
                                                                color: "#097969",
                                                                backgroundColor: "#097969",
                                                            }
                                                        }}
                                                    />
                                                    {/* <Form>
                                                        <label className="w-auto content-center px-4 flex p-1  text-md">
                                                            <label
                                                                for="Title-toggle"
                                                                className="inline-flex relative items-center cursor-pointer"
                                                            >
                                                                <Field
                                                                    type="checkbox"
                                                                    name="title"
                                                                    id="Title-toggle"
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                                <span className="ml-3 text-sm font-medium text-gray-900 ">
                                                                    <p className="text-md font-bold mx-3 font-gray-600">
                                                                        Show Title
                                                                    </p>
                                                                </span>
                                                            </label>
                                                        </label>
                                                    </Form> */}


                                                </td>
                                                <td className="text-center py-2">
                                                    <div className={styles.CreatedOn}>{new Date(candidate?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</div>
                                                </td>
                                                <td className="text-center py-2">
                                                    <div className={styles.Activity}>
                                                        <div className="flex gap-1 justify-center items-center">
                                                            <div className={styles.ActivityText}>{candidate?.activity} </div>
                                                            <div className={styles.ActivityVisitText}>Visit</div>
                                                        </div>
                                                        {/* <div><BiDotsVerticalRounded className="m-auto" style={{ color: "#747474" }} /></div> */}
                                                    </div>

                                                </td>
                                            </tr>


                                        );
                                    })}


                                </tbody>
                            )}
                        </table>
                    </div>
                </div>

                {/* </div> */}
                {/* <div className={styles.Midline}></div>

                <div className={styles.RecentVisit}>
                    <div className={styles.RecentVisitPlacement}>
                        <div className={styles.RecentVisitText}>Recent Visits</div>
                    </div> */}

                {/* table */}
                {/* <div
                        className={`overflow-hidden ${styles.SharedMembersTable}`}
                        style={{ overflowY: "scroll" }}
                    > */}
                {/* <div
                        className={`overflow-hidden `}
                    style={{ overflowY: "scroll" }}
                    > */}
                {/* <table className="w-full"> */}
                {/* <table className={`w-[100%]   `}> */}

                {/* table header, name, status etc */}
                {/* {showTableHeader ? ( */}
                {/* {true ? (
                                <thead className="bg-white ">
                                    <tr className={`w-[100%] ${styles.HeadingRow} `}> */}
                {/* <th scope="col" className="text-sm font-medium text-[#888888]  px-6">
                      <Checkbox />
                    </th> */}
                {/* <th
                                            scope="col"
                                            // className="text-sm font-medium text-[#888888] w-[25%]"
                                            // onClick={() => handleAscend("Name")}
                                            className={`bg-white ${styles.TableHeaderText} w-[25%]`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row mx-3 gap-2 items-center">
                                                <div className={styles.IconWrapper}> */}
                {/* <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                                                    <AiFillCaretDown style={{ fontSize: ".6rem" }} /> */}
                {/* </div>
                                                <div className={styles.HeadingText}>Name</div>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className=" w-[30%] bg-white"
                                            // onClick={() => handleAscend("Talent Match")}
                                            style={{ cursor: "pointer" }}
                                        > */}
                {/* <div className="flex flex-row gap-2 items-center"> */}
                {/* <div className="flex justify-center gap-2 items-center">

                                                <div className={styles.HeadingText}>
                                                    {" "}
                                                    Role
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-white"
                                            // className="text-sm font-medium text-[#888888] bg-green-300 w-[20%]"
                                            // className=" bg-green-300  "
                                            // onClick={() => handleAscend("Invitation Status")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row mx-3 gap-2 items-center justify-center">

                                                <div className={styles.HeadingText}>

                                                    Time Spent
                                                </div>
                                            </div>


                                        </th>
                                        <th
                                            scope="col"
                                            className="bg-white "
                                            // onClick={() => handleAscend("Invitation Status")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="flex flex-row mx-3 gap-2 items-center justify-center">

                                                <div className={styles.HeadingText}>
                                                    {" "}
                                                    Analytics
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                            ) : null} */}
                {/* {filteredCandidates?.length === 0 ? ( */}
                {/* {false ? (
                                <div className="flex items-center justify-center ">
                                    <p>No matching candidates found.</p>
                                </div>

                            ) : (
                                <tbody>
                                    {recentVisit?.map((candidate, index) => {
                                        return (
                                            // <tr className="h-4 ">
                                            <tr className={`h-4 ${styles.RowMeasurement}  `}> */}
                {/* <td className="text-start pl-3 py-2"> */}
                {/* <td className={`text-start  `}>
                                                    <div className="flex justify-start ml-4">
                                                        <div className={styles.UserDp}>
                                                            <img
                                                                className={`object-contain ${styles.UserDp}`}
                                                                src={candidate?.userImage ? candidate?.userImage : Avatar}
                                                                alt=""></img>
                                                        </div>
                                                        <div className={`text-start pl-3 py-2 ${styles.TableSecNameText}`}>{candidate.Name} </div>
                                                    </div>
                                                </td>

                                                <td className="text-center py-2">
                                                    <div className={styles.TableSecRoleText}> {candidate.Role}</div>
                                                </td>
                                                <td className="text-center py-2">
                                                    <div className={styles.TableSecTimeText}> {candidate.TimeSpent}</div>
                                                </td>
                                                <td className="text-center  ">
                                                    <button
                                                        className={styles.TableSecAnalyticsText}
                                                        onClick={handleViewActivity}
                                                    >{candidate.Analytics} </button> */}
                {/* <div className={styles.TableSecAnalyticsText}>{candidate.Analytics} </div> */}

                {/* </td>
                                            </tr>


                                        );
                                    })}


                                </tbody>
                            )}
                        </table>
                    </div> */}

                {/* table */}




                {/* </div> */}



            </div >
    );
};

export default Analytics;
