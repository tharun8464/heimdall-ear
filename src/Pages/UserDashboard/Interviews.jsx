import React, { useEffect, useState } from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import {
  slotDetailsOfUser,
  candidateInterviewDetails,
  updateInterviewApplication,
  updateWallet,
  getFeedBackInvitation,
} from "../../service/api.js";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IosShareIcon from '@mui/icons-material/IosShare';
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Fragment } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import { Oval } from "react-loader-spinner";
import Tabs from "./Tab.jsx"
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import swal from "sweetalert";
import SupportTable from "./SupportTable.jsx";
import moment from 'moment'
import InterviewReport from "./InterviewReport.jsx";
import NewTabs from "./NewTabs.jsx";
import { getSessionStorage } from "../../service/storageService";
const JobList = (props) => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [jobsExist, setjobsExist] = React.useState(false);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [tabs, setTabs] = useState(['Today', 'Upcoming', 'Completed']);
  const [jobAccepted, setjobAccepted] = React.useState(false);
  const [hasReport, setHasReport] = React.useState([[]]);
  const [candidateFeedback, setCandidateFeedback] = React.useState([[]]);
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = useState(null);
  //let token = getStorage("access_token");

  let [totalPages, setTotalPages] = useState(1)

  // For Tabs
  const [tabIndex, setTabIndex] = useState(0);
  const [activeTab, setActiveTab] = React.useState(0);
  const [day, setDay] = React.useState("today")

  React.useEffect(() => {
    const getData = async () => {
      //let user = JSON.parse(getStorage("user"));
      const user = JSON.parse(getSessionStorage("user"));
      setUser(user);
      // let res = await slotDetailsOfUser(user._id);
      let res = await candidateInterviewDetails(
        day,
        page,
        { userId: user?._id },
        user.access_token,
      )
      if (res && res.data) {
        if (res?.data?.totalPages > 1) {
          setTotalPages(res?.data?.totalPages)
        }
        else {
          setTotalPages(1)
        }
        setJobs(res?.data?.sortedData);
        setLoader(false);
        setjobsExist(true);
        let arr = [...res?.data?.sortedData];
        const jsonObj = JSON.stringify(arr);
        // save to localStorage
        //setSessionStorage("jobsdetails", jsonObj);
        //setSessionStorage("jobsdetails", jsonObj);
        let hasReport = new Map([[]]);
        let candidateFeedback = new Map([[]]);
        arr.forEach((value) => {
          if (value?.interviewApplicationId) {
            // hasReport.set(value?.interviewApplication[0]?._id, value?.interviewApplication[0]?.hasReport);
            // candidateFeedback.set(value?.interviewApplication[0]?._id, value?.interviewApplication[0]?.candidateFeedback);
            hasReport.set(value?.interviewApplicationId, value?.hasReport);
            candidateFeedback.set(value?.interviewApplicationId, value?.candidateFeedback);
          }
        });
        setHasReport(hasReport);
        setCandidateFeedback(candidateFeedback);
      } else {
        setjobsExist(false);
        setLoader(false)
      }
    };
    getData();
  }, [day]);


  const paginate = async (p) => {
    if (page === p) {
      return
    }
    setPage(p);
    setLoader(true)
    //let user = JSON.parse(getStorage("user"));
    const user = JSON.parse(getSessionStorage("user"));
    setUser(user);
    // let res = await slotDetailsOfUser(user._id);
    let res = await candidateInterviewDetails(
      day,
      p,
      { userId: user?._id },
      user.access_token,
    )
    if (res && res.data) {
      setJobs(res?.data?.sortedData);
      setLoader(false);
      setjobsExist(true);
      let arr = [...res?.data?.sortedData];
      const jsonObj = JSON.stringify(arr);
      // save to localStorage
      //setSessionStorage("jobsdetails", jsonObj);
      //setSessionStorage("jobsdetails", jsonObj);
      let hasReport = new Map([[]]);
      let candidateFeedback = new Map([[]]);
      arr.forEach((value) => {
        if (value?.interviewApplicationId) {
          // hasReport.set(value?.interviewApplication[0]?._id, value?.interviewApplication[0]?.hasReport);
          // candidateFeedback.set(value?.interviewApplication[0]?._id, value?.interviewApplication[0]?.candidateFeedback);
          hasReport.set(value?.interviewApplicationId, value?.hasReport);
          candidateFeedback.set(value?.interviewApplicationId, value?.candidateFeedback);
        }
      });
      setHasReport(hasReport);
      setCandidateFeedback(candidateFeedback);
    } else {
      setjobsExist(false);
      setLoader(false)
    }
    for (var i = 1; i <= jobs.length; i++) {
      document?.getElementById("intercard" + i)?.classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document?.getElementById("intercard" + ((p - 1) * 5 + j))?.classList.remove("hidden");
    }
  };
  // const showJoinButton = (startDate) => {
  //   const diffVal = moment
  //     .duration(moment(startDate).diff(moment()))
  //     .asMinutes();
  //   return diffVal > -10 && diffVal < 60;
  // };
  const showJoinButton = (startDate) => {
    const diffVal = moment
      .duration(moment(startDate).diff(moment()))
      .asMinutes();
    return diffVal > -10 && diffVal < 30;
  };


  return (
    <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
      <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
        <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
          <div style={{ margin: "0" }} className="border-b-2">
            {/* <Tabs
              setTabIndex={setTabIndex}
              setDay={setDay}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              setLoader={setLoader}
              setPage={setPage}
            /> */}
            <NewTabs
              setIndex={setIndex}
              setDay={setDay}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              setLoader={setLoader}
              setPage={setPage}
              tabs={tabs}
            />
          </div>
          {/* <div className="">
            <div className="px-4 w-full md:flex mx-auto">
              <div className="w-full"> */}

          {loader ? (
            // <p className="text-center font-semibold my-4">...Loading</p>
            <div
              className="mt-40"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Oval />
            </div>
          ) : (
            <>
              {/* <div className="w-full rounded-lg my-4 bg-white outline outline-offset-2 outline-2 outline-slate-200 pb-4"> */}
              {/* <div className="border-b border-gray-200 py-2 pl-3 flex justify-between">
                        <div className="">
                          <p className="text-l text-slate-500">
                            All Interviews
                          </p>

                        </div>
                        <div className="text-xs text-green-600 font-black mt-1 mr-3">

                        </div>
                      </div> */}
              <div className="w-full px-4 bg-white py-1 my-3">
                {jobs &&
                  jobs?.map((job, index) => {
                    if (job.slotType == "SuperXI") {
                      return (
                        // <div
                        //   id={"intercard" + (index + 1)}
                        //   className={
                        //     index < 5
                        //       ? "w-full px-3 bg-white py-1 my-2 border-b "
                        //       : "w-full px-3 bg-white py-1 my-2 border-b hidden"
                        //   }
                        // >
                        <div className="w-full py-1 my-2">
                          <div className="grid grid-cols-7  items-center relative bg-[rgba(34,130,118,0.04)] hover:bg-[rgba(34,130,118,0.1)] hover:border-[rgba(34,130,118,1)] border-[2px] 
            border-gray-300 rounded-lg hover:outline hover:outline-[rgba(34,130,118,0.1)] hover:outline-4">
                            <div className="px-4 my-1 text-md col-span-2 space-y-1">
                              <p>
                                Interview with
                                <span className="font-semibold">
                                  {" "}
                                  {job?.xiId}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Upgrade to XI{" "}
                                </span>{" "}
                              </p>
                              {job.interviewApplicationId ? (
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    Interview Id :
                                  </span>
                                  {job.interviewId}
                                </p>
                              ) : null}
                            </div>
                            <div className="px-1 my-2 text-md">
                              <p>
                                <CalendarMonthIcon sx={{ fontSize: 'medium', marginBottom: '2px' }} />{" "}
                                {" "}
                                {new Date(job.startDate).getDate() +
                                  "-" +
                                  (new Date(job.startDate).getMonth() +
                                    1) +
                                  "-" +
                                  new Date(job.startDate).getFullYear()}
                              </p>
                              <p className="text-gray-400 text-sm ml-4">
                                {new Intl.DateTimeFormat("en-US", {
                                  weekday: "long",
                                }).format(new Date(job.startDate))}
                              </p>
                            </div>
                            <div className="px-1 my-2 text-md">
                              <p>
                                <AccessTimeIcon sx={{ fontSize: 'large', marginBottom: '2px' }} />{" "}
                                {new Date(job.startDate).getHours() +
                                  ":" +
                                  new Date(
                                    job.startDate
                                  ).getMinutes()}{" "}
                                -{" "}
                                {new Date(job.endDate).getHours() +
                                  ":" +
                                  new Date(job.endDate).getMinutes()}
                              </p>
                              <p className="text-[rgba(34,130,118,1)] text-xs ml-4">
                                <Moment to={new Date(job.startDate)}>
                                  {new Date()}
                                </Moment>
                              </p>
                            </div>
                            <div className="flex space-x-3 items-center justify-between">
                              <div className="px-5 text-center my-5 text-md">
                                <span className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-medium bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                  <strong>{job?.status}</strong>
                                </span>
                              </div>

                              {new Date(job.endDate) < new Date() ? (
                                <div
                                  className="px-5 text-center my-5 text-md cursor-pointer"
                                  onClick={async () => { }}
                                >
                                  <span className="text-xs font-medium mr-2 px-6  rounded-3xl my-2 py-2 border-2 border-red-500 text-red-500 cursor-pointer">
                                    Closed
                                  </span>
                                </div>
                              ) : (
                                showJoinButton(job.startDate) && (
                                  <div
                                    className="px-5 text-center my-5 text-md cursor-pointer"
                                    onClick={async () => {

                                    }}
                                  >
                                    <span className="text-xs font-medium mr-2 px-6  rounded-3xl my-2 py-2 border-2 border-black cursor-pointer">
                                      Join
                                    </span>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="text-center my-5 text-md absolute right-6">{/*px-4 mx-2 py-4 align-middle absolute -right-2 top-0 */}
                              <Popover className="relative mt-2">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`${open ? "" : "text-opacity-90"} focus:outline-0`}
                                    >
                                      <span className="flex p-2 bg-white rounded-xl border-2 border-gray hover:border-[rgba(34,130,118,1)]"><BsThreeDotsVertical className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" /></span>
                                    </Popover.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-200"
                                      enterFrom="opacity-0 translate-y-1"
                                      enterTo="opacity-100 translate-y-0"
                                      leave="transition ease-in duration-150"
                                      leaveFrom="opacity-100 translate-y-0"
                                      leaveTo="opacity-0 translate-y-1"
                                    >
                                      <Popover.Panel className="absolute z-10 right-8  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                          <div className="relative gap-8 bg-white px-3 py-2 lg:grid-cols-4  justify-between">
                                            <div className="flex items-center text-gray-800">
                                              <p className="text-sm font-semibold py-1">
                                                <Link
                                                  to={`/user/interviewDetails/${job._id}`}
                                                >

                                                  View Details{" "}
                                                </Link>
                                              </p>{" "}
                                            </div>

                                            <div key={job.interviewId}>
                                              {hasReport.get(job.interviewId) ?
                                                <div className="flex items-center text-gray-800 space-x-2">
                                                  <p className="text-sm font-semibold py-1">
                                                    <Link to={`/user/InterviewReport/${job.interviewId}`} >
                                                      View Feedback
                                                    </Link>
                                                  </p>{" "}
                                                </div>
                                                : <></>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-full py-1 my-2">
                          <div className="grid grid-cols-7 items-center relative bg-[rgba(34,130,118,0.04)] 
      hover:bg-[rgba(34,130,118,0.1)] hover:border-[rgba(34,130,118,1)] border-2 border-gray-300 rounded-lg 
      hover:outline hover:outline-[rgba(34,130,118,0.1)] hover:outline-4 px-4 py-2">

                            {/* Job Details */}
                            <div className="col-span-2">
                              {job ? (
                                <div className="space-y-1">
                                  <p>
                                    <span className="font-semibold">Job: </span> {job?.jobTitle}
                                  </p>
                                  <p className="text-xs text-emerald-800">
                                    <span className="font-semibold">Interview Id: </span> {job.interviewId}
                                  </p>
                                </div>
                              ) : (
                                <div>Interview Scheduled</div>
                              )}
                            </div>

                            {/* Date */}
                            <div className="flex flex-col items-start px-2">
                              <p>
                                <CalendarMonthIcon sx={{ fontSize: 'medium', marginBottom: '2px' }} />{" "}
                                {new Date(job.startDate).toLocaleDateString("en-GB")}
                              </p>
                              <p className="text-gray-400 text-sm ml-4">
                                {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(job.startDate))}
                              </p>
                            </div>

                            {/* Time */}
                            <div className="flex flex-col items-start">
                              <p>
                                <AccessTimeIcon sx={{ fontSize: 'large', marginBottom: '2px' }} />{" "}
                                {new Date(job.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                                {new Date(job.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <p className="text-[rgba(34,130,118,1)] text-xs ml-4">
                                <Moment to={new Date(job.startDate)}>{new Date()}</Moment>
                              </p>
                            </div>

                            {/* Status */}
                            <div className="text-center">
                              {job?.interviewState === 0 ? (
                                <span className="btn rounded-3xl shadow-sm px-4 py-2 text-xs text-[rgba(34,130,118,1)] 
             bg-[rgba(34,130,118,0.1)] border-2 border-[rgba(34,130,118,1)]">
                                  <strong>{job?.status}</strong>
                                </span>
                              ) : job?.interviewState === 1 ? (
                                <span className="bg-green-400 text-gray-800 text-xs font-medium px-3 rounded-3xl py-2 border-2 border-green-600">
                                  <strong>Ongoing</strong>
                                </span>
                              ) : (
                                <span className="bg-red-400 text-gray-800 text-xs font-medium px-3 rounded-3xl py-2 border-2 border-red-600">
                                  <strong>{job?.interviewState === 2 ? "Ended" : "No Show"}</strong>
                                </span>
                              )}
                            </div>

                            {/* Join/Completed Button */}
                            <div className="text-center">
                              {job.status === "Accepted" && new Date(job.endDate) > new Date() ? (
                                showJoinButton(job.startDate) && (job?.interviewState === 0 || job?.interviewState === 1) ? (
                                  <Link to={`/interview/${job?.interviewId}`}>
                                    <span className="text-xs font-medium px-6 rounded-3xl py-2 border-2 border-black">
                                      Join
                                    </span>
                                  </Link>
                                ) : (
                                  <span className="text-xs font-medium px-6 rounded-3xl py-2 border-2 border-gray-300">
                                    Waiting
                                  </span>
                                )
                              ) : (
                                <span className="text-xs font-medium px-6 rounded-3xl py-2 text-xs text-[rgba(34,130,118,1)] border-2 border-[rgba(34,130,118,1)]">
                                  Completed
                                </span>
                              )}
                            </div>

                            {/* More Options */}
                            <div className="text-center">
                              <Popover className="relative">
                                {({ open }) => (
                                  <>
                                    <Popover.Button className="focus:outline-none">
                                      <span className="flex p-2 bg-white rounded-xl border-2 border-gray-300 hover:border-[rgba(34,130,118,1)]">
                                        <BsThreeDotsVertical className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
                                      </span>
                                    </Popover.Button>
                                    <Transition
                                      as={Fragment}
                                      enter="transition ease-out duration-200"
                                      enterFrom="opacity-0 translate-y-1"
                                      enterTo="opacity-100 translate-y-0"
                                      leave="transition ease-in duration-150"
                                      leaveFrom="opacity-100 translate-y-0"
                                      leaveTo="opacity-0 translate-y-1"
                                    >
                                      <Popover.Panel className="absolute z-10 right-8 max-w-sm px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                          <div className="relative gap-8 bg-white px-3 py-2 lg:grid-cols-4 justify-between">
                                            <div className="flex items-center text-gray-800">
                                              <p className="text-sm font-semibold py-1">
                                                <Link to={`/user/interviewDetails/${job._id}`}>
                                                  View Details{" "}
                                                </Link>
                                              </p>
                                            </div>
                                            {hasReport.get(job.interviewId) && (
                                              <div className="flex items-center text-gray-800 space-x-2">
                                                <p className="text-sm font-semibold py-2">
                                                  <a href={`/user/InterviewReport/${job.interviewId}`}>
                                                    View Xi Feedback
                                                  </a>
                                                </p>
                                              </div>
                                            )}
                                            {job?.interviewId && candidateFeedback?.get(job?.interviewId) === undefined && (
                                              <div className="flex items-center text-gray-800 space-x-2">
                                                <p className="text-sm font-semibold py-2">
                                                  <a href={`/user/submitfeedback/${job?.interviewId}`}>
                                                    Feedback
                                                  </a>
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div>
                          </div>
                        </div>

                      );
                    }
                  })}

                {profile && <InterviewReport profile={profile} />}

                {jobs && jobs.length === 0 && loader === false && (
                  <p className="text-center font-semibold my-5">
                    No Interviews Scheduled
                  </p>
                )}
              </div>
              {jobs?.length > 0 && (
                <div className="w-full">
                  <div className="flex justify-center items-center my-4">
                    <button
                      className={`px-3 py-1 mx-2 ${page === 1 ? "bg-[rgba(34,130,118,0.1)]" : "bg-[rgba(34,130,118,1)] text-white"} rounded disabled:opacity-50`}
                      disabled={page === 1}
                      onClick={() => paginate(page - 1)}
                    >
                      Prev
                    </button>
                    <div>
                      {Array.from({ length: Math.min(5, totalPages - (Math.ceil(page / 5) - 1) * 5) }, (_, index) => {
                        const currentPage = index + 1 + Math.floor((page - 1) / 5) * 5;
                        return (
                          <span
                            key={currentPage}
                            className={`mx-2 px-2 p-1 rounded-full ${page === currentPage ? "bg-[rgba(34,130,118,1)] text-white" : "bg-[rgba(34,130,118,0.1)] hover:bg-[rgba(34,130,118,0.4)] cursor-pointer"
                              }`}
                            onClick={() => paginate(currentPage)}
                          >
                            {currentPage}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      className={`px-3 py-1 mx-2 ${page === totalPages ? "bg-[rgba(34,130,118,0.1)]" : "bg-[rgba(34,130,118,1)] text-white"}  rounded disabled:opacity-50`}
                      disabled={page === totalPages}
                      onClick={() => paginate(page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {/* </div> */}
            </>
          )}
        </div>
      </div>
    </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default JobList;
