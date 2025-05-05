import React, { useEffect, useState } from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import {
  listXIEvaluationInterview,
  sendCalendarInvite,
  updateInterviewApplication,
  verifyInterviewOTPEmail,
} from "../../service/api.js";
import { Popover, Transition, Dialog } from "@headlessui/react";
import InterviewListCard from "../../Components/XIDashboard/InterviewListCard.jsx";
import {
  slotDetailsOfXI,
  updateContactOTP,
  updateSlot,
  sendInterviewOTPEmail,
} from "../../service/api.js";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link, Navigate, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { Fragment } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from "moment";
import "moment-timezone";
import { getSessionStorage } from "../../service/storageService.js";
import { Oval } from "react-loader-spinner";
import NewTabs from "../UserDashboard/NewTabs.jsx";
import IosShareIcon from '@mui/icons-material/IosShare';
const MatchedInterviews = () => {
  const [day, setDay] = React.useState("today")
  const [jobLength, setJobLength] = React.useState(null)
  const [activeTab, setActiveTab] = useState(0);
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);

  const [interviewed, setinterviewed] = React.useState(0);
  const [accepted, setaccepted] = React.useState(0);
  const [pending, setpending] = React.useState(0);

  const [user, setUser] = React.useState(null);
  const [sendOTP, setsendOTP] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [interviewId, setInterviewId] = React.useState(null);
  const [interviewers, setInterviewers] = React.useState([]);

  const [index, setIndex] = useState(0);
  const [curJobs, setCurjobs] = useState([]);

  const [page, setPage] = useState(1);

  // Total Pages
  const [pages, setTotalPages] = useState(1)
  const [tabs, setTabs] = useState(['Today', 'Upcoming', 'Completed']);
  const getNewDate = (curDate) => {
    const date = new Date(curDate)
    const utcDatetime = moment.utc(curDate);

    const userDatetime = new Date(utcDatetime.toLocaleString([], { timeZone: 'auto' }));

    return userDatetime;
  };

  const paginate = async (p) => {
    if (page === p) {
      return
    }
    setPage(p);
    setLoader(true)
    let res = await listXIEvaluationInterview(
      day,
      p,
      { user_id: user._id },
      user.access_token,
    );
    if (res && res.data) {
      setJobs(res?.data?.sortedData);
      setTotalPages(res?.data?.totalPages)
      // setPage(res?.data?.currentPage)
      setLoader(false);
      let arr = [...res?.data?.sortedData];
      const jsonObj = JSON.stringify(arr);

      // save to localStorage
      //setSessionStorage("jobsdetails", jsonObj);

      let interviewedval = 0;
      let acceptedval = 0;
      let pendingval = 0;

      for (let i = 0; i < res?.data?.sortedData?.length; i++) {
        if (res?.data?.sortedData[i]?.status == "Interviewed") {
          interviewedval += 1;
        }
        if (res?.data?.sortedData[i]?.status == "Accepted") {
          acceptedval += 1;
        }
        if (res?.data?.sortedData[i]?.status == "Pending") {
          pendingval += 1;
        }
      }
      setinterviewed(interviewedval);
      setaccepted(acceptedval);
      setpending(pendingval);
    }
  };

  const selectTab = () => {

    // var tempJobs=[];
    if (index === 0) {
      // const tempJobs = filterAndSortDataToday();
      const tempJobs = jobs;

      setCurjobs(tempJobs);
    } else if (index === 1) {
      const tempJobs = jobs;
      // const tempJobs = filterAndSortDataUpcoming();
      setCurjobs(tempJobs);
    } else {
      const tempJobs = jobs;
      // const tempJobs = filterAndSortDataPast();
      setCurjobs(tempJobs);
    }
  };

  useEffect(() => {
    selectTab();
    // setPage(1);
    // setPage(page);
    // console.log(index)

  }, [index, jobs, curJobs, day, page]);

  const getAmOrPm = (hours) => {
    if (hours >= 12) return "PM";

    return "AM";
  };



  const [otp, setotp] = React.useState(null);
  const [smsOTP, setsmsOTP] = React.useState("");
  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  };

  useEffect(() => {
    const getData = async () => {
      //let user = JSON.parse(getStorage("user"));
      let user = await JSON.parse(getSessionStorage("user"));
      setUser(user);
      let res = await listXIEvaluationInterview(
        day,
        page,
        { user_id: user?._id },
        user.access_token,
      );
      if (res && res.data) {
        setJobs(res?.data?.sortedData);
        setTotalPages(res?.data?.totalPages)
        setJobLength(res?.data?.len)
        setLoader(false);
        let arr = [...res?.data?.sortedData];
        const jsonObj = JSON.stringify(arr);

        let interviewedval = 0;
        let acceptedval = 0;
        let pendingval = 0;

        for (let i = 0; i < res?.data?.sortedData?.length; i++) {
          if (res?.data?.sortedData[i]?.status == "Interviewed") {
            interviewedval += 1;
          }
          if (res?.data?.sortedData[i]?.status == "Accepted") {
            acceptedval += 1;
          }
          if (res?.data?.sortedData[i]?.status == "Pending") {
            pendingval += 1;
          }
        }
        setinterviewed(interviewedval);
        setaccepted(acceptedval);
        setpending(pendingval);
      }
    };
    getData();
  }, [day]);

  const showJoinButton = (startDate) => {
    const diffVal = moment
      .duration(moment(startDate).diff(moment()))
      .asMinutes();
    return diffVal > -10 && diffVal < 15;
  };

  return (
    <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
      <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
        <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
          <div style={{ margin: "0" }} className="border-b-2">
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
          {/* <div
        className="flex mx-4 mt-20"
        style={{ justifyContent: "space-between", marginLeft: "2.9rem !important" }}
      >
        
        <p className="text-sm flex my-4 mx-4 font-semibold">
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div> */}

          {/* <div className="w-full md:flex mx-4">
        <div className=" md:w-3/4 md:mx-5"> */}
          {loader ? (

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
              {/* <div className="flex w-full bg-white">
                <div
                  className="py-4 px-1"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Interviews</p>                  
                </div>               
              </div> */}
              {otpModal && (
                <Transition
                  appear
                  show={otpModal}
                  as={Fragment}
                  className="relative z-10 w-full"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10 w-5/6 "
                    onClose={() => { }}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
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
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white pt-1 text-left align-middle  transition-all h-[30vh]">
                            <p>
                              Please enter the code sent to{" "}
                              <b> {user.email} </b>{" "}
                            </p>
                            <input
                              type="number"
                              name="smsOTP"
                              onChange={handleOTP}
                              placeholder="Enter code"
                              className="w-full"
                              style={{
                                borderRadius: "12px",
                                marginTop: "10px",
                              }}
                            ></input>
                            <div className="flex my-3">
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={async () => {
                                  if (smsOTP && otp) {
                                    let respOtp = await verifyInterviewOTPEmail(otp?.otpId, smsOTP)
                                    if (respOtp?.data?.success === true) {
                                      let res = await updateSlot(slotId, {
                                        status: "Accepted",
                                      });
                                      let update =
                                        await updateInterviewApplication(
                                          interviewId,
                                          { status: "Accepted" }
                                        );
                                      swal({
                                        title: "Job Accepted Successfully !",
                                        message: "Success",
                                        icon: "success",
                                        button: "Continue",
                                      }).then((result) => {
                                        if (update) {
                                          // Send calendar ics files to XI and Candidate
                                          sendCalendarInvite(interviewId);
                                        }
                                        // handleJobInvitation(invitation, true);
                                        setotpModal(false);
                                        // window.location.reload();
                                      });
                                    }
                                    else {
                                      swal({
                                        title: "Invalid OTP !",
                                        message: "Error",
                                        icon: "error",
                                        button: "Continue",
                                      });
                                    }
                                  }
                                  else {
                                    swal({
                                      title: "Please Enter OTP !",
                                      message: "Error",
                                      icon: "error",
                                      button: "Continue",
                                    });
                                  }
                                }}
                              >
                                Submit
                              </button>
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={async () => {
                                  let resend = await sendInterviewOTPEmail({
                                    userId: user._id,
                                  });
                                  setotp(resend);
                                }}
                              >
                                Resend Code{" "}
                              </button>

                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {
                                  setotpModal(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>

                            <div>
                              <i>
                                Please do check your spam folder in case you
                                don't see the code in your inbox
                              </i>
                              <h2 className="mx-auto w-fit">
                                <i>
                                  If the email mentioned above is wrong or you
                                  have not received any code after mutiple
                                  resend, please contact us at{" "}
                                  <b> support@valuematrix.ai </b>
                                </i>
                              </h2>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
              <div className="w-full px-4 bg-white py-1 my-3">
                {curJobs &&
                  curJobs?.map((job) => {
                    if (job)
                      return (
                        <div className="w-full py-1 my-2">
                          <div className="grid grid-cols-6  items-center relative bg-[rgba(34,130,118,0.04)] hover:bg-[rgba(34,130,118,0.1)] hover:border-[rgba(34,130,118,1)] border-[2px] 
            border-gray-300 rounded-lg hover:outline hover:outline-[rgba(34,130,118,0.1)] hover:outline-4">
                            <div className="px-4 my-1 text-md col-span-2 space-y-1">
                              <p>
                                Interview with
                                <span className="font-semibold">
                                  {" "}
                                  {job?.firstName == "undefined" ? "Candidate" : job?.firstName}{" "}
                                  {job?.lastname == "undefined" ? "" : job?.lastname}
                                </span>
                              </p>
                              <p>

                                <span className="font-semibold">Job Title : </span>{" "}
                                {job && job?.jobTitle}
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  Interview Id :
                                </span>
                                {/* {job._id} */}
                                {job?.interviewID}
                              </p>
                            </div>
                            <div className="px-1 my-2 text-md">
                              <p>
                                <CalendarMonthIcon sx={{ fontSize: 'medium', marginBottom: '2px' }} />{" "}
                                {new Date(
                                  getNewDate(job?.startDate)
                                ).getDate() +
                                  "-" +
                                  (new Date(
                                    getNewDate(job?.startDate)
                                  ).getMonth() +
                                    1) +
                                  "-" +
                                  new Date(
                                    getNewDate(job?.startDate)
                                  ).getFullYear()}
                              </p>
                              <p className="text-gray-400 text-sm ml-4">
                                {new Intl.DateTimeFormat("en-US", {
                                  weekday: "long",
                                }).format(new Date(getNewDate(job?.startDate)))}
                              </p>
                            </div>
                            <div className="px-1 my-2 text-md">

                              <p>
                                <AccessTimeIcon sx={{ fontSize: 'large', marginBottom: '2px' }} />{" "}
                                {(new Date(getNewDate(job?.startDate)).getHours() %
                                  12 || 12) +
                                  ":" +
                                  new Date(
                                    getNewDate(job?.startDate)
                                  ).getMinutes() +
                                  getAmOrPm(
                                    new Date(getNewDate(job?.startDate)).getHours()
                                  )}{" "}
                                -{" "}
                                {(new Date(getNewDate(job?.endDate)).getHours() %
                                  12 || 12) +
                                  ":" +
                                  new Date(getNewDate(job?.endDate)).getMinutes() +
                                  getAmOrPm(
                                    new Date(getNewDate(job?.endDate)).getHours()
                                  )}
                              </p>
                              <p className="text-[rgba(34,130,118,1)] text-xs ml-4">
                                {moment(
                                  new Date(getNewDate(job?.startDate))
                                ).fromNow()}
                              </p>
                            </div>
                            <div className="flex space-x-3 items-center justify-between">
                              <div className=" text-center my-5 text-md">
                                {(() => {
                                  if (job.interviewState === 0) {
                                    return (
                                      <span className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-semibold bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                        <strong>{job?.status}</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 1) {
                                    return (
                                      <span className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-semibold bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                        <strong>Ongoing</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 2) {
                                    return (
                                      <span className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-semibold bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                        <strong>Ended</strong>
                                      </span>
                                    );
                                  } else if (job.interviewState === 3) {
                                    return (
                                      <span className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-semibold bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                        <strong>No show</strong>
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div>
                                          <span class="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs text-[rgba(34,130,118,1)] font-semibold bg-[rgba(34,130,118,0.1)] border-[2px] border-[rgba(34,130,118,1)] mr-3">
                                            <strong>Completed</strong>
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>
                              {job?.status === "Interviewed" && (
                                <div className="px-5 text-center my-5 text-md">
                                  <Link
                                    to={`/XI/updateEvaluationDetails/${job?.interviewID}`}
                                  >
                                    <span className="text-xs font-medium  px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                      Evaluate
                                    </span>
                                  </Link>
                                  {/* <Link to={`/XI/evaluationreport`}>
                                <span className="text-xs font-medium mr-4 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                  Update
                                </span></Link> */}
                                </div>
                              )}
                              {job?.status === "Pending" && (
                                <button
                                  // style={{ background: "#3ED3C5" }}
                                  onClick={async () => {
                                    setotpModal(true);
                                    let resend = await sendInterviewOTPEmail({
                                      userId: user._id,
                                    });
                                    setotp(resend);
                                    setslotId(job?.slotId);
                                    setInterviewId(job?.interviewID)
                                    setInterviewers(job?.interviewers);
                                  }}
                                  className="btn rounded-3xl shadow-sm px-4 my-3 py-2 text-xs font-semibold bg-[rgba(34,130,118,1)] text-white"
                                >
                                  Confirm
                                </button>
                              )}
                              {job?.status === "Accepted" &&
                                showJoinButton(job?.startDate) &&
                                (job.interviewState === 0 ||
                                  job.interviewState === 1) && (
                                  <Link to={`/interviewer/${job?.interviewID}`}>
                                    <button
                                      style={{ background: "#3ED3C5" }}
                                      onClick={async () => { }}
                                      className="btn mx-7  rounded-3xl shadow-sm px-6 my-3 py-2 text-xs text-gray-900 font-semibold"
                                    >
                                      Join{" "}
                                    </button>
                                  </Link>
                                )}
                            </div>

                            <div className="text-center my-5 text-md absolute right-6">{/* mx-2 align-middle absolute right-2 */}
                              <Popover className="relative mt-2">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`
                  ${open ? "" : "text-opacity-90"} focus:outline-0`}
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
                                                <IosShareIcon sx={{ fontSize: 'large', marginBottom: '4px', marginLeft: '4px' }} />
                                                Withdraw{" "}
                                              </p>{" "}
                                            </div>

                                            {(() => {
                                              if (job.interviewState === 2) {
                                                return (
                                                  <div className="flex items-center text-gray-800 space-x-2">
                                                    <p className="text-sm font-semibold py-1">
                                                      <Link
                                                        to={`/XI/updateEvaluationDetails/${job?.interviewID}`}
                                                      >
                                                        Feedback
                                                      </Link>
                                                    </p>
                                                  </div>
                                                );
                                              } else if (
                                                job.interviewState === 4
                                              ) {
                                                return (
                                                  <div className="flex items-center text-gray-800 space-x-2">
                                                    <p className="text-sm font-semibold py-1">
                                                      <Link
                                                        to={`/XI/CPrintAbleXI/${job?.interviewID}`}
                                                      >
                                                        View Feedback
                                                      </Link>
                                                    </p>
                                                  </div>
                                                );
                                              }
                                            })()}
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
                  })}

                {curJobs?.length > 0 && (
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
                        {Array.from({ length: Math.min(5, pages - (Math.ceil(page / 5) - 1) * 5) }, (_, index) => {
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
                        className={`px-3 py-1 mx-2 ${page === pages ? "bg-[rgba(34,130,118,0.1)]" : "bg-[rgba(34,130,118,1)] text-white"}  rounded disabled:opacity-50`}
                        disabled={page === pages}
                        onClick={() => paginate(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {curJobs && curJobs.length === 0 && (
                  <p className="text-center font-semibold my-5">
                    {index == 0 ? (
                      <span>No matched interviews today</span>
                    ) : index == 1 ? (
                      <span>No upcoming matched interviews</span>
                    ) : (
                      <span>No completed matched interviews</span>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchedInterviews;
