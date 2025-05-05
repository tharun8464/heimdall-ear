import React, { useState } from "react";
import { listBinjobwithPagination, getJobCount, listBinJobs } from "../../service/api.js";
import JobBinCard from "../../Components/Dashbaord/JobCard.jsx";
import { getStorage, setStorage, setSessionStorage, getSessionStorage, removeSessionStorage } from "../../service/storageService";
import { FilterCompany } from "../../service/api.js";
import { BsFillBookmarkFill } from "react-icons/bs";
import "../../assets/stylesheet/pagination.css";
import { AiOutlinePlus } from "react-icons/ai";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import ls from "localstorage-slim";
import CSVDownloadButton from "../../Components/Dashbaord/CSVDownloadButton.jsx";

//Full page handled by Amal *Reach out to me for any queries.

const JobList = props => {
  const [totalPage, setTotalPage] = React.useState(0);
  const [pendingjobs, setpendingjobs] = React.useState(0);
  const [loader, setLoader] = React.useState(false);
  const [pjobs, setPJobs] = React.useState([]);
  const [user, setUser] = React.useState(JSON.parse(getSessionStorage("user")));
  const [page, setPage] = useState(1);
  const [csvLoading, setCsvLoading] = React.useState(false);
  const [fullCSVList, setFullCSVList] = React.useState([]);
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
  const paginate = async p => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let c_id = JSON.parse(getSessionStorage("user"));
      const data = await listBinjobwithPagination(c_id._id, p);
      setPJobs(data.data.jobData);
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  // below function is not in use

  // const applyFilter = async (values) => {
  //   setLoader(true);
  //   let c_id = JSON.parse(getSessionStorage("user"));
  //   const access_token = getStorage("access_token");
  //   let res = await FilterCompany(c_id._id, values);
  //   if (res && res.data) {
  //     let arr = [...res.data.jobs];
  //     setPJobs([]);
  //     setLoader(false);
  //     setTimeout(() => {
  //       setPJobs(res.data.jobs);
  //     }, 1000);
  //     const jsonObj = JSON.stringify(arr);
  //     // save to localStorage
  //     setSessionStorage("jobsdetails", jsonObj);
  //   } else {
  //   }
  // };
  //still here

  React.useEffect(() => {
    let user = JSON.parse(getSessionStorage("user"));
    setUser(user);
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      let c_id = JSON.parse(getSessionStorage("user"));
      setLoader(true);
      let res = await listBinjobwithPagination(c_id._id, page);
      if (res && res.data.jobData) {
        setPJobs(res.data.jobData);
        // setTotalPage(res.data.totalPages);
        let arr = [...res.data.jobData];
        const jsonObj = JSON.stringify(arr);
        setSessionStorage("jobsdetails", jsonObj);
      }
      let jobsCounts = await getJobCount(c_id._id);
      jobsCounts = jobsCounts?.data?.data;
      setpendingjobs(jobsCounts?.pendingJobs);
      setLoader(false);
    };
    getData();
  }, []);

  const handleCSVDownload = () => {
    setFullCSVList([]);
    setCsvLoading(true);
    listBinJobs(user._id)
      .then(res => {
        setCsvLoading(false);
        const csvData = res.data.jobs;
        //console.log(csvData);
        setFullCSVList(csvData);
      })
      .catch(err => {
        setCsvLoading(false);
        // console.log("no response", err);
      });
  };

  return (
    <div className="container mx-auto bg-slate-50 p-4 customMobileCss">
      <div className="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
        <div className="bg-slate-100 p-4">
          <div className="flex mb-4 p-0 mt-0" style={{ justifyContent: "space-between" }}>
            <p className="text-sm flex m-0 font-semibold">
              Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
              <p className="text-gray-400 px-2"> here's what's happening today!</p>
            </p>
            <CSVDownloadButton
              fullCsvList={fullCSVList}
              csvLoading={csvLoading}
              header={headerso}
              filename={"pending-job"}
              handleDownload={handleCSVDownload}
            />
          </div>
          <div className="">
            {/* <div className=" md:w-3/4 md:mx-5"> */}
            {/* <div className="p-0">
              {loader ? (
                <>
                  <div className="flex justify-between w-full bg-white ">
                    <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}>
                      <p className="text-gray-900 w-full font-bold">Pending Jobs</p>
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
                <div>
                  <div className="flex justify-between w-full bg-white ">
                    <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}>
                      <p className="text-gray-900 w-full font-bold">Pending Jobs</p>
                    </div>
                    <div className="w-[5vw] py-4 ml-auto mr-3 px-6">
                      <Link to="/company/jobsAdd">
                        <button
                          className=" hover:bg-blue-700 rounded-lg text-white p-3"
                          style={{ backgroundColor: "#228276" }}>
                          <p className="flex">
                            <AiOutlinePlus />
                          </p>
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="w-full">
                    {pjobs &&
                      pjobs.map((job, index) => {
                        return <JobBinCard job={job} index={index} isPendingJobs={true} />;
                      })}
                  </div>
                  {pjobs && pjobs.length === 0 && (
                    <p className="text-center font-semibold my-5">No Pending Jobs</p>
                  )} */}

            {/* //new code for pagination ! If anyone update the below code don't break the flow   */}
            {/* <div className="w-full">
                    <div className="flex justify-between my-2 mx-1">
                      {Math.ceil(pendingjobs / 5) ? (
                        <div className="flex items-center">
                          <span className="text-gray-600">Page</span>
                          <div className="flex mx-2">
                            {page > 1 && (
                              <span
                                className="mx-2 cursor-pointer hover:text-blue-500"
                                onClick={() => {
                                  paginate(page - 1);
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
                                    paginate(1);
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
                            {Array.from({ length: 5 }, (_, i) => page - 2 + i).map(
                              pageNumber => {
                                if (
                                  pageNumber > 0 &&
                                  pageNumber <= Math.ceil(pendingjobs / 5)
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
                                          pageNumber === page ? "#34D399" : "transparent",
                                      }}
                                      onClick={() => {
                                        paginate(pageNumber);
                                      }}>
                                      {pageNumber}
                                    </span>
                                  );
                                }
                                return null;
                              },
                            )}
                            {page < Math.ceil(pendingjobs / 5) - 5 && (
                              <span className="mx-1 text-gray-600">...</span>
                            )}
                            {page < Math.ceil(pendingjobs / 5) - 4 && (
                              <span
                                className={`mx-2 cursor-pointer hover:text-green-500`}
                                onClick={() => {
                                  paginate(Math.ceil(pendingjobs / 5));
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
                                {Math.ceil(pendingjobs / 5)}
                              </span>
                            )}
                            {page < Math.ceil(pendingjobs / 5) && (
                              <span
                                className="mx-2 cursor-pointer hover:text-green-500"
                                onClick={() => {
                                  paginate(page + 1);
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
                            of {Math.ceil(pendingjobs / 5)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div> */}
            <div className="min-h-screen p-4 w-full md:flex mx-auto">
              {/* <div className=" md:w-3/4 md:mx-5"> */}
              <div className=" md:w-3/4 md:ml-24 mr-5">
                {loader ? (
                  <>
                    <div className="flex justify-between w-full bg-white ">
                      <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}>
                        <p className="text-gray-900 w-full font-bold">Pending Jobs</p>
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
                  <div>
                    <div className="flex justify-between w-full bg-white ">
                      <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}>
                        <p className="text-gray-900 w-full font-bold">Pending Jobs</p>
                      </div>
                      <div className="w-[5vw] py-4 ml-auto mr-3 px-6">
                        <Link to="/company/jobsAdd">
                          <button
                            className=" hover:bg-blue-700 rounded-lg text-white p-3"
                            style={{ backgroundColor: "#228276" }}>
                            <p className="flex">
                              <AiOutlinePlus />
                            </p>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <div className="w-full">
                      {pjobs &&
                        pjobs.map((job, index) => {
                          return <JobBinCard job={job} index={index} isPendingJobs={true} />;
                        })}
                    </div>
                    {pjobs && pjobs.length === 0 && (
                      <p className="text-center font-semibold my-5">No Pending Jobs</p>
                    )}

                    {/* //new code for pagination ! If anyone update the below code don't break the flow   */}
                    <div className="w-full">
                      <div className="flex justify-between my-2 mx-1">
                        {Math.ceil(pendingjobs / 5) ? (
                          <div className="flex items-center">
                            <span className="text-gray-600">Page</span>
                            <div className="flex mx-2">
                              {page > 1 && (
                                <span
                                  className="mx-2 cursor-pointer hover:text-blue-500"
                                  onClick={() => {
                                    paginate(page - 1);
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
                                      paginate(1);
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
                              {Array.from({ length: 5 }, (_, i) => page - 2 + i).map(
                                pageNumber => {
                                  if (
                                    pageNumber > 0 &&
                                    pageNumber <= Math.ceil(pendingjobs / 5)
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
                                            pageNumber === page ? "#34D399" : "transparent",
                                        }}
                                        onClick={() => {
                                          paginate(pageNumber);
                                        }}>
                                        {pageNumber}
                                      </span>
                                    );
                                  }
                                  return null;
                                },
                              )}
                              {page < Math.ceil(pendingjobs / 5) - 5 && (
                                <span className="mx-1 text-gray-600">...</span>
                              )}
                              {page < Math.ceil(pendingjobs / 5) - 4 && (
                                <span
                                  className={`mx-2 cursor-pointer hover:text-green-500`}
                                  onClick={() => {
                                    paginate(Math.ceil(pendingjobs / 5));
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
                                  {Math.ceil(pendingjobs / 5)}
                                </span>
                              )}
                              {page < Math.ceil(pendingjobs / 5) && (
                                <span
                                  className="mx-2 cursor-pointer hover:text-green-500"
                                  onClick={() => {
                                    paginate(page + 1);
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
                              of {Math.ceil(pendingjobs / 5)}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:w-1/4">
                <div className="shadow-lg  py-5  justify-around  px-5 bg-white">
                  <p className="text-xl mx-auto text-gray-700 font-bold  flex">
                    <p className="p-1">
                      <BsFillBookmarkFill />
                    </p>
                    <p className=" mx-2  text-sm ">Jobs</p>
                  </p>
                  {loader ? (
                    <>
                      <div className="flex justify-between my-4 py-4">
                        <p className="font-bold text-xs">Pending Jobs</p>
                        <p className="text-gray-400 font-semibold text-xs">
                          {pendingjobs > 0 ? pendingjobs : 0}
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
                    </>
                  ) : (
                    <div className="border-b border-gray-600 flex justify-between my-4 py-4">
                      <p className="font-bold text-xs">Pending Jobs</p>
                      <p className="text-gray-400 font-semibold text-xs">
                        {pendingjobs > 0 ? pendingjobs : 0}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
