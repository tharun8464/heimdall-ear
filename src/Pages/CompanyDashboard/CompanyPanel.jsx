import React, { useEffect, Fragment, useState } from "react";
// import DatePicker from 'react-datepicker';
// import DatePicker from "react-date-picker";
import calendar from "../../assets/images/calendar.svg"

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import '../AdminDashboard/CalenderStyles/datepicker.scss';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// Components
import Card from "../../Components/SuperXIDashboard/Cards";
import SessionCard from "../../Components/CompanyDashboard/sessions";
import { AiOutlineArrowUp } from "react-icons/ai";
import Avatar from "../../assets/images/UserAvatar.png";
// import { stats } from '../../Components/CompanyDashboard/Datasamples/statsData.js';
// import statsData from '../../Components/CompanyDashboard/Datasamples/statsData.js';

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
} from "../../service/api.js";

// Assets
import { Chart } from "react-charts";
import { Dialog, Transition } from "@headlessui/react";

import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";
import { Oval } from "react-loader-spinner";
import { BarLoader } from "react-spinners";
import { BsCashStack, BsThreeDots } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import swal from "sweetalert";
import RecentPeople from "./RecentPeople.jsx";
import { CgWorkAlt } from "react-icons/cg";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import ls from 'localstorage-slim';
import { getStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import JobTable from "../../Components/CompanyDashboard/tables/JobTable.jsx";
import JobNotificationChart from "../../Components/CompanyDashboard/Doughnut/JobNotificationChart.jsx";
import CognitiveGames from "../../Components/CompanyDashboard/PieChart/CognitiveGames.jsx";
import CandidateTestStats from "../../Components/CompanyDashboard/BarChart/CandidateTestStats.jsx";
import { StatisticsCard } from "../../Components/CompanyDashboard/Cards/StatsCard.jsx";
import JobPostingsmain from "../../Components/CompanyDashboard/JobPostingsmain.jsx";
import ExportReportModal from "../../Components/CompanyDashboard/ExportReportModal.jsx";
import InviteListModal from "../../Components/CompanyDashboard/InviteListModal.jsx";



const tabledata = [
    { col1: '1234567890', col2: 'SDE', col3: '02', col4: '01', col5: '01', col6: '01', col7: '01', col8: '01', col9: '01' },
    { col1: '1234567891', col2: 'PM', col3: '03', col4: '02', col5: '01', col6: '01', col7: '01', col8: '01', col9: '01' },
    { col1: '1234567892', col2: 'SDE-3', col3: '03', col4: '03', col5: '02', col6: '01', col7: '01', col8: '01', col9: '01' },

    // Add more rows as needed
];
const podtabledata = [
    { col1: '1234567890', col2: 'SDE', col3: '02', col4: ['001', "002"], col5: ['001', "002"], col6: ['001', "002"], col7: ['001', "002"], col8: ['001', "002"], col9: ['001', "002"] },
    { col1: '1234567891', col2: 'PM', col3: '03', col4: ['02'], col5: ['01'], col6: ['01'], col7: ['01'], col8: ['01'], col9: ['01'] },
    { col1: '1234567892', col2: 'SDE-3', col3: '03', col4: ['03'], col5: ['02'], col6: ['01'], col7: ['01'], col8: ['01'], col9: ['01'] },

    // Add more rows as needed
];


const CompanyPanel = () => {
    const [user, setUser] = React.useState(null);
    const [modal, setModal] = React.useState(null);
    const [jobs, setjobs] = React.useState(null);
    const [cjobs, setcjobs] = React.useState(null);
    const [pjobs, setpjobs] = React.useState(null);
    const [jobsCountss, setJobsCountss] = useState(null);
    const [pendingjobs, setpendingjobs] = React.useState(0);
    const [activejobs, setactivejobs] = React.useState(0);
    const [notacceptingjobs, setnotacceptingjobs] = React.useState(0);
    const [closedjobs, setclosedjobs] = React.useState(0);
    const [archivedjobs, setarchivedjobs] = React.useState(0);
    const [credit, setCredit] = React.useState(null);
    const [currentCredit, setCurrentCredit] = React.useState(null);
    const [totaljobs, setTotaljobs] = React.useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 3)));
    const [endDate, setEndDate] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [isoOpen, setIsoOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    // const [stats, setStats] = useState([])
    const [completedInterviewsCount, setCompletedInterviewsCount] = useState(false);
    const [invitedInterviewsCount, setInvitedInterviewsCount] = useState(false);
    const [scheduleInterviewsCount, setScheduleInterviewsCount] = useState(false);
    const [expiredInterviewsCount, setExpiredInterviewsCount] = useState(false);
    const [xiInterviewsCount, setXiInterviewsCount] = useState(false);
    const [isFullTable, setIsFullTable] = useState(false);

    //table1
    // const [jobTitle, setJobTitle] = useState([]);
    const [jobDetails, setJobDetails] = useState([]);
    const [pods, setPods] = useState([]);
    const [jobid, setJobid] = useState(0);
    const [jobRole, setJobRole] = useState(0);
    const [totalCandidates, setTotalCandidates] = useState(0);



    const openInviteModal = () => setIsInviteModalOpen(true);
    const closeInviteModal = () => setIsInviteModalOpen(false);

    function openModal() {
        setIsoOpen(true);
    }

    function closeModal() {
        setIsoOpen(false);
    }

    const suggestions = [
        { label: 'Today', range: [new Date(), new Date()] },
        { label: 'This week', range: [new Date(), new Date()] }, // add week range logic here
        { label: 'Last 7 days', range: [new Date(), new Date()] }, // add last 7 days logic here
        { label: 'This month', range: [new Date(), new Date()] }, // add month range logic here
        { label: 'This year', range: [new Date(), new Date()] }, // add year range logic here
    ];

    // const stats = [
    //   { title: 'Invited', count: 50, color: 'bg-blue-100', colorElement: 'text-blue-500', borderLeft: "border-blue-500", icon: "LoginInvited" },
    //   { title: 'Scheduled', count: 20, color: 'bg-yellow-100', colorElement: 'text-yellow-500', borderLeft: "border-red-100", icon: 'LockScheduled' },
    //   { title: 'Completed', count: 15, color: 'bg-teal-100', colorElement: 'text-teal-600', borderLeft: "border-teal-600", icon: 'TickSquareCompleted' },
    //   { title: 'XI Recommended', count: 20, color: 'bg-green-100', colorElement: 'text-green-500', borderLeft: "border-green-500", icon: 'WorkXIRecommended' },
    //   { title: 'XI Not Recommended', count: 10, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: 'CloseSquareXInotrecommended' },
    //   { title: 'Pending', count: 15, color: 'bg-blue-100', colorElement: 'text-blue-500', borderLeft: "border-blue-500", icon: 'TimeCirclePending' },
    //   { title: 'Invite Expired', count: 10, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: 'Calendar' }
    //   // { title: 'Invite Expired', count: 10, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: '/images/inviteexpired.png' }
    // ];
    const stats = [
        { title: 'Invited', count: invitedInterviewsCount, color: 'bg-blue-100', colorElement: 'text-blue-500', borderLeft: "border-blue-500", icon: "LoginInvited" },
        { title: 'Scheduled', count: scheduleInterviewsCount, color: 'bg-yellow-100', colorElement: 'text-yellow-500', borderLeft: "border-red-100", icon: 'LockScheduled' },
        { title: 'Completed', count: completedInterviewsCount, color: 'bg-teal-100', colorElement: 'text-teal-600', borderLeft: "border-teal-600", icon: 'TickSquareCompleted' },
        { title: 'XI Recommended', count: xiInterviewsCount, color: 'bg-green-100', colorElement: 'text-green-500', borderLeft: "border-green-500", icon: 'WorkXIRecommended' },
        { title: 'XI Not Recommended', count: 0, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: 'CloseSquareXInotrecommended' },
        { title: 'Pending', count: 0, color: 'bg-blue-100', colorElement: 'text-blue-500', borderLeft: "border-blue-500", icon: 'TimeCirclePending' },
        { title: 'Invite Expired', count: expiredInterviewsCount, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: 'Calendar' }
        // { title: 'Invite Expired', count: 10, color: 'bg-red-100', colorElement: 'text-red-500', borderLeft: "border-red-500", icon: '/images/inviteexpired.png' }
    ];
    const toggleCalendar = () => setIsOpen(!isOpen);

    const applySuggestion = (range) => {
        setStartDate(range[0]);
        setEndDate(range[1]);
        setIsOpen(false);
    };

    React.useEffect(() => {
        let user = JSON.parse(getSessionStorage("user"));
        setUser(user);
    }, []);


    React.useEffect(() => {
        const fetchData = async () => {
            let user = JSON.parse(getSessionStorage("user"));
            let jobsCounts = await getJobCount(user._id, { startDate, endDate });
            jobsCounts = jobsCounts?.data?.data;
            setTotaljobs(jobsCounts);
            setactivejobs(jobsCounts?.active);
            setnotacceptingjobs(jobsCounts?.not_accepted);
            setclosedjobs(jobsCounts?.closedJob);
            setarchivedjobs(jobsCounts?.archived);
            setpendingjobs(jobsCounts?.pendingJobs);
            setCompletedInterviewsCount(jobsCounts?.completedInterviewsCount);
            setInvitedInterviewsCount(jobsCounts?.invitedInterviewsCount);
            setScheduleInterviewsCount(jobsCounts?.scheduleInterviewsCount);
            setExpiredInterviewsCount(jobsCounts?.expiredInterviewsCount);
            setXiInterviewsCount(jobsCounts?.xiInterviewsCount);
            setJobRole(jobsCounts?.jobDetails?._id);
            setJobDetails(jobsCounts?.jobDetails)
            setTotalCandidates(jobsCounts?.totalCandidates);
            setPods(jobsCounts?.pods);
            // setInviteInterviews(jobsCounts?.active);
            // setScheduleInterviews(jobsCounts?.active);
            // setFeedbackpendingInterviews(jobsCounts?.active);
            // setXirecomInterviews(jobsCounts?.active);
            let arrPod = []


            jobsCounts?.jobDetails?.map((pod) => {
                if (pod?.pods.length) {
                    arrPod.push(pod)
                }

            })
            setPods(arrPod)
            setJobsCountss(jobsCounts);
        }
        fetchData()
    }, [])

    const fetchData = async () => {
        let user = JSON.parse(getSessionStorage("user"));
        let jobsCounts = await getJobCount(user._id, { startDate, endDate });
        jobsCounts = jobsCounts?.data?.data;
        setTotaljobs(jobsCounts);
        setactivejobs(jobsCounts?.active);
        setnotacceptingjobs(jobsCounts?.not_accepted);
        setclosedjobs(jobsCounts?.closedJob);
        setarchivedjobs(jobsCounts?.archived);
        setpendingjobs(jobsCounts?.pendingJobs);
        setCompletedInterviewsCount(jobsCounts?.completedInterviewsCount);
        setInvitedInterviewsCount(jobsCounts?.invitedInterviewsCount);
        setScheduleInterviewsCount(jobsCounts?.scheduleInterviewsCount);
        setExpiredInterviewsCount(jobsCounts?.expiredInterviewsCount);
        setXiInterviewsCount(jobsCounts?.xiInterviewsCount);
        setJobRole(jobsCounts?.jobDetails?._id);
        setJobDetails(jobsCounts?.jobDetails)
        setTotalCandidates(jobsCounts?.totalCandidates);
        setPods(jobsCounts?.pods);
        // setInviteInterviews(jobsCounts?.active);
        // setScheduleInterviews(jobsCounts?.active);
        // setFeedbackpendingInterviews(jobsCounts?.active);
        // setXirecomInterviews(jobsCounts?.active);
        let arrPod = []


        jobsCounts?.jobDetails?.map((pod) => {
            if (pod?.pods.length) {
                arrPod.push(pod)
            }

        })
        setPods(arrPod)
        setJobsCountss(jobsCounts);

    };
    // ... existing code ...



    React.useEffect(() => {
        const getCredit = async () => {
            //console.log("Checking function");
            let user = JSON.parse(getSessionStorage("user"));
            let res = await getUserCurrentCredit(user._id);
            if (res) {
                setCurrentCredit(res.data.data.credit);
            }
        };
        getCredit();
    }, []);
    const data = React.useMemo(
        () => [
            {
                label: "Series 1",
                data: [
                    [0, 1],
                    [1, 2],
                    [2, 4],
                    [3, 2],
                    [4, 7],
                ],
            },
            {
                label: "Series 2",
                data: [
                    [0, 3],
                    [1, 1],
                    [2, 5],
                    [3, 6],
                    [4, 4],
                ],
            },
        ],
        []
    );

    const axes = React.useMemo(
        () => [
            { primary: true, type: "ordinal", position: "bottom" },
            { type: "ordinal", position: "left" },
        ],
        []
    );

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay(amt) {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await newOrder({
            user_type: user.user_type,
            amount: amt,
            userId: user._id,
        });
        //console.log(result);
        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        //console.log(result.data);

        // Getting the order details back
        const { amount, id: order_id, currency } = result.data.order;
        // let amount = result.data.order.amount
        // let order_id = result.data.order.order_id
        // let currency = result.data.order.currency
        let transactionId = result.data.id;
        //console.log(transactionId);
        const options = {
            key: "rzp_test_6ri9glEbS06F1H", // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Value Matrix",
            description: "Test Transaction",
            image: { logo },
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                //console.log(transactionId);
                const result1 = await PaymentSuccess({
                    data: data,
                    id: transactionId,
                    userId: user._id,
                    credit: credit,
                });
                //console.log(result1);
                //console.log("Swal Check");
                swal({
                    title: "Payment Completed Successfully",
                    message: "Success",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    window.location.reload();
                });
            },
            prefill: {
                name: "Value Matrix",
                email: "vmdeveloper171@gmail.com",
                contact: "9999999999",
            },
            notes: {
                address: "Value Matrix Corporate Office",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setModal(false);
    }

    React.useEffect(() => {
        let user = JSON.parse(getSessionStorage("user"));
        setUser(user);
    }, []);

    return (
        <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
            <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
                <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
                    <div className="flex bg-[#F4F7F8] min-h-screen">
                        <div className="container mx-auto" style={{ height: '100vh', overflowY: 'auto' }}>
                            <div className=" bg-[#F4F7F8]  rounded-lg lg:ml-4 md:ml-4 ml-0 lg:mr-4 md:mr-4 mr-0 my-1">
                                {/* <div className="flex mt-4 pt-4 mx-4"> */}
                                <div className="flex justify-start items-center gap-2">
                                    {/* <p className="text-s flex font-black  pt-4"> */}
                                    <p style={{ fontSize: "36px", lineHeight: "50.4px", color: "rgba(34, 130, 118, 1)" }} className="text-s flex font-normal ">
                                        Hey! {user && user.firstName ? user.firstName : "User"}, {" "}
                                    </p>
                                    {/* <p className="text-gray-400 px-2"> */}
                                    <p style={{ color: "rgba(141, 145, 145, 1)" }} className=" text-2xl font-normal  ">
                                        {" "}
                                        Here's what's happening today!
                                    </p>

                                </div>

                                {/* <div className="lg:hidden md:hidden font-black pt-4  mt-4 mx-4"> */}
                                <div className="lg:hidden md:hidden font-black pt-4  mt-4 mx-4 flex justify-start items-center gap-2">

                                    {/* <p className="inline-block"> Hey! {user && user.firstName ? user.firstName : "User"} -{" "}</p> */}
                                    <p style={{ fontSize: "36px", lineHeight: "50.4px", color: "rgba(34, 130, 118, 1)" }} className="text-s flex font-normal ">
                                        Hey! {user && user.firstName ? user.firstName : "User"}, {" "}
                                    </p>
                                    {/* <p className="text-gray-400  inline-block"> */}
                                    {/* <p style={{ color: "rgba(141, 145, 145, 1)" }} className="text-gray-400 text-2xl font-normal  inline-block"> */}
                                    <p style={{ color: "rgba(141, 145, 145, 1)" }} className=" text-2xl font-normal  ">

                                        {" "}
                                        Here's what's happening today!
                                    </p>
                                </div>
                                <div className={`flex items-center ${isFullTable ? 'justify-between' : 'justify-end'} p-4`}>
                                    {/* Back Button */}
                                    {isFullTable && (
                                        <button
                                            className="flex items-center text-teal-600 hover:text-teal-800"
                                            onClick={() => setIsFullTable(false)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 19.5L8.25 12l7.5-7.5"
                                                />
                                            </svg>
                                            <span className="ml-2">Back</span>
                                        </button>
                                    )}

                                    {/* Search Bar */}
                                    {/* <div className="flex items-center w-1/3">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-teal-400"
                                        />
                                    </div> */}

                                    {/* Date Range Picker */}
                                    <div className="flex gap-8 ">
                                        <div className="relative">
                                            {/* Date Range Input */}
                                            <div className="flex items-center space-x-2 justify-around cursor-pointer border rounded-md bg-white" onClick={toggleCalendar}>
                                                <input
                                                    type="text"
                                                    value={`${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`}
                                                    // className="w-[227px] px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-teal-400"
                                                    className="w-[227px] px-4 py-2 text-sm border-none rounded-md focus:outline-none focus:ring focus:ring-teal-400"
                                                    readOnly
                                                />
                                                <button className="text-gray-500 mr-2">
                                                    <img
                                                        className="rounded-lg "
                                                        src={calendar}
                                                        width="100%"
                                                        alt=""
                                                    />

                                                </button>
                                            </div>

                                            {/* Calendar Popup */}
                                            {isOpen && (
                                                // <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-4 w-80">
                                                <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-4 w-[413px] ">
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium">From</label>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                                    <DatePicker
                                                                        selected={startDate}
                                                                        onChange={(date) => setStartDate(new Date(date))}
                                                                        dateFormat="dd MMM yyyy"
                                                                        // className=" px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring focus:ring-teal-400"
                                                                        // className=" border rounded-md  focus:outline-none focus:ring focus:ring-teal-400 "
                                                                        // slotProps={{ textField: { InputProps: { style: { width: "180px", height: "46px", borderRadius: "8px" } } } }}
                                                                        // sx={{ sx4 }}
                                                                        // sx={{
                                                                        //   width: '100px',
                                                                        //   color: "yellow",
                                                                        //   backgroundColor: "red",
                                                                        //   minWidth: "100px !important",
                                                                        //   fontSize: "10px",
                                                                        //   '& .MuiTextField-root': {
                                                                        //     margin: "100px",
                                                                        //     "min-width": "100px",

                                                                        //   }
                                                                        // }}

                                                                        sx={{
                                                                            minWidth: "100px !important",
                                                                            borderRadius: "8px !important",
                                                                            // '& .MuiTextField-root .Mui-focused fieldset.MuiOutlinedInput-notchedOutline': {
                                                                            '& .MuiOutlinedInput-root': {
                                                                                '& fieldset': {
                                                                                    borderColor: 'rgba(230, 230, 230, 1)',
                                                                                    borderRadius: `14px`,

                                                                                },
                                                                                '&:hover fieldset': {
                                                                                    borderColor: '#228276',
                                                                                },
                                                                                '&.Mui-focused fieldset': {

                                                                                    borderColor: ' rgba(34, 130, 118, 1)',
                                                                                },
                                                                            },
                                                                            '& .MuiTextField-root.Mui-selected': {

                                                                                borderColor: "red",
                                                                                color: "red",
                                                                                backgroundColor: 'red'
                                                                            },
                                                                            input: {
                                                                                color: 'rgba(94, 94, 94, 1)',

                                                                                "&::placeholder": {
                                                                                    // opacity: 1,
                                                                                    fontSize: "14px",
                                                                                    font: "bold",
                                                                                },
                                                                            },
                                                                            label: { color: 'blue' }
                                                                        }}
                                                                    />
                                                                </DemoContainer>
                                                            </LocalizationProvider>
                                                        </div>
                                                        <div>
                                                            <label className="block mb-1 text-sm font-medium">To</label>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DemoContainer components={['DatePicker', 'DatePicker']}>

                                                                    <DatePicker
                                                                        selected={endDate}
                                                                        onChange={(date) => setEndDate(new Date(date))}
                                                                        dateFormat="dd mm yyyy"
                                                                        sx={{
                                                                            minWidth: "100px !important",
                                                                            // borderRadius: "18px !important",
                                                                            InputProps: {
                                                                                sx: { borderRadius: '15px !important', backgroundColor: 'white' }, // Apply the styles here
                                                                            },

                                                                            '& .MuiOutlinedInput-root': {
                                                                                '& fieldset': {
                                                                                    borderColor: 'rgba(230, 230, 230, 1)',
                                                                                    borderRadius: `14px`,

                                                                                },

                                                                                '&:hover fieldset': {
                                                                                    borderColor: '#228276',
                                                                                },
                                                                                '&.Mui-focused fieldset': {

                                                                                    borderColor: ' rgba(34, 130, 118, 1)',
                                                                                },
                                                                            },
                                                                            input: {
                                                                                color: 'rgba(94, 94, 94, 1)',


                                                                                "&::placeholder": {    // <----- Add this.
                                                                                    // opacity: 1,
                                                                                    fontSize: "14px",
                                                                                    font: "SF Pro Text",
                                                                                },
                                                                            },
                                                                            label: { color: 'blue' }
                                                                        }}
                                                                    />


                                                                </DemoContainer>
                                                            </LocalizationProvider>


                                                        </div>
                                                    </div>

                                                    {/* Apply/Cancel Buttons */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <button
                                                            className="px-4 py-2 text-teal-600 border border-teal-600 rounded-md hover:bg-gray-100"
                                                            onClick={async () => {

                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700"
                                                            onClick={async () => {
                                                                if (!startDate || !endDate) {
                                                                    alert("Please select both start date and end date.");
                                                                    return;
                                                                }
                                                                await fetchData();
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>

                                                    {/* Suggestions */}
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-medium text-teal-600">Suggestions</h4>
                                                        {suggestions.map((suggestion, index) => (
                                                            <button
                                                                key={index}
                                                                className="block w-full px-4 py-2 mb-2 text-left text-sm bg-gray-100 rounded-md hover:bg-gray-200"
                                                                onClick={() => applySuggestion(suggestion.range)}
                                                            >
                                                                {suggestion.label}: {suggestion.range[0].toLocaleDateString()} -{' '}
                                                                {suggestion.range[1].toLocaleDateString()}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Export Button */}
                                        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                                            onClick={openModal}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5 mr-2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 3v12m0 0L8.25 9.75M12 15l3.75-3.75M9 9h6"
                                                />
                                            </svg>
                                            Export
                                        </button>
                                    </div>
                                </div>


                                <div className="p-4 bg-white">
                                    <div className="flex justify-between">
                                        <h2 className="text-2xl font-semibold mb-4">Candidate Interview Statistics</h2>
                                        {!isFullTable && (
                                            <h2
                                                className="text-md mb-4 cursor-pointer"
                                                onClick={() => setIsFullTable(true)}
                                            >
                                                View All
                                            </h2>
                                        )}
                                    </div>

                                    <p className="text-gray-500 mb-4">Last 30 days</p>
                                    {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> */}
                                    {/* <div className="flex flex-wrap gap-4"> */}
                                    <div className="flex flex-wrap gap-4">
                                        {stats.map((stat, index) => (
                                            <StatisticsCard
                                                key={index}
                                                title={stat.title}
                                                count={stat.count}
                                                color={stat.color}
                                                colorElement={stat.colorElement}
                                                borderLeft={stat.borderLeft}
                                                icon={stat.icon}
                                                isLastCard={index === stats.length - 1}
                                                onViewDetails={openInviteModal}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {modal && (
                                    <Transition
                                        appear
                                        show={modal}
                                        as={Fragment}
                                        className="relative z-1050 w-full"
                                        style={{ zIndex: 1000 }}
                                    >
                                        <Dialog
                                            as="div"
                                            className="relative z-1050 w-5/6"
                                            onClose={() => { }}
                                            static={true}
                                        >
                                            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                                            </Transition.Child>

                                            <div className="fixed inset-0 overflow-y-auto ">
                                                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                                                    <Transition.Child
                                                        as={Fragment}
                                                        enter="ease-out duration-300"
                                                        enterFrom="opacity-0 scale-95"
                                                        enterTo="opacity-100 scale-100"
                                                        leave="ease-in duration-200"
                                                        leaveFrom="opacity-100 scale-100"
                                                        leaveTo="opacity-0 scale-95"
                                                    >
                                                        <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                                            <div className={`${!modal ? "hidden" : "block"}`}>
                                                                <div className="w-full">
                                                                    <div className="w-full my-5">
                                                                        <img src={logo} width="100" />
                                                                        <h3 className="my-5">
                                                                            Enter the number of credit you want to purchase
                                                                        </h3>
                                                                        <input
                                                                            id="amount"
                                                                            name="amount"
                                                                            className="block border border-gray-200 my-4 py-1 px-3 w-full"
                                                                            onChange={async (event) => {
                                                                                //console.log(event.target.value);
                                                                                setCredit(event.target.value);
                                                                            }}
                                                                        ></input>
                                                                        <div className="" style={{ display: "flex" }}>
                                                                            <button
                                                                                className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                                                                style={{ backgroundColor: "#034488" }}
                                                                                onClick={() => {
                                                                                    displayRazorpay(credit);
                                                                                }}
                                                                            >
                                                                                Buy
                                                                            </button>
                                                                            <button
                                                                                className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                                                                style={{ backgroundColor: "#034488" }}
                                                                                onClick={() => {
                                                                                    setModal(false);
                                                                                }}
                                                                            >
                                                                                Close
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Dialog.Panel>
                                                    </Transition.Child>
                                                </div>
                                            </div>
                                        </Dialog>
                                    </Transition>
                                )}

                                {!isFullTable && (<div className="rounded-lg py-1 mb-4 bg-white h-[350px]  ">
                                    <div className="rounded-lg  w-[100%] overflow-hidden h-[370px]">
                                        {/* <JobTable data={tabledata} type={"candidate"} /> */}
                                        <JobTable data={jobDetails} type={"candidate"} height={"half"} />
                                    </div>
                                </div>)}

                                {isFullTable && (<div className="rounded-lg py-1 mb-4 bg-white h-[450px]  ">
                                    <div className="rounded-lg  w-[100%] overflow-hidden h-[470px]">

                                        <JobTable data={jobDetails} type={"candidate"} height={"full"} />
                                    </div>
                                </div>)}

                                {!isFullTable && (<div className="flex justify-between gap-6 w-full">

                                    <div className="flex flex-col my-4 space-y-4 w-[35%]">
                                        <div className="rounded-lg h-[50%] bg-white ">
                                            <CognitiveGames jobdata={totaljobs} type={"candidate"} />
                                        </div>

                                        <div className="rounded-lg  h-[50%]  bg-white ">
                                            <CandidateTestStats jobdata={totaljobs} user={"candidate"} />
                                        </div>

                                    </div>
                                    <div className="rounded-lg  my-4 bg-white w-[39%] ">
                                        <JobNotificationChart jobdata={totaljobs} />
                                    </div>


                                    <div className="rounded-lg  my-4  bg-white w-[27%] ">
                                        <JobPostingsmain />
                                    </div>

                                </div>)}



                            </div>
                        </div>
                        <ExportReportModal
                            isOpen={isoOpen}
                            closeModal={closeModal}
                            jobsData={{
                                activeJobs: jobsCountss?.active,
                                notAcceptingJobs: jobsCountss?.not_accepted,
                                closedJobs: jobsCountss?.closedJob,
                                archivedJobs: jobsCountss?.archived,
                                pendingJobs: jobsCountss?.pendingJobs,
                                completedInterviewsCount: jobsCountss?.completedInterviewsCount,
                                invitedInterviewsCount: jobsCountss?.invitedInterviewsCount,
                                scheduleInterviewsCount: jobsCountss?.scheduleInterviewsCount,
                                expiredInterviewsCount: jobsCountss?.expiredInterviewsCount,
                                xiInterviewsCount: jobsCountss?.xiInterviewsCount,
                                jobRole: jobsCountss?.jobDetails?._id,
                                jobDetails: jobsCountss?.jobDetails,
                                totalCandidates: jobsCountss?.totalCandidates,
                                pods: jobsCountss?.pods,
                            }} />
                        <InviteListModal isOpen={isInviteModalOpen} closeModal={closeInviteModal} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPanel;
