import React from "react";
import {
  approveJob,
  getAllCandidatesOfJob,
  getHighlightedDates,
  getJobById,
  getPanelDetails,
  ListXIPanels,
  updatePanelIdofJob,
} from "../../service/api";
import { ReactSession } from "react-client-session";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineCalendar } from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import { Popover, Transition, Menu, Dialog } from "@headlessui/react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import {
  updateJobAPI,
  getSkills,
  archiveJob,
  approveCd,
  getcandidatesevaluations,
} from "../../service/api";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import swal from "sweetalert";
import { postUpdateCandidateStatus } from "../../service/api";
import ls from "localstorage-slim";
import { getStorage, setStorage, setSessionStorage, getSessionStorage, removeSessionStorage } from "../../service/storageService";
import CandidateInvitationDetails from "./CandidateInvitationTable/CandidateInvitationDetails";
import CandidateInfoTable from "./CandidateInvitationTable/CandidateInfoTable";
function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);

  const [candidates, setCandidates] = React.useState([]);
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [declined, setDeclined] = React.useState([]);
  const [showDeclined, setShowDeclined] = React.useState(false);
  const [invited, setInvited] = React.useState([]);
  const [showInvited, setShowInvited] = React.useState(false);
  const [index, setIndex] = React.useState(props.index);
  const [page, setPage] = useState(1);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [roles, setRoles] = React.useState([]);

  const [user, setUser] = React.useState(null);
  const [toggle, setToggle] = React.useState(true);
  const [choosenStatus, setChoosenStatus] = React.useState("");
  const [choosenId, setChoosenId] = React.useState("");
  const [loading, setLoading] = React.useState(null);
  const [gcaneval, setcaneval] = React.useState(null);

  // Get xi panel details

  const [xiPanels, setXiPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [currentPanel, setCurrentPanel] = useState(null);

  const [xi, setXi] = useState(null)
  const [startTime, setStartTime] = React.useState(new Date());
  const [highlight, setHighlight] = useState([])
  const [xiSlot, setXiSlot] = useState([]);
  const [disableBtn, setDisableBtn] = useState(true)
  const [slotId, setslotId] = React.useState(null);



  React.useEffect(() => {
    const fetchPanels = async () => {
      let res = await ListXIPanels();
      if (res && res.status == 200 && res.data.panels?.length > 0) {
        setXiPanels(res.data.panels);
        //  setSelectedPanel(res.data.panels[0]?._id)
      }
    };
    fetchPanels();
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      let user = JSON.parse(await getSessionStorage("user"));
      await setUser(user);
      let res = await getJobById(job_id, access_token);
      if (res) {
        setJob(res.data.job);
        let jobDetails = res.data.job;
        if (jobDetails.panelId) {
          //console.log("YES");
          let currentPanelDetails = await getPanelDetails({
            panelId: jobDetails.panelId,
          });

          setCurrentPanel(currentPanelDetails.data.panelData);
        } else {
          //console.log("NO");
          setCurrentPanel("No panel ");
        }

        setSessionStorage("jobDetails", JSON.stringify(res.data.job[0]));
        // if (res.data.job[0].archived) {
        //   setToggle(res.data.job[0].archived);
        // }
        let allCandidates = await getAllCandidatesOfJob(res.data.job._id);
        setCandidates(allCandidates.data.candidates);
        // setCandidates(res.data.job.invitations);
        if (res.data.job.invitations?.length != 0) {
          let caneval = await getcandidatesevaluations(job_id, res.data.job.invitations);
          if (caneval) {
            setcaneval(caneval.data.data);
          }
        }
        // setDeclined(res.data.declined);
        // setInvited(res.data.invited);
        let primarySkills = {};
        let roles = new Set([]);
        res.data.job.skills.forEach(skill => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
        setRoles(Array.from(roles));
        Array.from(roles).map(el => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);
      } else {
      }
    };

    getData();
  }, []);
  const archive = async () => {
    let access_token = getStorage("access_token");
    let user = JSON.parse(await getSessionStorage("jobDetails"));

    user.archived = !toggle;
    setSessionStorage("jobDetails", JSON.stringify(user));

    let res = await archiveJob(user);

    if (res) {
      setToggle(!toggle);
      removeSessionStorage("jobDetails");
    }
  };

  const createMarkup = html => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const paginate = p => {
    setPage(p);
    for (var i = 1; i <= candidates?.length; i++) {
      document.getElementById("jobcrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {

      document.getElementById("jobcrd" + ((p - 1) * 5 + j)).classList.remove("hidden");

    }
  };
  const [chooseStatus, setchooseStatus] = React.useState(null);

  const handleCandidateStatusChange = (id, status) => {
    setChoosenStatus(status);
    setChoosenId(id);
  };

  const approveCandidate = async index => {
    let approve = await approveCd(index, job_id, candidates[index]);
    if (approve) {
      window.location.reload();
    }
  };

  const handleCandidateStatusPost = async () => {
    let access_token = getStorage("access_token");
    let user = JSON.parse(getSessionStorage("user"));
    let res = await postUpdateCandidateStatus(
      {
        _id: choosenId,
        status: choosenStatus,
        isCompany: true,
      },
      access_token,
    );
    if (res) {
      swal({
        title: "Candidate Job Status Updated Successfully !",
        message: "Success",
        icon: "success",
        button: "Continue",
      }).then(result => {
        setLoading(false);
        window.location.reload();
      });
    } else {
      swal({
        title: "Error Updating Candidate Job Status !",
        message: "OOPS! Error Occured",
        icon: "Error",
        button: "Ok",
      });
    }
  };

  const updatePanelId = async () => {
    let updateData = {
      jobId: job_id,
      panelId: selectedPanel,
    };
    let res = await updatePanelIdofJob(updateData);
    if (res) {
      swal({
        title: "Panel Updated Successfully !",
        message: "Success",
        icon: "success",
        button: "Continue",
      }).then(result => {
        setLoading(false);
        window.location.reload();
      });
    } else {
      swal({
        title: "Error Updating Panel !",
        message: "OOPS! Error Occured",
        icon: "Error",
        button: "Ok",
      });
    }
  };

  // 

  const showXiSlot = async (id) => {
    let res = await getHighlightedDates({ createdBy: id })
    if (res && res.data) {

      setXiSlot(res.data)
      let dateArrwithSlots = []
      res.data.length > 0 && res.data.map((item) => {
        dateArrwithSlots.push(new Date(item.startDate))
      })
      dateArrwithSlots = [...new Set(dateArrwithSlots)];

      setHighlight(dateArrwithSlots)

    }
  }


  return (
    // <div className="p-5 mx-auto">
    //   <p className="text-2xl font-bold">Job Details</p>
    //   {job && (
    //     <div className="p-2 my-5 space-y-3 w-3/4 text-gray-800">
    //       <p>
    //         <span className="font-semibold">Job Title :</span>{" "}
    //         {/* <span className="capitalize">{job.jobTitle}</span> */}
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Description :</span>{" "}
    //         <span className="capitalize">{job.jobDesc}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Location :</span>{" "}
    //         <span className="capitalize">{job.location}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Type :</span>{" "}
    //         <span className="capitalize">{job.jobType}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Hiring Organization :</span>{" "}
    //         <span className="capitalize">{job.hiringOrganization}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Basic Pay Range :</span>{" "}
    //         <span className="capitalize">{job.basicSalary}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold my-2">Apply By :</span>{" "}
    //         <span className="capitalize">
    //           {new Date(job.validTill).getDate() +
    //             "-" +
    //             new Date(job.validTill).getMonth() +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}
    //         </span>
    //       </p>
    //     </div>
    //   )}
    // </div>
    <div class="container mx-auto bg-slate-50 p-4 customMobileCss">
      <div class="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
        <div className="w-full overflow-hidden">
          {job ? (
            <>
              <Link to="/admin/alljobs" className="text-sm text-blue-500 my-2">Back</Link>
              <div
                className="card my-5 w-full md:p-5 p-2 bg-white "
                style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>
                <p className="text-center text-3xl font-black py-2 mb-3">
                  {job.jobTitle}
                  {"  "} {job.jobType} {"  "}job
                </p>

                <div className="w-full  bg-white border border-b">
                  <div
                    className="grid md:px-9 px-3 grid-cols-1 gap-4 lg:grid-cols-7 sm:grid-cols-4 py-6"
                    style={{ backgroundColor: "#F2F3F5" }}>
                    <div className="col-span-2 flex align-middle justify-between">
                      <div className="">
                        <img
                          src={""}
                          className="h-16 w-16 md:h-20 md:w-20 text-center rounded-full my-3 bg-white border border-gray-700"
                        />
                      </div>
                      <div className="">
                        <h5 className="text-black-900 text-lg font-bold mb-3 ">
                          {job.jobTitle}
                        </h5>
                        <p className="text-sm  text-gray-400 font-semibold">
                          {job.hiringOrganization}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <CgWorkAlt />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {job.jobType}
                        </p>
                      </div>
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <HiOutlineLocationMarker />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <HiOutlineCalendar />
                        </div>

                        <p className="px-2 text-md text-gray-400 font-semibold">
                          {new Date(job.validTill).getDate() +
                            "-" +
                            (new Date(job.validTill).getMonth() + 1) +
                            "-" +
                            new Date(job.validTill).getFullYear()}
                        </p>
                      </div>
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <BsCashStack />
                        </div>
                        {job.salary && job.salary?.length >= 2 && (
                          <p className="px-4 text-md text-gray-400 font-semibold">
                            {job.salary[0].symbol} {job.salary[1]}{" "}
                            {job.salary?.length === 3 && <span>- {job.salary[2]}</span>}
                          </p>
                        )}
                      </div>
                    </div>
                    {job.uploadBy === user._id && (
                      <Popover className="relative mt-1">
                        {({ open }) => (
                          <>
                            <Popover.Button
                              className={`
                               ${open ? "" : "text-opacity-90"} focus:outline-0`}>
                              {/* <div className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10" style={{backgroundColor:"#034488"}}></div> */}

                              <BsThreeDots className="text-gray-700 text-lg mt-5 cursor-pointer hover:text-gray-800" />
                            </Popover.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="opacity-0 translate-y-1"
                              enterTo="opacity-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="opacity-100 translate-y-0"
                              leaveTo="opacity-0 translate-y-1">
                              <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl">
                                <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                  <div className="relative gap-8 bg-white p-2 lg:grid-cols-2 flex justify-between">
                                    <div className="w-[8vw]  text-gray-800 ">
                                      {/* <BsThreeDots className="text-md" /> */}
                                      <p
                                        className="text-sm font-semibold py-1 border-b cursor-pointer"
                                        onClick={() => {
                                          window.location.href = `/company/jobUpdate/${job._id}`;
                                        }}>
                                        Edit
                                      </p>
                                      <p
                                        className="text-sm font-semibold py-1 cursor-pointer"
                                        onClick={() => {
                                          archive();
                                        }}>
                                        {toggle ? "Unarchive" : "Archive"} Job
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Popover.Panel>
                            </Transition>
                          </>
                        )}
                      </Popover>
                    )}
                  </div>
                </div>
                <div className="card-body md:px-7 md:w-4/5">
                  <div className="my-7">
                    <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                      {" "}
                      Job Description :
                    </h5>
                    <h6
                      className="px-4 mb-2 text-md text-gray-500"
                      dangerouslySetInnerHTML={createMarkup(job.jobDesc)}></h6>
                  </div>
                  <div className="my-7">
                    <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                      Eligibility :
                    </h5>
                    <h6
                      className="px-4 mb-2 text-md text-gray-500"
                      dangerouslySetInnerHTML={createMarkup(job.eligibility)}></h6>
                  </div>
                  <div className="my-7">
                    <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                      Skills Required :
                    </h5>
                    {/* {job &&
                  job.skills &&
                  job.skills.map((item) => {
                    return (
                      <span className="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">
                        {item.primarySkill}
                      </span>
                    );
                  })} */}
                    <div className="px-4 ml-5">
                      {roles
                        ? roles.map((item, index) => {
                          return (
                            <div>
                              <p className="font-semibold text-md my-3">{item}</p>
                              {skillsPrimary[item].map(el => (
                                <div>
                                  <p className="text-sm my-2">{el}</p>
                                  <div className="flex flex-wrap">
                                    {job.skills
                                      .filter(
                                        tool =>
                                          tool.role === item && tool.primarySkill === el,
                                      )
                                      .map((item1, index) => (
                                        <p className="bg-blue-100 text-blue-800  text-xs my-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                          {item1.secondarySkill}({item1.proficiency})
                                        </p>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })
                        : "No Skills Required"}
                    </div>
                    <div className=""></div>
                  </div>
                  {job.perks && (
                    <div className="my-7">
                      <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                        Remunerations :
                      </h5>
                      <h6
                        className="px-4 mb-2 text-lg text-gray-500"
                        dangerouslySetInnerHTML={createMarkup(job.perks)}></h6>
                      {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
                    </div>
                  )}

                  <div className="my-7">
                    <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                      Current Panel :
                    </h5>

                    {job.panelId ? (
                      <>
                        <h6 className="px-4 mb-2 text-lg text-gray-500">
                          {xiPanels
                            ? xiPanels.find(x => x._id === job.panelId)?.panel
                            : "NO Panel"}
                        </h6>
                      </>
                    ) : (
                      <>
                        <h6 className="px-4 mb-2 text-lg text-gray-500">No Panel</h6>
                      </>
                    )}
                    <div className="px-4">
                      <select onChange={e => setSelectedPanel(e.target.value)} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#034488] mx-1">
                        {xiPanels &&
                          xiPanels?.length > 0 &&
                          xiPanels.map(panel => (
                            <option value={panel._id}>{panel.panel}</option>
                          ))}
                      </select>
                      <button
                        className="bg-blue-500 rounded text-white px-2 py-2 cursor-pointer mx-1"
                        onClick={() => updatePanelId()}>
                        Update Panel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body md:px-7">
                  {user._id === job.uploadBy && (
                    <div className="my-5 px-3 md:px-9">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-md">
                          Invitations <span className="text-sm">({candidates?.length})</span>
                        </p>
                        {/* {candidates?.length > 0 && showCandidate ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(true)}
                    >
                      Show
                    </p>
                  )} */}
                      </div>

                      {candidates?.length > 0 ? (
                        <CandidateInvitationDetails candidates={candidates} />
                      ) : (null)}

                      {chooseStatus && (
                        <Transition
                          appear
                          show={chooseStatus}
                          as={Fragment}
                          className="relative z-10 w-full "
                          style={{ zIndex: 1000 }}>
                          <Dialog
                            as="div"
                            className="relative z-10 w-5/6 "
                            onClose={() => { }}
                            static={true}>
                            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0">
                              <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto ">
                              <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                                <Transition.Child
                                  as={Fragment}
                                  enter="ease-out duration-300"
                                  enterFrom="opacity-0 scale-95"
                                  enterTo="opacity-100 scale-100"
                                  leave="ease-in duration-200"
                                  leaveFrom="opacity-100 scale-100"
                                  leaveTo="opacity-0 scale-95">
                                  <Dialog.Panel className="w-auto pb-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all">
                                    <div className="rounded-lg bg-white w-full">
                                      <div className="flex items-start space-x-3 	">
                                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                        <div className="py-5 w-full bg-blue-900 flex">
                                          <p className="text-lg mx-5 text-center text-white font-semibold">
                                            Change Status
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-start space-x-3 	">
                                        {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                        <div className="py-5 w-full flex">
                                          <p className="text-lg mx-5 text-center text-black font-semibold">
                                            Do you want to change status
                                          </p>
                                        </div>
                                      </div>

                                      <div className="w-auto mx-auto flex justify-center">
                                        <button
                                          className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                          style={{ backgroundColor: "#034488" }}
                                          onClick={() => {
                                            handleCandidateStatusPost();
                                          }}>
                                          Confirm
                                        </button>
                                        <button
                                          className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                          onClick={() => {
                                            setchooseStatus(false);
                                          }}>
                                          Decline
                                        </button>
                                      </div>
                                    </div>
                                  </Dialog.Panel>
                                </Transition.Child>
                              </div>
                            </div>
                          </Dialog>
                        </Transition>
                      )}
                      <div className={candidates?.length > 5 ? "w-full" : "hidden"}>
                        <div className="flex justify-between my-2 mx-1">
                          <div>
                            Page {page} of {Math.ceil(candidates?.length / 5)}
                          </div>
                          <div>
                            {" "}
                            {candidates &&
                              candidates.map((job, index) => {
                                return index % 5 == 0 ? (
                                  <span
                                    className="mx-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      paginate(index / 5 + 1);
                                    }}>
                                    {index / 5 + 1}
                                  </span>
                                ) : null;
                              })}
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center justify-between my-5">
                  <p className="font-bold text-md">
                    Invitations
                    <span className="text-sm"> ({invited?.length})</span>
                  </p>
                  {/* {invited?.length > 0 && showInvited ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(true)}
                    >
                      Show
                    </p>
                  )} 
                </div> */}
                    </div>
                  )}
                  {user.isAdmin === true && (
                    <>
                      {job.status === "Pending" ? (
                        <>
                          <div className="flex my-5 px-3 w-full justify-center">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl py-2 px-4"
                              onClick={async () => {
                                let res1 = await approveJob({
                                  _id: job._id,
                                });
                                if (res1) {
                                  swal({
                                    icon: "success",
                                    title: "Job Approved Successfully",
                                    button: "Continue",
                                  }).then(() => {
                                    window.location.reload();
                                  });
                                  //  let res = await unapprovedJobsList();

                                  //  if (res && res.data) {
                                  //    setJobs(res.data);
                                  //    let arr = [...res.data];
                                  //    const jsonObj = JSON.stringify(arr);

                                  // }
                                }
                              }}>
                              Approve Job
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="my-5 px-3 md:px-9">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-md">
                                Invitations{" "}
                                <span className="text-sm">({candidates?.length})</span>
                              </p>
                              {/* {candidates?.length > 0 && showCandidate ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(true)}
                    >
                      Show
                    </p>
                  )} */}
                            </div>
                            {
                              candidates?.length > 0 ? (
                                <CandidateInfoTable candidates={candidates} currentPanelXi={currentPanel?.xi} xi={xi} setXi={setXi} startTime={startTime} setStartTime={setStartTime} highlight={highlight} showXiSlot={showXiSlot}
                                  setDisableBtn={setDisableBtn}
                                  xiSlot={xiSlot}
                                  setXiSlot={setXiSlot}
                                  slotId={slotId}
                                  setslotId={setslotId}
                                  job_id={job_id}
                                />
                              ) : (null)
                            }

                            {chooseStatus && (
                              <Transition
                                appear
                                show={chooseStatus}
                                as={Fragment}
                                className="relative z-10 w-full "
                                style={{ zIndex: 1000 }}>
                                <Dialog
                                  as="div"
                                  className="relative z-10 w-5/6 "
                                  onClose={() => { }}
                                  static={true}>
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
                                    leaveTo="opacity-0">
                                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                                  </Transition.Child>

                                  <div className="fixed inset-0 overflow-y-auto ">
                                    <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                                      <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95">
                                        <Dialog.Panel className="w-auto pb-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all">
                                          <div className="rounded-lg bg-white w-full">
                                            <div className="flex items-start space-x-3 	">
                                              {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                              <div className="py-5 w-full bg-blue-900 flex">
                                                <p className="text-lg mx-5 text-center text-white font-semibold">
                                                  Change Status
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex items-start space-x-3 	">
                                              {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                                              <div className="py-5 w-full flex">
                                                <p className="text-lg mx-5 text-center text-black font-semibold">
                                                  Do you want to change status
                                                </p>
                                              </div>
                                            </div>

                                            <div className="w-auto mx-auto flex justify-center">
                                              <button
                                                className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                                style={{ backgroundColor: "#034488" }}
                                                onClick={() => {
                                                  handleCandidateStatusPost();
                                                }}>
                                                Confirm
                                              </button>
                                              <button
                                                className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                                                onClick={() => {
                                                  setchooseStatus(false);
                                                }}>
                                                Decline
                                              </button>
                                            </div>
                                          </div>
                                        </Dialog.Panel>
                                      </Transition.Child>
                                    </div>
                                  </div>
                                </Dialog>
                              </Transition>
                            )}
                            {/* <div className={candidates?.length > 5 ? "w-full" : "hidden"}>
                          <div className="flex justify-between my-2 mx-1">
                            <div>
                              Page {page} of {Math.ceil(candidates?.length / 5)}
                            </div>
                            <div>
                              {" "}
                              {candidates &&
                                candidates.map((job, index) => {
                                  return index % 5 == 0 ? (
                                    <span
                                      className="mx-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        paginate(index / 5 + 1);
                                      }}>
                                      {index / 5 + 1}
                                    </span>
                                  ) : null;
                                })}
                            </div>
                          </div>
                        </div> */}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default JobDetails;
