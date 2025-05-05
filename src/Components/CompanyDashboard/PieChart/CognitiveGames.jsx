import React, { useEffect, Fragment, useState } from "react";
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Cuate from "../../../../src/assets/images/cuate.svg"
import EmployeeCultureStatistics from "../../../../src/assets/images/EmployeeCultureStatistics.svg"
import {

    AiOutlinePlus,
    AiOutlineFolderAdd,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { getJobCount } from '../../../service/api';
// import { getSessionStorage } from '../../../service/storageService';
import { getSessionStorage } from '../../../service/storageService';

const CognitiveGames = ({ jobdata, type }) => {
    const [aboutExpireJobs, setAboutExpireJobs] = React.useState(jobdata);

    // Update state when jobdata changes
    React.useEffect(() => {
        setAboutExpireJobs(jobdata);
    }, [jobdata]);


    const data = {
        labels: ['Invited', 'Pending', 'Completed'],
        datasets: [
            {
                // data: [50, 40, 10],
                data: [aboutExpireJobs.CognitiveInvitedCount,
                    0,
                aboutExpireJobs.CognitiveCompletedCount
                ],
                backgroundColor: ['#B6C2F9', '#4D4DFF', '#5DACA7'],
                hoverBackgroundColor: ['#B6C2F9', '#4D4DFF', '#5DACA7'],
                borderWidth: 0,
            },
        ],
    };

    const dataemployee = {
        labels: ['High', 'Medium', 'Low', 'Not enough data'],

        datasets: [
            {
                // data: [35, 20, 10, 35],
                data: [aboutExpireJobs.highFlippedMatchCount,
                aboutExpireJobs.medFlippedMatchCount,
                aboutExpireJobs.lowFlippedMatchCount,
                aboutExpireJobs.notenoughdataCount],
                backgroundColor: ['#D4E04A', '#A061C7', '#F9AFCE', '#D6615A'],
                hoverBackgroundColor: ['#D4E04A', '#A061C7', '#F9AFCE', '#D6615A'],
                borderWidth: 0,
            },
        ],
    };

    // const options = {
    //     maintainAspectRatio: false,
    //     aspectRatio: 1
    // }
    const options = {
        responsive: true,
        animation: false,
        tooltips: {
            enabled: false
        },
        maintainAspectRatio: false,
        aspectRatio: 1,
        // responsive: false,

        datalabels: {
            formatter: (value) => {
                return value + '%';
            },
        },
        plugins: {
            // tooltip: {
            //     callbacks: {
            //         label: (d) => {
            //             const percentage = ` ${100}%`

            //             return percentage
            //         },
            //     },
            // },
            // labels: {
            //     render: 'label'
            // },
            // labels: {
            //     render: 'value',
            //     fontSize: 14,
            //     fontStyle: 'bold',
            //     fontColor: '#000',
            //     fontFamily: '"Lucida Console", Monaco, monospace'
            // },
            // labels: [
            //     {
            //         render: 'label',
            //         position: 'outside'
            //     },
            //     {
            //         render: 'percentage'
            //     }
            // ],
            labels: [
                {
                    render: 'label',
                    position: 'outside',
                    fontColor: '#000',
                    fontSize: 15
                },
                {
                    render: 'percentage',
                    fontColor: '#000',
                    fontSize: 10,
                    position: 'border',
                }
            ],
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: '#6B7280', // Tailwind's gray-500 color
                    boxWidth: 12,
                    padding: 20,

                },
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

    return (
        // <div className="bg-blue-200 rounded-lg p-6 shadow-md w-full h-full flex flex-col">
        <div className=" rounded-lg p-2 shadow-md w-full h-full flex flex-col justify-center items-center">
            <div className=' w-[100%] h-[25%] flex flex-col'>

                {type === "candidate" ?
                    <div className='mx-2'>
                        <h2 className="text-lg font-medium text-gray-700 mb-2 mt-2">Candidate Cognitive Games Statistics</h2>
                        <p className="text-sm text-gray-500">Last 30 days</p>
                    </div>
                    :
                    <div className='mx-2'>
                        <h2 className="text-lg font-medium text-gray-700 mb-2 mt-2">Employee Culture Statistics</h2>
                        <p className="text-sm text-gray-500">Last 30 days</p>
                    </div>
                }
            </div>
            {type === "candidate" ?
                <div style={{ width: "90%", height: "60%" }} className='flex justify-center '>
                    <Pie
                        // style={{ width: "100px", height: "100px", marginBottom: "1%", padding: "1%" }}
                        className='self-center' data={data} options={options} />
                </div>
                :
                <div style={{ width: "60%", height: "100%" }} className=' w-[100%] h-[75%] flex justify-center'>
                    <Pie
                        // style={{ width: "100px", height: "100px", marginBottom: "1%", padding: "1%" }}
                        className='self-center' data={dataemployee} options={options} />
                </div>
            }
            {/* <div className='flex flex-col bg-transperent basis-1/4'>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Candidate Cognitive Games Statistics</h2>
            <p className="text-sm text-gray-500 mb-4">Last 30 days</p>
            </div>
            <div className='bg-blue-800 flex justify-center flex-col basis-1/2 '>

            {false ?
                type === "Psychometric" ?
                    // <div className='grid w-[100%] h-[90%] my-2 justify-items-start '>
                    <div className='flex w-[100%]  my-2 justify-items-start gap-3'>
                        <img
                            src={Cuate}
                            alt="cuate2"
                            className=" w-[40%] h-[100%]"
                        />
                        <div className='flex flex-col w-[55%] h-[100%]  '>
                            <div className=" align-self-center"> No cognitive games data</div>
                            <div className=" align-self-center"> available</div>
                            <div className=" align-self-center"> Send game invites to</div>
                            <div className=" align-self-center"> candidates to see</div>
                            <div className=" align-self-center"> stastics  here</div>



                        </div>
                    </div>
                    :
                    <div className='flex w-[100%] h-[198px] my-2 justify-items-start gap-3'>
                        <img
                            src={EmployeeCultureStatistics}
                            alt="EmployeeCultureStatistics"
                            className=" w-[40%] h-[100%]"
                        />
                        <div className='flex flex-col w-[55%] h-[100%]  justify-center '>
                            <div className=" align-self-center"> No culture data available</div>
                            <div className=" align-self-center font-bold"> Invite employees to complete their test</div>


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
                    // <div className="w-2/3 mx-auto">
                    // <div className="w-2/3 mx-auto">
                    <Pie
                        style={{ width: "90%", height: "80%", marginBottom: "1%", padding: "1%" }}
                        className='bg-orange-500 ' data={data} options={options} />
                    // </div>
                }
            </div> */}
        </div>
    );
};

export default CognitiveGames;