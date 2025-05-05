import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend as ChartLegend } from 'chart.js';
import NoJobNotification from "../../../assets/images/NoJobNotification.svg"
import {

    AiOutlinePlus,
    AiOutlineFolderAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";

import { getStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../../../src/service/storageService";
import {
    PaymentSuccess,
    newOrder,
    getUserCurrentCredit,
    listJobs,
    listBinJobs,
    // listJobBinwithPagination,
    listActiveJobwithPagination,
    listBinjobwithPagination,
    getJobCount,
} from "../../../service/api";

Chart.register(ArcElement, Tooltip, ChartLegend);



const JobNotificationComp = ({ jobdata, visibility }) => {
    const [activejobs, setactivejobs] = React.useState(0);
    const [pendingjobs, setpendingjobs] = React.useState(0);
    const [expiredjobs, setexpiredjobs] = React.useState(0);
    const [notacceptingjobs, setnotacceptingjobs] = React.useState(0);
    const [closedjobs, setclosedjobs] = React.useState(0);
    const [archivedjobs, setarchivedjobs] = React.useState(0);
    const [credit, setCredit] = React.useState(null);


    React.useEffect(() => {
        setactivejobs(jobdata?.jobdata?.active);
        setnotacceptingjobs(jobdata?.jobdata?.not_accepted);
        setclosedjobs(jobdata?.jobdata?.closedJob);
        setarchivedjobs(jobdata?.jobdata?.archived);
        setpendingjobs(jobdata?.jobdata?.pendingJobs);
        setexpiredjobs(jobdata?.jobdata?.expiredJobs)

    }, [jobdata]);


    const data = {
        labels: Object.keys(visibility).filter(key => visibility[key]),
        datasets: [
            {
                // data: [30, 20, 20, 10, 10, 10].filter((_, index) => visibility[Object.keys(visibility)[index]]),
                data: [pendingjobs, activejobs, closedjobs, expiredjobs, notacceptingjobs, archivedjobs].filter((_, index) => visibility[Object.keys(visibility)[index]]),
                // currently available [ 'Active', 'Archived', 'Closed', 'Not Accepting', 'Pending' ]
                backgroundColor: [
                    '#D1D5DB', //Pending 1
                    '#7fcdbb', // Active 1
                    '#a1dab4', // Closed 1
                    '#8c96c6', // Expired
                    '#e31a1c', // Not Accepting 1
                    '#66c2a4', // Archived 1
                    '#a6bddb', // Draft
                ].filter((_, index) => visibility[Object.keys(visibility)[index]]),
                borderWidth: 1,
                hoverOffset: 1
            },
        ],
    };

    const options = {
        cutout: '70%', // Inner radius for the donut effect
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="flex flex-col mt-12 items-center mb-4">
            {/* <div className="relative w-72 h-72"> */}
            <div className="grid relative w-96 h-96">
                <Doughnut data={data} options={options} />
                <div className="absolute place-self-center flex flex-col items-center justify-center w-32 h-32 ">
                    {/* <div className="absolute inset-0 flex flex-col items-center justify-center"> */}
                    <h2 className="text-4xl font-semibold">{data.datasets[0].data.reduce((a, b) => a + b, 0) || 0}</h2>
                    <p className="text-gray-600">Total Jobs</p>
                </div>
            </div>

        </div>
    );
};

const Legend = ({ visibility, toggleVisibility }) => {
    const labels = [
        { name: 'Pending', color: 'text-gray-300' },
        { name: 'Active', color: 'text-green-300' },
        { name: 'Closed', color: 'text-green-400' },
        { name: 'Expired', color: 'text-purple-400' },
        { name: 'Archived', color: 'text-green-500' },
        // { name: 'Draft', color: 'text-blue-300' },
        { name: 'Not Accepting', color: 'text-red-600' },
    ];

    return (
        <div className="mt-6 flex flex-col items-center ">
            {/* <div className='flex w-[404px] justify-between mx-2 mb-4'> */}
            <div className='flex w-[95%] justify-between mx-2 mb-4 '>
                <div>
                    <h2 className="text-lg font-medium text-gray-700 ">Job Notification</h2>
                    <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
                </div>
                {/* <a href="/details" className=" text-blue-500 hover:underline">View Details</a> */}
            </div>

            {false ? "" :
                <ul className="flex flex-wrap mx-4 mt-12 ">
                    {labels.map((label) => (
                        // <li key={label.name} className="flex items-center w-1/3 mb-2">
                        <li key={label.name} className="flex items-center w-1/4 mb-2">
                            <span className={label.color}>●</span>
                            <span className="ml-1 whitespace-nowrap">{label.name}</span>
                            <button onClick={() => toggleVisibility(label.name)} className="ml-1">
                                {visibility[label.name] ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );

};

const JobNotificationChart = (jobdata) => {
    const [visibility, setVisibility] = useState({
        Pending: true,
        Active: true,
        Closed: true,
        Expired: true,
        'Not Accepting': true,
        Archived: true,
    });

    const toggleVisibility = (label) => {
        setVisibility({
            ...visibility,
            [label]: !visibility[label],
        });
    };

    return (
        <div className="flex flex-col  items-center h-[100%] ">
            <Legend visibility={visibility} toggleVisibility={toggleVisibility} />
            {false ? <div className='w-[404px] h-[483px] flex flex-col items-center justify-center '>
                <img
                    src={NoJobNotification}
                    alt="NoJobNotification"
                    className=" w-[197px] h-[214px]"
                />
                <div className=" flex flex-col  justify-center content-start flex-wrap mt-16  mb-4" >

                    <div className='align-self-center'>No job notifications available</div>
                    <div className='align-self-center font-bold'>Post a new job to start receiving notifications</div>
                </div>
                {/* <div className="w-full px-6" onClick={ }> */}
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
                                Post a job
                            </p>
                        </button>
                    </Link>
                </div>
            </div> :
                <JobNotificationComp jobdata={jobdata} visibility={visibility} />
            }
        </div>
    );
};

export default JobNotificationChart;