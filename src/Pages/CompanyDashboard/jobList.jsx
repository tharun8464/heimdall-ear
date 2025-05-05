import ls from "localstorage-slim";
import { CSVLink } from "react-csv";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BarLoader } from "react-spinners";
import "../../assets/stylesheet/pagination.css";
import { BsFillBookmarkFill } from "react-icons/bs";
import { IoMdDownload } from "react-icons/io";
import { FilterCompany, listJobWithStatus } from "../../service/api.js";
import { MdOutlineWorkOutline } from "react-icons/md";
import { getStorage, setSessionStorage, getSessionStorage, removeSessionStorage } from "../../service/storageService";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listActiveJobwithPagination, listArchievedJobWithPagination, listClosedJobsWithPagination, listNonacceptingJobWithPagination, getJobCount } from "../../service/api.js";
import CSVDownloadButton from "../../Components/Dashbaord/CSVDownloadButton.jsx";

//Full page handled by Amal *Reach out to me for any queries.

const JobList = () => {
  const [notacceptingjob, setnotacceptingjob] = React.useState([]);
  const [closedjoblist, setclosedjoblist] = React.useState([]);
  const [Archived, setarchivedjob] = React.useState([]);
  const [activejob, setActivejob] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState("Active");
  const [loader, setLoader] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [jobs, setJobs] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [csvLoading, setCsvLoading] = React.useState(false);
  const [fullCSVList, setFullCSVList] = React.useState([]);
  //jobs count
  const [activejobs, setActiveJobs] = useState(0);
  const [closedjobs, setClosedJobs] = useState(0);
  const [archivedjobs, setArchivedJobs] = useState(0);
  const [totalPage, setTotalPage] = React.useState(0);
  const [notacceptingjobs, setNotAcceptingJobs] = useState(0);
  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    { label: "createTime", key: "createTime" },
    { label: "uploadedBy", key: "uploadBy" },
    { label: "location", key: "location" },
    { label: "job_type", key: "jobType" },
    { label: "applicants", key: "applicants" },
    { label: "valid_till", key: "validTill" },
    { label: "hiring_organization", key: "hiringOrganization" },
    { label: "basic_salary", key: "basicSalary" },
  ];

  const Tabs = ["Active", "Not Accepting", "Closed", "Archived"];

  const paginate_activejob = async p => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let c_id = JSON.parse(getSessionStorage("user"));
      const data = await listActiveJobwithPagination(c_id._id, p);
      const Job = data.data.active_Job.data;
      setActivejob(Job);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const paginate_notacceptingjob = async p => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let c_id = JSON.parse(getSessionStorage("user"));
      const data = await listNonacceptingJobWithPagination(c_id._id, p);
      const Notaccepting = data.data.not_accepted_Job.data;
      setnotacceptingjob(Notaccepting);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const paginate_closedjoblist = async p => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let c_id = JSON.parse(getSessionStorage("user"));
      const data = await listClosedJobsWithPagination(c_id._id, p);
      const closedJobs = data.data.closed_Job.data;
      setclosedjoblist(closedJobs);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const paginate_Archived = async p => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let c_id = JSON.parse(getSessionStorage("user"));
      const data = await listArchievedJobWithPagination(c_id._id, p);
      const archivedJobs = data.data.archive_Job.data;
      setarchivedjob(archivedJobs);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const handleTabClick = async (tab) => {
    if (tab === activeTab) {
      return
    }
    setFullCSVList([]);
    setPage(1)
    setActiveTab(tab);
    let c_id = JSON.parse(getSessionStorage("user"));
    if (tab === "Active") {
      let activeRes = await listActiveJobwithPagination(c_id._id, 1)
      const Job = activeRes?.data?.active_Job?.data;
      setActivejob(Job);
    }
    if (tab === "Not Accepting") {
      let nonAcceptRes = await listNonacceptingJobWithPagination(c_id._id, 1)
      const nonActiveJob = nonAcceptRes?.data?.not_accepted_Job?.data
      setnotacceptingjob(nonActiveJob)
    }
    if (tab === "Closed") {
      let closedRes = await listClosedJobsWithPagination(c_id._id, 1)
      const closedJob = closedRes?.data?.closed_Job?.data
      setclosedjoblist(closedJob)
    }
    if (tab === "Archived") {
      let archRes = await listArchievedJobWithPagination(c_id._id, 1)
      const archJob = archRes?.data?.archive_Job?.data
      setarchivedjob(archJob)
    }
  };

  const handleDownload = async (event, done) => {
    setFullCSVList([]);
    setCsvLoading(true);
    let c_id = JSON.parse(getSessionStorage("user"));
    listJobWithStatus(c_id._id, activeTab)
      .then(res => {
        setCsvLoading(false);
        const csvData = res.data.jobs;
        setFullCSVList(csvData);
      })
      .catch(err => {
        setCsvLoading(false);
        // console.log("no response", err);
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      let c_id = JSON.parse(getSessionStorage("user"));
      let res = await listActiveJobwithPagination(c_id._id, page);
      setLoader(true);
      if (res && res.data) {
        setLoader(false);
        // setJobs(res.data.jobData);
        // setTotalPage(res.data.totalPages);
        const Job = res.data.active_Job.data;
        setActivejob(Job);
        // const Notaccepting = res.data.not_accepted_Job.data;
        // setnotacceptingjob(Notaccepting);
        // const closedJobs = res.data.closed_Job.data;
        // setclosedjoblist(closedJobs);
        // const archivedJobs = res.data.archive_Job.data;
        // setarchivedjob(archivedJobs);
        // let arr = [...res.data.jobData];
        // const jsonObj = JSON.stringify(arr);
        // setSessionStorage("jobsdetails", jsonObj);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      let user = JSON.parse(getSessionStorage("user"));
      setUser(user);
      let jobsCounts = await getJobCount(user._id);
      jobsCounts = jobsCounts?.data?.data;

      setActiveJobs(jobsCounts?.active);
      setNotAcceptingJobs(jobsCounts?.not_accepted);
      setClosedJobs(jobsCounts?.closedJob);
      setArchivedJobs(jobsCounts?.archived);
    };
    fetchData(); // Call fetchData once on mount
  }, []);

  return (
    <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
      <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
        <div className="flex mx-5 mt-3 justify-between">
          {/* <div className="text-sm flex my-5 mx-5 font-semibold space-x-1"> */}
          <div className="text-sm flex my-5 mx-36 font-semibold space-x-1">
            <span>Hey {user && user.firstName ? user.firstName : "Company"} -</span>
            <span className="text-gray-400">here's what's happening today!</span>
          </div>
        </div>
        <div className="min-h-screen p-4 w-full md:flex mx-auto">
          {/* <div className=" md:w-3/4 md:mx-5"> */}
          <div className=" md:w-3/4 md: ml-36 mr-5">
            <>
              <div className="py-2 flex bg-slate-100 gap-8">
                {Tabs.map((tab, index) => {
                  return (
                    <p
                      key={index}
                      className={`flex items-center text-gray-900 ml-3 font-bold cursor-pointer ${activeTab === tab ? "border-b-4 border-green-500" : ""
                        }`}
                      onClick={() => handleTabClick(tab)}>
                      <MdOutlineWorkOutline
                        className={`mr-1 ${activeTab === tab ? "text-green-500" : ""}`}
                      />
                      <span className="ml-1">{`${tab} Jobs`}</span>
                    </p>
                  );
                })}
                <hr />
              </div>

              <>
                <div className="">
                  {activeTab === "Active" && (
                    <>
                      {loader ? (
                        <>
                          <div className="flex justify-between w-full bg-white">
                            <div
                              className="py-4 px-5"
                              style={{ borderRadius: "6px 6px 0 0" }}>
                              <p className="text-gray-900 w-full font-bold">Active Jobs</p>
                            </div>
                          </div>
                          <div
                            className="mt-0"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                            <BarLoader color="#228276" height={3} width={"100%"} />
                          </div>
                        </>
                      ) : (
                        <div className=" w-full bg-white">
                          <div className="flex justify-between items-center w-full bg-white py-4 px-5">
                            <div className="text-gray-900 font-bold">Active Jobs</div>
                            <CSVDownloadButton
                              pageData={activejob}
                              fullCsvList={fullCSVList}
                              csvLoading={csvLoading}
                              handleDownload={handleDownload}
                              header={headerso}
                              filename="active-jobs"
                            />
                          </div>
                          {activejob &&
                            activejob.map((job, index) => {
                              return <JobCard job={job} index={index} />;
                            })}
                          {activejob && activejobs === 0 && (
                            <p className="text-center font-semibold my-5">No Active Jobs</p>
                          )}
                          {activejobs > 0 && (
                            <div className="w-full">
                              <div className="flex justify-between my-2 mx-1">
                                {Math.ceil(activejobs / 5) ? (
                                  <div className="flex items-center">
                                    <span className="text-gray-600">Page</span>
                                    <div className="flex mx-2">
                                      {page > 1 && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-blue-500"
                                          onClick={() => {
                                            paginate_activejob(page - 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &lt;
                                        </span>
                                      )}
                                      {page > 6 && (
                                        <>
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-blue-500`}
                                            onClick={() => {
                                              paginate_activejob(1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}>
                                            1
                                          </span>
                                          <span className="mx-1 text-gray-600">...</span>
                                        </>
                                      )}
                                      {Array.from(
                                        { length: 5 },
                                        (_, i) => page - 2 + i,
                                      ).map(pageNumber => {
                                        if (
                                          pageNumber > 0 &&
                                          pageNumber <= Math.ceil(activejobs / 5)
                                        ) {
                                          return (
                                            <span
                                              className={`mx-2 cursor-pointer ${pageNumber === page
                                                ? "page_active text-white bg-green-600"
                                                : "hover:text-blue-500"
                                                }`}
                                              key={pageNumber}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                backgroundColor:
                                                  pageNumber === page
                                                    ? "#34D399"
                                                    : "transparent",
                                              }}
                                              onClick={() => {
                                                paginate_activejob(pageNumber);
                                              }}>
                                              {pageNumber}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                      {page < Math.ceil(activejobs / 5) - 5 && (
                                        <span className="mx-1 text-gray-600">...</span>
                                      )}
                                      {page < Math.ceil(activejobs / 5) - 4 && (
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-green-500`}
                                          onClick={() => {
                                            paginate_activejob(Math.ceil(activejobs / 5));
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          {Math.ceil(activejobs / 5)}
                                        </span>
                                      )}
                                      {page < Math.ceil(activejobs / 5) && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-green-500"
                                          onClick={() => {
                                            paginate_activejob(page + 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &gt;
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-600">
                                      of {Math.ceil(activejobs / 5)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "Not Accepting" && (
                    <>
                      {loader ? (
                        <>
                          <div className="flex justify-between w-full bg-white">
                            <div
                              className="py-4 px-5"
                              style={{ borderRadius: "6px 6px 0 0" }}>
                              <p className="text-gray-900 w-full font-bold">
                                Not Accepting
                              </p>
                            </div>
                          </div>
                          <div
                            className="mt-0"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                            <BarLoader color="#228276" height={3} width={"100%"} />
                          </div>
                        </>
                      ) : (
                        <div className="w-full bg-white">
                          <div className="flex justify-between items-center w-full bg-white py-4 px-5">
                            <div className="text-gray-900 font-bold">Not Accepting</div>
                            <CSVDownloadButton
                              pageData={notacceptingjob}
                              fullCsvList={fullCSVList}
                              csvLoading={csvLoading}
                              handleDownload={handleDownload}
                              header={headerso}
                              filename="not-accepting-jobs"
                            />
                          </div>
                          {notacceptingjob &&
                            notacceptingjob.map((job, index) => {
                              return <JobCard job={job} index={index} />;
                            })}
                          {notacceptingjob && notacceptingjobs === 0 && (
                            <p className="text-center font-semibold my-5">No Job to show</p>
                          )}
                          {notacceptingjob?.length > 0 && (
                            <div className="w-full">
                              <div className="flex justify-between my-2 mx-1">
                                {Math.ceil(notacceptingjobs / 5) ? (
                                  <div className="flex items-center">
                                    <span className="text-gray-600">Page</span>
                                    <div className="flex mx-2">
                                      {page > 1 && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-blue-500"
                                          onClick={() => {
                                            paginate_notacceptingjob(page - 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &lt;
                                        </span>
                                      )}
                                      {page > 6 && (
                                        <>
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-blue-500`}
                                            onClick={() => {
                                              paginate_notacceptingjob(1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}>
                                            1
                                          </span>
                                          <span className="mx-1 text-gray-600">...</span>
                                        </>
                                      )}
                                      {Array.from(
                                        { length: 5 },
                                        (_, i) => page - 2 + i,
                                      ).map(pageNumber => {
                                        if (
                                          pageNumber > 0 &&
                                          pageNumber <= Math.ceil(notacceptingjobs / 5)
                                        ) {
                                          return (
                                            <span
                                              className={`mx-2 cursor-pointer ${pageNumber === page
                                                ? "page_active text-white bg-green-600"
                                                : "hover:text-blue-500"
                                                }`}
                                              key={pageNumber}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                backgroundColor:
                                                  pageNumber === page
                                                    ? "#34D399"
                                                    : "transparent",
                                              }}
                                              onClick={() => {
                                                paginate_notacceptingjob(pageNumber);
                                              }}>
                                              {pageNumber}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                      {page < Math.ceil(notacceptingjobs / 5) - 5 && (
                                        <span className="mx-1 text-gray-600">...</span>
                                      )}
                                      {page < Math.ceil(notacceptingjobs / 5) - 4 && (
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-green-500`}
                                          onClick={() => {
                                            paginate_notacceptingjob(
                                              Math.ceil(notacceptingjobs / 5),
                                            );
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          {Math.ceil(notacceptingjobs / 5)}
                                        </span>
                                      )}
                                      {page < Math.ceil(notacceptingjobs / 5) && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-green-500"
                                          onClick={() => {
                                            paginate_notacceptingjob(page + 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &gt;
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-600">
                                      of {Math.ceil(notacceptingjobs / 5)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "Closed" && (
                    <>
                      {loader ? (
                        <>
                          <div className="flex justify-between w-full bg-white">
                            <div
                              className="py-4 px-5"
                              style={{ borderRadius: "6px 6px 0 0" }}>
                              <p className="text-gray-900 w-full font-bold">Closed Jobs</p>
                            </div>
                          </div>
                          <div
                            className="mt-0"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                            <BarLoader color="#228276" height={3} width={"100%"} />
                          </div>
                        </>
                      ) : (
                        <div className=" w-full bg-white">
                          <div className="flex justify-between items-center w-full bg-white py-4 px-5">
                            <div className="text-gray-900 font-bold">Closed Jobs</div>
                            <CSVDownloadButton
                              pageData={closedjoblist}
                              fullCsvList={fullCSVList}
                              csvLoading={csvLoading}
                              handleDownload={handleDownload}
                              header={headerso}
                              filename="closed-jobs"
                            />
                          </div>
                          {closedjoblist &&
                            closedjoblist.map((job, index) => {
                              return <JobCard job={job} index={index} />;
                            })}
                          {closedjoblist && closedjobs === 0 && (
                            <p className="text-center font-semibold my-5">
                              No Active Closed Jobs
                            </p>
                          )}
                          {closedjoblist?.length > 0 && (
                            <div className="w-full">
                              <div className="flex justify-between my-2 mx-1">
                                {Math.ceil(closedjobs / 5) ? (
                                  <div className="flex items-center">
                                    <span className="text-gray-600">Page</span>
                                    <div className="flex mx-2">
                                      {page > 1 && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-blue-500"
                                          onClick={() => {
                                            paginate_closedjoblist(page - 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &lt;
                                        </span>
                                      )}
                                      {page > 6 && (
                                        <>
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-blue-500`}
                                            onClick={() => {
                                              paginate_closedjoblist(1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}>
                                            1
                                          </span>
                                          <span className="mx-1 text-gray-600">...</span>
                                        </>
                                      )}
                                      {Array.from(
                                        { length: 5 },
                                        (_, i) => page - 2 + i,
                                      ).map(pageNumber => {
                                        if (
                                          pageNumber > 0 &&
                                          pageNumber <= Math.ceil(closedjobs / 5)
                                        ) {
                                          return (
                                            <span
                                              className={`mx-2 cursor-pointer ${pageNumber === page
                                                ? "page_active text-white bg-green-600"
                                                : "hover:text-blue-500"
                                                }`}
                                              key={pageNumber}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                backgroundColor:
                                                  pageNumber === page
                                                    ? "#34D399"
                                                    : "transparent",
                                              }}
                                              onClick={() => {
                                                paginate_closedjoblist(pageNumber);
                                              }}>
                                              {pageNumber}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                      {page < Math.ceil(closedjobs / 5) - 5 && (
                                        <span className="mx-1 text-gray-600">...</span>
                                      )}
                                      {page < Math.ceil(closedjobs / 5) - 4 && (
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-green-500`}
                                          onClick={() => {
                                            paginate_closedjoblist(
                                              Math.ceil(closedjobs / 5),
                                            );
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          {Math.ceil(closedjobs / 5)}
                                        </span>
                                      )}
                                      {page < Math.ceil(closedjobs / 5) && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-green-500"
                                          onClick={() => {
                                            paginate_closedjoblist(page + 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &gt;
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-600">
                                      of {Math.ceil(closedjobs / 5)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                  {activeTab === "Archived" && (
                    <>
                      {loader ? (
                        <>
                          <div className="flex justify-between w-full bg-white">
                            <div
                              className="py-4 px-5"
                              style={{ borderRadius: "6px 6px 0 0" }}>
                              <p className="text-gray-900 w-full font-bold">
                                Archived Jobs
                              </p>
                            </div>
                          </div>
                          <div
                            className="mt-0"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}>
                            <BarLoader color="#228276" height={3} width={"100%"} />
                          </div>
                        </>
                      ) : (
                        <div className=" w-full bg-white">
                          <div className="flex justify-between items-center w-full bg-white py-4 px-5">
                            <div className="text-gray-900 font-bold">Archived Jobs</div>
                            <CSVDownloadButton
                              pageData={archivedjobs}
                              fullCsvList={fullCSVList}
                              csvLoading={csvLoading}
                              handleDownload={handleDownload}
                              header={headerso}
                              filename="archived-jobs"
                            />
                          </div>
                          {Archived &&
                            Archived.map((job, index) => {
                              return <JobCard job={job} index={index} />;
                            })}
                          {Archived && archivedjobs === 0 && (
                            <p className="text-center font-semibold my-5">
                              No Archived Jobs
                            </p>
                          )}
                          {Archived?.length > 0 && (
                            <div className="w-full">
                              <div className="flex justify-between my-2 mx-1">
                                {Math.ceil(archivedjobs / 5) ? (
                                  <div className="flex items-center">
                                    <span className="text-gray-600">Page</span>
                                    <div className="flex mx-2">
                                      {page > 1 && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-blue-500"
                                          onClick={() => {
                                            paginate_Archived(page - 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &lt;
                                        </span>
                                      )}
                                      {page > 6 && (
                                        <>
                                          <span
                                            className={`mx-2 cursor-pointer hover:text-blue-500`}
                                            onClick={() => {
                                              paginate_Archived(1);
                                            }}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              border: "1px solid #34D399", // Border color for the square
                                              backgroundColor: "transparent", // Transparent background
                                            }}>
                                            1
                                          </span>
                                          <span className="mx-1 text-gray-600">...</span>
                                        </>
                                      )}
                                      {Array.from(
                                        { length: 5 },
                                        (_, i) => page - 2 + i,
                                      ).map(pageNumber => {
                                        if (
                                          pageNumber > 0 &&
                                          pageNumber <= Math.ceil(archivedjobs / 5)
                                        ) {
                                          return (
                                            <span
                                              className={`mx-2 cursor-pointer ${pageNumber === page
                                                ? "page_active text-white bg-green-600"
                                                : "hover:text-blue-500"
                                                }`}
                                              key={pageNumber}
                                              style={{
                                                width: "30px",
                                                height: "30px",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: "4px",
                                                backgroundColor:
                                                  pageNumber === page
                                                    ? "#34D399"
                                                    : "transparent",
                                              }}
                                              onClick={() => {
                                                paginate_Archived(pageNumber);
                                              }}>
                                              {pageNumber}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })}
                                      {page < Math.ceil(archivedjobs / 5) - 5 && (
                                        <span className="mx-1 text-gray-600">...</span>
                                      )}
                                      {page < Math.ceil(archivedjobs / 5) - 4 && (
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-green-500`}
                                          onClick={() => {
                                            paginate_Archived(Math.ceil(archivedjobs / 5));
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          {Math.ceil(archivedjobs / 5)}
                                        </span>
                                      )}
                                      {page < Math.ceil(archivedjobs / 5) && (
                                        <span
                                          className="mx-2 cursor-pointer hover:text-green-500"
                                          onClick={() => {
                                            paginate_Archived(page + 1);
                                          }}
                                          style={{
                                            width: "30px",
                                            height: "30px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "4px",
                                            border: "1px solid #34D399", // Border color for the square
                                            backgroundColor: "transparent", // Transparent background
                                          }}>
                                          &gt;
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-gray-600">
                                      of {Math.ceil(archivedjobs / 5)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            </>
            {/* )} */}
          </div>

          <div className="md:w-1/4">
            <div className="shadow-lg  py-8 mt-12 justify-around  px-5 bg-white">
              <p className="text-xl mx-auto text-gray-700 font-bold  flex">
                <p className="p-1">
                  <BsFillBookmarkFill />
                </p>
                <p className=" mx-2  text-sm ">Posted Jobs</p>
              </p>
              {loader ? (
                <>
                  <div className="flex justify-between my-4 py-4">
                    <p className="font-bold text-xs">Active</p>
                    <p className="text-gray-400 font-semibold text-xs">{activejobs}</p>
                  </div>
                  <div
                    className="mt-0"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <BarLoader color="#228276" height={3} width={"100%"} />
                  </div>
                  <div className="flex justify-between my-4 py-4">
                    <p className="font-bold text-xs">Not Accepting</p>
                    <p className="text-gray-400 font-semibold text-xs">
                      {notacceptingjobs}
                    </p>
                  </div>
                  <div
                    className="mt-0"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <BarLoader color="#228276" height={3} width={"100%"} />
                  </div>
                  <div className="flex justify-between my-4 py-4">
                    <p className="font-bold text-xs">Closed</p>
                    <p className="text-gray-400 font-semibold text-xs">{closedjobs}</p>
                  </div>
                  <div
                    className="mt-0"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <BarLoader color="#228276" height={3} width={"100%"} />
                  </div>
                  <div className="flex justify-between my-4 py-4">
                    <p className="font-bold text-xs">Archived</p>
                    <p className="text-gray-400 font-semibold text-xs">{archivedjobs}</p>
                  </div>
                  <div
                    className="mt-0"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <BarLoader color="#228276" height={3} width={"100%"} />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-gray-600 flex justify-between mt-4 py-4">
                    <p className="font-bold text-xs">Active</p>
                    <p className="text-gray-400 font-semibold text-xs">{activejobs}</p>
                  </div>
                  <div className="mt-10"></div>
                  <div className="border-b border-gray-600 flex justify-between mt-4 py-4">
                    <p className="font-bold text-xs">Not Accepting</p>
                    <p className="text-gray-400 font-semibold text-xs">
                      {notacceptingjobs}
                    </p>
                  </div>
                  <div className="mt-10"></div>
                  <div className="border-b border-gray-600 flex justify-between mt-4 py-4">
                    <p className="font-bold text-xs">Closed</p>
                    <p className="text-gray-400 font-semibold text-xs">{closedjobs}</p>
                  </div>
                  <div className="mt-10"></div>
                  <div className=" border-gray-600 flex justify-between mt-4 pt-4">
                    <p className="font-bold text-xs">Archived</p>
                    <p className="text-gray-400 font-semibold text-xs">{archivedjobs}</p>
                  </div>
                  <div className="mt-10"></div>
                </>
              )}
            </div>
            {/* <SupportTable/> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;

// const applyFilter = async (values) => {
// 	setLoader(true);

// 	let c_id = JSON.parse(getSessionStorage("user"));

// 	const access_token = getStorage("access_token");
// 	let res = await FilterCompany(c_id._id, values);

// 	if (res && res.data) {
// 		let arr = [...res.data.jobs];

// 		setJobs([]);

// 		setLoader(false);
// 		setTimeout(() => {
// 			setJobs(res.data.jobs);
// 		}, 1000);

// 		const jsonObj = JSON.stringify(arr);

// 		setSessionStorage("jobsdetails", jsonObj);
// 	} else {
// 		//console.log("no response");
// 	}
// };
