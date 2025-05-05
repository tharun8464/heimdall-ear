import Button from "../../../Components/Button/Button";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import useUser from "../../../Hooks/useUser";
import styles from "./AnalyticsPopup.module.css";
import React, { useState } from "react";
import { getStorage, getSessionStorage } from "../../../service/storageService";
import { useEffect } from "react";
import usePopup from "../../../Hooks/usePopup";
import { useSelector } from "react-redux";




import { IoCaretUpSharp } from "react-icons/io5";
import { AiFillCaretDown, AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { BarChart } from '@mui/x-charts/BarChart';
import ArrowDown from "../../../../src/assets/images/arrow-down.svg"
import { axisClasses } from "@mui/x-charts";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";



const AnalyticsPopup = () => {

    const [user, setUser] = useState(null);
    const { handlePopupCenterOpen } = usePopup();
    const { userDetails } = useSelector(state => state.user);



    const handleChange = e => {
        // const { name, value } = e.target;
        // setContactDetails(prevDetails => ({
        //   ...prevDetails,
        //   [name]: value,
        // }));
    };

    const handleSubmit = () => {
        // let fieldErrors = {};

        // const trimmedLinkedinUrl = contactDetails?.linkedinurl?.split("?")[0]
        // contactDetails.linkedinurl = trimmedLinkedinUrl

        // const nameRegex = /^[a-zA-Z ]+$/; // Updated Regex to allow spaces

        // if (!contactDetails?.firstName || contactDetails?.firstName.trim() === "") {
        //   fieldErrors.firstName = "First name is required!";
        // } else if (!nameRegex.test(contactDetails.firstName)) {
        //   fieldErrors.firstName = "First name should not contain special characters!";
        // } else if (contactDetails.firstName.length > 25) {
        //   fieldErrors.firstName = "First name should not be longer than 25 characters!";
        // }

        // // Update the fieldErrors state
        // setFieldErrors(fieldErrors);

        // // Check if there are no errors and proceed
        // if (Object.keys(fieldErrors).length === 0) {
        //   handleUpdateUserDetails({
        //     user_id: user?._id,
        //     updates: { data: contactDetails },
        //   });
        //   handlePopupCenterOpen(false);
        // }
    };

    const handleCancel = () => {
        // handlePopupCenterOpen(false);
        // setContactDetails({
        //   firstName: userDetails.user?.firstName,
        //   lastname: userDetails.user?.lastname,
        //   email: userDetails.user?.email,
        //   linkedinurl: userDetails.user?.linkedinurl,
        //   contact: userDetails.user?.contact,
        //   countryCode: userDetails.user?.countryCode,
        //   location: userDetails.user?.location,
        // });
        // if (isMobile) {
        //   setIsEditing(false)
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

    // const chartSetting = {
    //   xAxis: [
    //     {
    //       label: 'rainfall (mm)',
    //       scaleType: "band"
    //     }
    //   ],
    //   width: 500,
    //   height: 400,
    // };
    const chartSetting = {
        xAxis: [
            {
                label: "No. of visit",

            }
        ],

        // height: "10px",
        sx: {
            "& .MuiChartsAxis-bottom .MuiChartsAxis-label": {
                // strokeWidth: "0.4",
                fill: "rgba(136, 136, 136, 1)"

            },

            [`.${axisClasses.left} .${axisClasses.line}`]: {
                display: "none"
            },
            [`.${axisClasses.bottom} .${axisClasses.line}`]: {
                display: "none"
            },
            [`.${axisClasses.left} .${axisClasses.tick}`]: {
                display: "none"
            },
            [`.${axisClasses.left} .${axisClasses.tickLabel}`]: {
                // display: "none",

                fill: "rgba(116, 116, 116, 1)"
            },
            [`.${axisClasses.bottom} .${axisClasses.tick}`]: {
                display: "none"
            },
            "& .MuiChartsGrid-line": {
                strokeDasharray: '5 3', strokeWidth: 1,
            }
            // [`.${ChartsGrid}`]: {
            //   strokeDasharray: '5 3', strokeWidth: 2
            // },
        }
    };
    const chartSettingBottom = {
        yAxis: [
            {
                label: "Time Spent on Report",

            }
        ],

        // height: "10px",
        sx: {
            [`.${axisClasses.bottom} .${axisClasses.tickLabel}`]: {
                // display: "none",

                fill: "rgba(136, 136, 136, 1)"
            },

            "& .MuiChartsAxis-left .MuiChartsAxis-label": {
                // strokeWidth: "0.4",
                // transform: "translateX(-10px)",
                fill: "rgba(116, 116, 116, 1)"

            },
            "& .MuiChartsAxis-bottom .MuiChartsAxis-label": {
                // strokeWidth: "0.4",
                transform: "translateY(20px)",
                fill: "rgba(116, 116, 116, 1)"

            },
            [`.${axisClasses.left} .${axisClasses.line}`]: {
                display: "none"
            },
            [`.${axisClasses.bottom} .${axisClasses.line}`]: {
                display: "none"
            },
            [`.${axisClasses.left} .${axisClasses.tick}`]: {
                display: "none"
            },
            [`.${axisClasses.bottom} .${axisClasses.tick}`]: {
                display: "none"
            },
            "& .MuiChartsGrid-line": {
                strokeDasharray: '5 3', strokeWidth: 1,
            }
            // [`.${ChartsGrid}`]: {
            //   strokeDasharray: '5 3', strokeWidth: 2
            // },
        }
    };
    const tableHeader = [
        {
            text: "Name",
            icon: ""
        },
        {
            text: "Time Spent",
            icon: ""
        },
        {
            text: "Total Visit",
            icon: ""
        },


    ];
    const data = [
        {
            candidate: "aaaaaaaa",
            _id: "aaaaaaaa",
            firstName: "aaaaaaaaa",
            lastname: "aaaaaaaa",
            Name: "Kunal Kapoor",
            TimeSpent: "02:45",
            TotalVisit: "2",
            VMLiteReport: "true",
            VMproReport: "false",
            FeedbackReport: "false",
            TeamDynamics: "false",

        },
        {
            candidate: "aaaaaaaa",
            _id: "aaaaaaaa",
            firstName: "aaaaaaaaa",
            lastname: "aaaaaaaa",
            Name: "Reyansh Lamba",
            TimeSpent: "02:45",
            TotalVisit: "2",
            VMLiteReport: "true",
            VMproReport: "false",
            FeedbackReport: "false",
            TeamDynamics: "false",

        },
        {
            candidate: "aaaaaaaa",
            _id: "aaaaaaaa",
            firstName: "aaaaaaaaa",
            lastname: "aaaaaaaa",
            Name: "Jai Singh",
            TimeSpent: "02:45",
            TotalVisit: "2",
            VMLiteReport: "true",
            VMproReport: "false",
            FeedbackReport: "false",
            TeamDynamics: "false",

        },
        {
            candidate: "aaaaaaaa",
            _id: "aaaaaaaa",
            firstName: "aaaaaaaaa",
            lastname: "aaaaaaaa",
            Name: "Arjun Baskhar",
            TimeSpent: "02:45",
            TotalVisit: "2",
            VMLiteReport: "true",
            VMproReport: "false",
            FeedbackReport: "false",
            TeamDynamics: "false",

        }
    ]

    // function CustomBar(props) {
    //   console.log(props);
    //   return (
    //     <>
    //       <BarElementPath {...props} />
    //       <animated.text
    //         style={{
    //           x: to([props.style.x, props.style.width], (x, w) => x + w / 2),
    //           y: to([props.style.y, props.style.height], (y, h) => y + h / 2),
    //           textAnchor: 'end',
    //           textBaseline: 'bottom',
    //         }}
    //       >
    //         test
    //       </animated.text>
    //     </>
    //   );
    // }
    return (
        // isMobile ? <div className={`${styles.Wrapper}`}>

        // </div> :
        <div className={styles.Wrapper}>
            <div>
                <div className={styles.Layoutt}>

                    <div className="flex justify-normal gap-5">
                        <img
                            src={ArrowDown}
                            className={styles.Arrow}
                        // onClick={handleShowFilter}
                        />
                        <h2 className={styles.Heading}>Analytics</h2>
                    </div>
                </div>
                {/* <Divider style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 1.68px 6.71px 0px", height: "1px", width: "875px" }} /> */}
                {/* <div style={{ boxShadow: "0px 1.68px 6.71px 0px #00000026" }}></div> */}
                {/* <div style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 1.68px 6.71px 0px", height: "54px", width: "875px" }}> */}
                <div className={styles.InputWrapper}>
                    <div className={styles.UpperProfileWrapper}>
                        <h1 className={styles.ReportAnalysis}>Report Analysis</h1>
                        <div className="flex justify-end " style={{ position: 'relative', height: '95%' }}>


                            <BarChart
                                margin={{ left: 120 }}
                                thickness={5}
                                yAxis={[{ categoryGapRatio: 0.5, barGapRatio: 2, scaleType: "band", data: ['VM Lite Report', 'VM Pro Report', 'Feedback Report', 'Team Dynamics'] }]}
                                series={[{ color: "rgba(4, 100, 88, 1)", data: [9, 4, 5, 8] }]}
                                layout="horizontal"
                                grid={{ vertical: true }}
                                disableLine={true}
                                barLabel={"value"}
                                {...chartSetting}
                                slotProps={{
                                    bar: {
                                        clipPath: `inset(0px round 0px 20px 20px 0px)`,
                                    },
                                }}

                            />
                        </div>
                    </div>

                    {/* addd div for text and table */}
                    <div className="flex flex-col gap-4 content-around">
                        {/* <div className="flex justify-around"> */}
                        <div className={styles.TablePartText}>

                            <div>
                                <h1 className={styles.SharedMemberText}>
                                    Shared Members
                                </h1>

                            </div>

                            <div>
                                <button
                                    className={styles.DropdownButton}
                                    textStyle={{ color: "rgba(51, 51, 51, 0.5)" }}
                                    style={{ width: "141px", height: "29px" }}
                                // className="px-4 py-2 bg-white text-black rounded-md flex items-center"
                                // onClick={handleWeightageList}
                                >
                                    {/* {selectedWeightage ? selectedWeightage.name : "View saved"} */}
                                    {true ? "VM Lite Report" : "View saved"}
                                    <ArrowDropDownIcon fontSize="small" />
                                </button>
                            </div>

                        </div>





                        {/* <div
              className="overflow-hidden"
              style={{ overflowY: "scroll" }}
            > */}
                        <div
                            className={`overflow-hidden ${styles.SharedMembersTable}`}
                            style={{ overflowY: "scroll" }}
                        >
                            {/* <table className="w-full"> */}
                            <table className={`w-[100%]   `}>

                                {/* table header, name, status etc */}
                                {/* {showTableHeader ? ( */}
                                {true ? (
                                    <thead className="bg-white border-b">
                                        <tr className={`w-[100%] ${styles.HeadingRow} `}>
                                            {/* <th scope="col" className="text-sm font-medium text-[#888888]  px-6">
                      <Checkbox />
                    </th> */}
                                            <th
                                                scope="col"
                                                className="text-sm font-medium text-[#888888] "
                                                // onClick={() => handleAscend("Name")}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="flex flex-row mx-1 gap-2 items-center">
                                                    <div className={styles.IconWrapper}>
                                                        <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                                                        <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                                                    </div>
                                                    <div className={styles.HeadingText}>Name</div>
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="text-sm font-medium text-[#888888] "
                                                // onClick={() => handleAscend("Talent Match")}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {/* <div className="flex flex-row gap-2 items-center"> */}
                                                <div className="flex gap-2 items-center">
                                                    <div>
                                                        <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                                                        <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                                                    </div>
                                                    <div className={styles.HeadingText}>
                                                        {" "}
                                                        Time spent
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="text-sm font-medium text-[#888888] "
                                                // onClick={() => handleAscend("Invitation Status")}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <div className="flex flex-row  gap-2 items-center">
                                                    <div>
                                                        <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                                                        <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                                                    </div>
                                                    <div className={styles.HeadingText}>
                                                        {" "}
                                                        Total visit
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
                                        {data?.map((candidate, index) => {
                                            return (
                                                <tr className="h-4 ">
                                                    <td className={`${styles.SharedMembersText} text-start pl-3 py-2`}>
                                                        {candidate.Name}
                                                    </td>
                                                    <td className={`${styles.SharedMembersText} text-center py-2`}>
                                                        {candidate.TimeSpent}
                                                    </td>
                                                    <td className={`${styles.SharedMembersText} text-center py-2 `}>
                                                        {candidate.TotalVisit}
                                                    </td>
                                                </tr>


                                            );
                                        })}


                                    </tbody>
                                )}
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex flex-col">
                <div className={styles.SectionAnalysisText}>Section Analysis</div>

                <div className="flex flex-row gap-3 my-2">
                    <button
                        className={styles.DropdownButtonBottom1}
                        style={{ color: "rgba(51, 51, 51, 1)" }}

                    // ref={buttonRef}
                    // className="px-4 py-2 bg-white text-black rounded-md flex items-center"
                    // onClick={handleWeightageList}
                    >
                        {/* {selectedWeightage ? selectedWeightage.name : "View saved"} */}
                        {true ? "Kunal Kapoor" : "View saved"}
                        <ArrowDropDownIcon fontSize="small" />
                    </button>


                    <button
                        className={styles.DropdownButtonBottom1}
                        style={{ color: "rgba(51, 51, 51, 1)" }}

                    // ref={buttonRef}
                    // className="px-4 py-2 bg-white text-black rounded-md flex items-center"
                    // onClick={handleWeightageList}
                    >
                        {/* {selectedWeightage ? selectedWeightage.name : "View saved"} */}
                        {true ? "VM Lite Report" : "View saved"}
                        <ArrowDropDownIcon fontSize="small" />
                    </button>

                </div>
                <div className={styles.BottomBarGraph}>
                    {/* <ResponsiveChartContainer width="80" > */}
                    {/* <Container sx={{ height: '100%', }}> */}
                    <BarChart
                        // barPercentage: 0.4
                        xAxis={[{ label: "Sections of report", categoryGapRatio: 0.8, scaleType: 'band', data: ['Positives\n&Negatives', 'Summary\n(candidate)', 'Personality\nInsights', 'Cultural\nmatch', 'Competitors\nMatch', 'Competitors\nMatch'] }]}
                        series={[{ labelStyle: { transform: 'translateX(-20px)' }, margin: "10px", color: "rgba(4, 100, 88, 1)", data: [4, 3.5, 3.9, 3, 2.2, 2.2] }]}
                        grid={{ horizontal: true }}
                        margin={{ bottom: 65 }}
                        // viewBox="0 0 400 150"
                        // height={250}
                        disableLine={true}
                        barLabel="value"
                        slotProps={{
                            bar: {
                                clipPath: `inset(0px round 20px 20px 0px 0px)`,
                            },
                        }}
                        barGapRatio={2}
                        {...chartSettingBottom}

                    />
                    {/* </ResponsiveChartContainer> */}
                    {/* </Container> */}
                </div>
            </div> {/* bottom component 2nd parent  */}

        </div >
    );
};

export default AnalyticsPopup;