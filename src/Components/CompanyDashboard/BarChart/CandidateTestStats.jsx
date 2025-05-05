import React, { useEffect, Fragment, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import EmployeePsyStastics from "../../../assets/images/EmployeePsyStatistics.svg"
import {

    AiOutlinePlus,
    AiOutlineFolderAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Margin } from '@mui/icons-material';
import { getJobCount } from "../../../service/api"
import { getSessionStorage } from "../../../service/storageService"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



const options = {
    // maintainAspectRatio: false,
    // aspectRatio: 1,
    indexAxis: 'y', // This makes the bar horizontal
    responsive: true,
    // responsive: false,
    borderRadius: 5,
    // barThickness: 30, // Adjust this value to decrease or increase bar height
    barThickness: 50, // Adjust this value to decrease or increase bar height
    plugins: {
        legend: {
            display: false,
        },
        animation: false,
        tooltips: {
            enabled: false
        },
        maintainAspectRatio: false,
        aspectRatio: 1,
        // legend: {
        //     display: true,
        //     position: 'top',
        //     labels: {
        //         color: '#6B7280', // Tailwind's gray-500 color
        //         boxWidth: 12,
        //         padding: 20,

        //     },
        // },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            stacked: true,
            display: false,
        },
        y: {
            stacked: true,
            display: false,
        },
    },


    layout: {
        padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
    },
};

const CandidateTestStats = ({ jobdata, user }) => {
    const [aboutExpireJobs, setAboutExpireJobs] = React.useState(jobdata);

    // Update state when jobdata changes
    React.useEffect(() => {
        setAboutExpireJobs(jobdata);
    }, [jobdata]);

    const data = {
        labels: [''],
        datasets: [
            {
                label: 'Invited',
                // data: [100],
                data: [aboutExpireJobs.invitedInvitesCount],
                backgroundColor: '#A3A0FB',
            },
            {
                label: 'Pending',
                // data: [5],
                data: [aboutExpireJobs.pendingInvitesCount],
                backgroundColor: '#525DF5',
            },
            {
                label: 'Completed',
                // data: [28],
                data: [aboutExpireJobs.completedInvitesCount],
                backgroundColor: '#68B3AF',
            },
        ],
    };
    return (
        <div className="w-full h-full p-6 bg-white rounded-lg shadow-md">
            {/* <div className="flex flex-col justify-between mb-4 "> */}
            {/* <h2 className="text-lg font-semibold">Candidate Psychometric Test Statistics</h2> */}
            {/* <div className="flex flex-col items-center space-x-1"> */}
            {/* <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Live</span> */}
            {/* <p className="text-sm text-gray-500 mb-4">Last 30 days</p> */}

            {/* </div> */}
            {user === "candidate" ?
                <>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">Candidate Psychometric Test Statistics</h2>
                    <p className="text-sm text-gray-500 mb-4">Last 30 days</p>
                </>
                :
                <>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">Employee Psychometric Statistics</h2>
                    <p className="text-sm text-gray-500 mb-4">Last 30 days</p>
                </>
            }
            {/* </div> */}
            {false ?
                user === "candidate" ?
                    // <div className=" flex flex-col w-[100%] h-[100%] justify-center content-start flex-wrap mt-16  mb-4" >
                    <div className=" flex flex-col w-[100%]  mt-10 " >

                        <div className='align-self-center'>No Psychometric test data available</div>
                        <div className='align-self-center font-bold'>Invite candidates to take the tests to see </div>
                        <div className='align-self-center font-bold'>their results here</div>
                    </div>
                    :
                    <div className='flex w-[100%] h-[198px] my-2 justify-items-start gap-3'>
                        <img
                            src={EmployeePsyStastics}
                            alt="EmployeePsyStastics"
                            className=" w-[40%] h-[100%]"
                        />
                        <div className='flex flex-col w-[55%] h-[100%] justify-center '>

                            <div className='align-self-center'>No Psychometric data for employee </div>
                            <div className='align-self-center'>available</div>
                            <div className='align-self-center font-bold'>Invite employees to complete their tests </div>

                            <div className='align-self-center mt-4'>
                                <div className="flex justify-center px-2" >
                                    <Link to="/company/jobsAdd">
                                        <button
                                            // className="hover:bg-blue-700 flex text-white font-bold py-2 w-full text-sm  text-center rounded-lg"
                                            className=" flex text-white font-bold py-2 w-[123px] h-[46px] text-sm  text-center items-center justify-center rounded-lg"
                                            style={{ backgroundColor: "#228276" }}
                                        >
                                            <p className="mx-auto flex ">
                                                <p className="py-1 px-2 text-md">
                                                    <AiOutlinePlus />
                                                </p>
                                                Add Users
                                            </p>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>

                :
                user === "candidate" ?
                    <div className=' flex flex-col items-center justify-start  '>
                        <div className=" flex items-center justify-center ">
                            <span className="text-xs text-black  font-normal">
                                {aboutExpireJobs.invitedInvitesCount + aboutExpireJobs.pendingInvitesCount + aboutExpireJobs.completedInvitesCount}
                                {"  "}Total Users</span>
                        </div>
                        {/* <div style={{ width: "100%", height: "100px " }} className=' flex justify-center bg-yellow-300'> */}
                        <div style={{ width: "100%", height: "120px " }} className='flex justify-center items-center '>

                            {/* <div className='flex justify-center items-center'> */}
                            {/* <Bar style={{ width: "100%", height: "70px", marginLeft: "30px", marginRight: "-30px" }} className='' data={data} options={options} /> */}
                            <Bar className='' data={data} options={options} />
                        </div>
                        <div className=" flex justify-around w-[85%] text-sm mt-4">
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#A3A0FB] rounded-full"></span>
                                <span>Invited</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#525DF5] rounded-full"></span>
                                <span>Pending</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#68B3AF] rounded-full"></span>
                                <span>Completed</span>
                            </div>
                        </div>
                    </div>
                    :

                    <div className=' flex flex-col items-center justify-start  '>
                        <div className=" flex items-center justify-center ">
                            <span className="text-xs text-black  font-normal">22 Total Users</span>
                        </div>
                        {/* <div style={{ width: "540px", height: "100px " }} className=' flex justify-center bg-yellow-300'> */}
                        <div style={{ width: "540px", height: "120px " }} className=' flex justify-center items-center '>

                            {/* <div className='flex justify-center items-center'> */}
                            {/* <Bar style={{ width: "540px", height: "80px", marginLeft: "50px" }} className='' data={data} options={options} /> */}
                            <Bar style={{ width: "540px", height: "100px" }} className='' data={data} options={options} />
                        </div>
                        <div className=" flex justify-around w-[70%] text-sm mt-3">
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#A3A0FB] rounded-full"></span>
                                <span>Invited</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#525DF5] rounded-full"></span>
                                <span>Pending</span>
                            </div>
                            <div className="flex items-center">
                                <span className="inline-block w-3 h-3 mr-1 bg-[#68B3AF] rounded-full"></span>
                                <span>Completed</span>
                            </div>
                        </div>
                    </div>


            }
        </div>
    );
};

export default CandidateTestStats;