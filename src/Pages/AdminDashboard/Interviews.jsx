import React, { useState, Fragment, useEffect } from "react";
import moment from "moment";
import { Dialog, Transition } from "@headlessui/react";
import ReactPlayer from 'react-player';
import { Carousel } from 'react-responsive-carousel';
import { ImCross } from "react-icons/im";
import { ImEnlarge } from "react-icons/im";
import { AiOutlineClose } from "react-icons/ai";
import DoneIcon from '@mui/icons-material/Done';
import DatePicker from "react-datepicker";
import './CalenderStyles/datepicker.scss';
import { FaClock, FaVideo, FaFileAlt } from "react-icons/fa";
import { FcClock } from "react-icons/fc";
import { AiOutlineEye } from "react-icons/ai";
import { Close } from "@material-ui/icons";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import Demo from "../../assets/images/officeavatar.png";
import ReactHlsPlayer from 'react-hls-player';
import ImageCarousel from "react-simply-carousel";
import Swal from "sweetalert2";
import styles from "./Interviews.module.css";
import ls from 'localstorage-slim';
import { getStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getInterviewList, getInterviewsTableData,
  getRecordingsURL, getLiveStreamURLData, sendReminderEmailtoCandidate,
  sendReminderEmailtoXI, getBaseLiningImagesFace, getBaseLiningImagesPerson,
  getBaseLiningImagesEar, getBaseLiningImagesGaze, availableSlotsByJob,
  priorityEngine, updateUserDetails, updateCurrentSlot, matchedXiUsername,
  rescheduleSlot, getHighlightedDates, sendRequestEmailXi, getHighlightedDatesforall, getSecuredAxiosInstance
} from "../../service/api";
import axios from "axios";
import swal from "sweetalert";
import DOMPurify from 'dompurify';
import { validateAndSanitizeURL } from "../../utils/codeSecure";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const InterviewList = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [interviewListByCompany, setInterviewListByCompany] = useState('');
  const [jobTitles, setJobTitles] = useState([]);
  const [jobInt, setJobInt] = useState('');
  const [editStatus, setEditStatus] = useState('not-edit');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [modal1, setModal1] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [recordingURLS, setRecordingURLS] = useState([]);
  const [liveStreamURLS, setLiveStreamURLS] = useState([]);
  const [fullScreenVideo, setFullScreenVideo] = useState(false);
  const [preinterviewImages, setPreinterviewImages] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [spectate, setSpectate] = useState(false);
  const [candidateSearchInput, setCandidateSearchInput] = useState('');
  const [interviewerSearchInput, setInterviewerSearchInput] = useState('');
  const [matchedXis, setMatchedXis] = useState([])
  const [selectedXi, setSelectedXi] = useState('')
  const [idFlag, setIdFlag] = useState(false);
  const [disableBtn, setDisableBtn] = useState(true)
  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [slot, setSlot] = React.useState([]);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [type, setType] = React.useState("XI");
  const [candidateId, setCandidateId] = useState('')
  const [end, setEnd] = useState('')
  const [xiSlot, setXiSlot] = useState([]);
  const [message, setMessage] = useState('');
  const [interviewState0, setInterviewState0] = useState([]);
  const [interviewState1, setInterviewState1] = useState([]);
  const [interviewState2, setInterviewState2] = useState([]);
  const [interviewState3, setInterviewState3] = useState([]);
  const [interviewState4, setInterviewState4] = useState([]);
  const [activeTab, setActiveTab] = React.useState("On-going");
  const [nodata, setNodata] = React.useState(false);
  const [upcoming, setupcoming] = useState(0);
  const [ongoing, setongoing] = useState(0);
  const [completed, setcompleted] = useState(0);
  const [page, setPage] = React.useState(1);
  const [combinedSearchInput, setCombinedSearchInput] = useState('');
  const [searchInput, setSearchInput] = useState('');



  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const showToast = (message) => {
    const customStyle = {
      fontSize: '12px', // Adjust the font size as needed
    };

    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: customStyle,
    });
  };

  const showError = (message) => {
    //console.log('showToast message:', message);
    const customStyle = {
      fontSize: '12px', // Adjust the font size as needed
    };

    toast.error(message, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: customStyle,
    });
  };

  const getData = async () => {
    let user = JSON.parse(getSessionStorage("user"));
    setUser(user);
    let res = await getInterviewList();
    //console.log("list", res?.data);
    if (res && res.status === 200) {
      setCompanyList(res?.data);
    }
    if (!selectedCompany || selectedCompany == null || selectedCompany == undefined || selectedCompany?.trim() == "") {
      setSelectedCompany(res?.data[0]._id)
      if (res?.data[0].companyImage) {
        setSelectedImage(res?.data[0].companyImage)
      } else {
        setSelectedImage(null);
      }
    }
    // setSelectedCompany(res.data[0]._id)
  };

  useEffect(() => {
    getData();
  }, []);

  const paginate_upcoming = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res.data;
      const upcoming = resData.data.upcoming;
      //console.log("ongoing", upcoming)
      setInterviewState0(upcoming)
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const paginate_ongoing = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res.data;
      const ongoing = resData.data.ongoing;
      //console.log("ongoing", ongoing)
      setInterviewState1(ongoing)
    } catch (error) {
      //console.log("Error:", error);
    }
  };
  const paginate_completed = async (p) => {
    try {
      if (page === p) {
        return;
      }
      setPage(p);
      let data = { companyName: selectedCompany };
      const res = await getInterviewsTableData(data, p);
      let resData = res?.data;
      const completed = resData?.data?.completed;
      //console.log("ongoing", completed)
      setInterviewState4(completed)
    } catch (error) {
      //console.log("Error:", error);
    }
  };

  const getTableData = async (selectedJobTitle, searchInput) => {
    let data = { companyName: selectedCompany };

    let res;
    if (searchInput !== '') {
      res = await getInterviewsTableData(data, page, true);
    } else {
      res = await getInterviewsTableData(data, page);
    }
    let resData = res?.data;
    let count = resData?.counts;
    const upcoming = resData?.data?.upcoming ? resData?.data?.upcoming : [];
    //console.log("upcoming", resData?.data)
    const ongoing = resData?.data?.ongoing ? resData?.data?.ongoing : [];
    const completed = resData?.data?.completed ? resData?.data?.completed : [];
    if (searchInput !== '') {
      setupcoming(0);
      setongoing(0);
      setcompleted(0);
    } else {
      setupcoming(count?.upcoming);
      setongoing(count?.ongoing);
      setcompleted(count?.completed);
    }
    //console.log("before filter")
    let filteredData = [...upcoming, ...ongoing, ...completed];
    //console.log("fil", filteredData)
    if (selectedJobTitle) {
      filteredData = filteredData?.filter(interview =>
        interview.jobTitle === selectedJobTitle
      );
    }

    filteredData = filteredData.sort((a, b) =>
      new Date(a.slots.startDate) - new Date(b.slots.startDate)
    );

    if (searchInput !== '') {
      filteredData = filteredData.filter(item => {
        const candidateName = item.applicant.firstName.toLowerCase();
        const interviewerName = item.interviewers.firstName.toLowerCase();
        const jobName = item.jobTitle.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return candidateName.startsWith(searchValue) || interviewerName.startsWith(searchValue) || jobName.startsWith(searchValue);
      });
    }

    setInterviewListByCompany(filteredData);

    const jobTitlesArr = [];
    filteredData.forEach(interview => {
      if (!jobTitlesArr.includes(interview.jobTitle)) {
        jobTitlesArr.push(interview.jobTitle);
      }
    });
    setJobTitles(jobTitlesArr);
  };


  const handleCompanyNameChange = (companyName) => {
    setSelectedCompany(companyName);
    setSelectedJobTitle('');
    setCandidateSearchInput('');
    setInterviewerSearchInput('');

    const selectedCompanyObj = companyList?.find(company => company._id === companyName);

    // If the selected company object exists and has a companyImage, set it
    if (selectedCompanyObj && selectedCompanyObj.companyImage) {
      setSelectedImage(selectedCompanyObj.companyImage);
    } else {
      // If the selected company doesn't have a companyImage, you can set a default image or null
      setSelectedImage(null); // Or set to a default image URL
    }
  };


  const handleSearchInputChange = (e) => {
    setInterviewerSearchInput(e.target.value);
    setCandidateSearchInput(e.target.value);
  };

  const handleJobTitleChange = (jobTitle) => {
    if (jobTitle !== "Select a job title") {
      setSelectedJobTitle(jobTitle);
    } else {
      setSelectedJobTitle('');
    }
  }

  useEffect(() => {
    getTableData(selectedJobTitle, candidateSearchInput, interviewerSearchInput);
  }, [selectedJobTitle, interviewerSearchInput, selectedCompany, candidateSearchInput]);

  const getBaseLiningImagesData = async (interview) => {
    let data = { id: interview.applications._id };
    const images = [];
    const faceDataResponse = await getBaseLiningImagesFace(data);
    if (faceDataResponse.status === 200) {
      images.push(faceDataResponse.data.image);
    }
    const personDataResponse = await getBaseLiningImagesPerson(data);
    if (personDataResponse.status === 200) {
      images.push(personDataResponse.data.image);
    }
    const earDataResponse = await getBaseLiningImagesEar(data);
    if (earDataResponse.status === 200) {
      images.push(earDataResponse.data.image);
    }
    const gazeDataResponse = await getBaseLiningImagesGaze(data);
    if (gazeDataResponse.status === 200) {
      images.push(gazeDataResponse.data.image);
    }
    setPreinterviewImages(images);
  }

  const handleViewRecordings = async (meetingID, interview) => {
    let access_token = getStorage("access_token");
    let data = { id: meetingID };
    const res = await getRecordingsURL(data, access_token);
    setRecordingURLS(res.data.recordings);
    getBaseLiningImagesData(interview);
  }

  const handleSpectate = async (meetingID) => {
    let access_token = getStorage("access_token");
    let data = { id: meetingID };
    const res = await getLiveStreamURLData(data, access_token);
    setLiveStreamURLS([res.data.data]);
  }

  const handleCandidateReminderEmail = async (interview) => {
    const data = {
      "id": interview.applicant._id,
      "dateTime": `${moment(interview.slots.startDate).format('DD-MM-YYYY HH:mm')}IST`,
      "jobTitle": interview.jobTitle
    }
    const res = await sendReminderEmailtoCandidate(data);
    return res;
  }

  const handleXIReminderEmail = async (interview) => {
    const data = {
      "id": interview.interviewers._id,
      "dateTime": `${moment(interview.slots.startDate).format('DD-MM-YYYY HH:mm')}IST`,
      "jobTitle": interview.jobTitle
    }
    const res = await sendReminderEmailtoXI(data);
    return res;
  }

  const handleXIRequestEmail = async () => {
    if (!message) {
      showError('please enter a mesage');
      return;
    }
    if (idFlag) {

      const data = {
        "id": matchedXis,
        "dateTime": startTime,
        "status": 1,
        "input": message,
        "title": jobInt
      }
      const res = await sendRequestEmailXi(data);

      if (res.status === 200) {
        setMessage("");
        showToast('Availability Request sent');
        handleCloseInputModal();
      } else {
        showError('Error sending request');
      }
    } else {

      const data = {
        "id": selectedXi,
        "dateTime": startTime,
        "status": 2,
        "input": message,
        "title": jobInt
      }
      const res = await sendRequestEmailXi(data);

      if (res.status === 200) {
        showToast('Availability Request sent');
      } else {
        showError('Error sending request');
      }
    }

  }

  const handleReminderEmail = async (interview) => {
    Swal.fire({
      title: "Confirm reminder email",
      html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="checkmark" height="32" style="overflow:visible;enable-background:new 0 0 32 32" viewBox="0 0 32 32" width="32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g id="Error_1_"><g id="Error"><circle cx="16" cy="16" id="BG" r="16" style="fill:white"/><path d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z" id="Exclamatory_x5F_Sign" style="fill:#E6E6E6;"/></g></g></g></svg></div><div class="textDiv">Are you sure you want to send reminder email to interviewer and candidate ?</div></div>',
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true,
      confirmButtonText: "Confirm",
      customClass: {
        popup: 'swal-wide',
        icon: 'icon-class'
      }
    }).then(async (willDelete) => {
      if (willDelete.isConfirmed) {
        const candidateReminderResponse = await handleCandidateReminderEmail(interview);
        const xiReminderResponse = await handleXIReminderEmail(interview);

        if (candidateReminderResponse.status === 200 && xiReminderResponse.status === 200) {
          Swal.fire({
            title: "Send Reminder",
            html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Reminder email has been send to interviewer and candidate.</div></div>',
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: "Ok",
            customClass: {
              popup: 'swal-wide',
              icon: 'icon-class'
            }
          }).then(() => {
          })
        }
      }
    });
  }

  const handleReschedule = () => {

  }

  const scheduleSlot = async () => {
    let start = new Date(startTime);
    let updateData = {
      slotId: chooseSlot?.slots?._id,
      startDate: slotId?.startDate,
      endDate: slotId?.endDate,
      createdBy: selectedXi,
      status: "Pending",
      candidateMail: candidateId
    }

    let res = await rescheduleSlot(updateData);

    if (res && res.status === 200) {
      getTableData(selectedJobTitle, candidateSearchInput, interviewerSearchInput);
      showToast('Interview Rescheduled');
      setConfirmModal(false);
      setModal1(false);
      // Swal.fire({
      //   title: "Update Slots",
      //   html: '<div class="containerd"><div><?xml version="1.0" ?><svg class="success-icon" style="width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 947.2c-240.64 0-435.2-194.56-435.2-435.2S271.36 76.8 512 76.8s435.2 194.56 435.2 435.2-194.56 435.2-435.2 435.2z m266.24-578.56c0 10.24-5.12 20.48-10.24 25.6l-286.72 286.72c-5.12 5.12-15.36 10.24-25.6 10.24s-20.48-5.12-25.6-10.24l-163.84-163.84c-15.36-5.12-20.48-15.36-20.48-25.6 0-20.48 15.36-40.96 40.96-40.96 10.24 5.12 20.48 10.24 25.6 15.36l138.24 138.24 261.12-261.12c5.12-5.12 15.36-10.24 25.6-10.24 20.48-5.12 40.96 15.36 40.96 35.84z" fill="#6BC839" /></svg></div><div class="textDiv">Slot Updated Succesfully.</div></div>',
      //   showConfirmButton: true,
      //   showCloseButton: true,
      //   confirmButtonText: "Continue",
      //   customClass: {
      //     popup: 'swal-wide',
      //     icon: 'icon-class'
      //   }
      // }).then(() => {
      //   window.location.href = "/admin/interviews";
      // });
    } else {
      showError('Error Recheduling');
      setConfirmModal(false);

    }
  }


  const [highlight, setHighlight] = useState([])

  const highlightDates = () => {
    var today = new Date();
    var datesArray = [];
    for (var i = 0; i < 30; i++) {
      var currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      datesArray.push(currentDate);
    }

    let dateArrwithSlots = []
    xiSlot.length > 0 && xiSlot.map((item) => {
      dateArrwithSlots.push(new Date(item.startDate))
    })
    dateArrwithSlots = [...new Set(dateArrwithSlots)];

    // setHighlight(dateArrwithSlots)
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value); // Update message state with the value from the textarea
  };


  const handleActionsOnHover = async (meetingID, value, interview) => {
    setCandidateId(interview?.applicant)
    setJobInt(interview?.jobTitle)
    let xis = await matchedXiUsername(interview._id)
    const selectedXi = interview.interviewers.firstName
    let selectedXIId = interview.interviewers._id
    const xiArray = xis.data

    setchooseSlot(interview)

    xiArray.sort((a, b) => {
      if (a._id === selectedXIId) {
        return -1;
      } else if (b._id === selectedXIId) {
        return 1;
      }
      return 0;
    });

    setMatchedXis(xiArray)
    if (xiArray.length == 1) {
      showXiSlot(xiArray[0]?._id);
      setSelectedXi(xiArray[0]?._id);

    }
    highlightDates()

    switch (value) {
      case 0:
        handleReminderEmail(interview);
        break;
      case 1:
        setModal2(true);
        handleSpectate(meetingID);
        setSpectate(true);
        break;
      case 2:
        setModal2(true);
        handleViewRecordings(meetingID, interview);
        break;
      case 3:
        setModal1(true);
        setIdFlag(true);
        showXiSlotForAll();
        handleReschedule(meetingID);
        break;
      case 4:
        setModal2(true);
        handleViewRecordings(meetingID, interview);
        break;
      case "Reschedule":
        setModal1(true);
        setIdFlag(true);
        showXiSlotForAll();
        handleReschedule(meetingID);
        break;
    }
    let slots = await availableSlotsByJob({
      jobId: interview._id
    });
    const key = "startDate";

    const arrayUniqueByKey = [...new Map(slots.data.map((item) => [item[key], item])).values(),];
    setSlot(arrayUniqueByKey);
  }

  const handleRequestAvailability = () => {
    setShowInputModal(true);
  };

  const handleConfrimReschedule = () => {
    setConfirmModal(true);
  };

  const handleCloseInputModal = () => {
    setShowInputModal(false);
    setConfirmModal(false);
  };

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

  const showXiSlotForAll = async () => {
    let res = await getHighlightedDatesforall({ createdBy: matchedXis })
    if (res && res.data) {
      //console.log("datesforall=================>", res.data)
      setXiSlot(res.data)
      let dateArrwithSlots = []
      res.data.length > 0 && res.data.map((item) => {
        dateArrwithSlots.push(new Date(item.startDate))
      })
      dateArrwithSlots = [...new Set(dateArrwithSlots)];

      setHighlight(dateArrwithSlots)

    }
  }

  const cancelInterview = async (interview) => {
    let slotId = interview?.slots?._id
    const interviewId = interview?.applications?._id
    let dataForUpdate = {
      slotId,
      interviewId,
      interview,
    }
    swal({
      title: "Do you want to Cancel the Interview ?",
      text: "You will not be able to recover this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then(async (willDelete) => {
        if (willDelete) {
          let res = await getSecuredAxiosInstance.post(`/cancel-interview`, dataForUpdate)
          if (res && res.status == 200) {
            swal("Interview Cancelled", {
              icon: "success",
            });
            window.location.reload()
          }

        } else {
          swal("Your Interview is safe!");
        }
      });
  }


  useEffect(() => {
    if (interviewListByCompany) {
      const sortedInterviews = interviewListByCompany.reduce((acc, interview) => {
        const state = interview.applications.interviewState;
        if (state === 0) {
          return { ...acc, state0: [...acc.state0, interview] };
        }
        else if (state === 1) {
          return { ...acc, state1: [...acc.state1, interview] };
        }
        else if (state === 2) {
          return { ...acc, state2: [...acc.state2, interview] };
        }
        else if (state === 3) {
          return { ...acc, state3: [...acc.state3, interview] };
        }
        else if (state === 4) {
          return { ...acc, state4: [...acc.state4, interview] };
        }
        return acc;
      }, { state0: [], state1: [], state2: [], state3: [], state4: [] });

      setInterviewState0(sortedInterviews.state0?.sort((a, b) => a.applications.status.localeCompare(b.applications.status)));
      setInterviewState1(sortedInterviews.state1?.sort((a, b) => a.applications.status.localeCompare(b.applications.status)));
      setInterviewState2(sortedInterviews.state2?.sort((a, b) => a.applications.status.localeCompare(b.applications.status)));
      setInterviewState3(sortedInterviews.state3?.sort((a, b) => a.applications.status.localeCompare(b.applications.status)));
      setInterviewState4(sortedInterviews.state4?.sort((a, b) => a.applications.status.localeCompare(b.applications.status)));

    }
  }, [interviewListByCompany]);

  return (
    <div className="flex ml-10  sm:p-1  bg-[#FAFAFA] overflow-hidden ">
      <div className="bg-[#FAFAFA] container mt-[130px] mb-[80px]">


        {/* <div className=" bg-white ">
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <p className="text-sm flex my-5 mx-4 font-semibold">
              Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
              <p className="text-gray-400 px-2"> here's what's happening today!</p>
            </p>
          </div>
        </div> */}
        <div className="     border-2 rounded-lg border-[#E3E3E3]  ">

          {/* Dropdown Section */}


          <div className="flex gap-2 items-center p-4 bg-[#FFFFFF] rounded-t-lg">

            <span >
              {selectedCompany || selectedJobTitle || interviewerSearchInput || candidateSearchInput || combinedSearchInput ? (<div
                className={` ${styles.TabsWrapper
                  } flex flex-row gap-4 bg-[#EEEEEE] border-2 rounded-xl
                ${activeTab === "On-going" ? "" : styles.LeftPadding
                  } ${activeTab === "Completed" ? "" : styles.RightPadding}
                 `}
              >
                <div
                  className={
                    activeTab === "On-going"
                      ? `rounded-xl bg-[#228276] text-white px-2 flex ${styles.ActiveTab}`
                      : "flex"
                  }
                  onClick={() => handleTabClick("On-going")}
                >
                  <div className="flex m-auto">On-going</div>
                </div>
                <div
                  className={
                    activeTab === "Upcoming"
                      ? `rounded-xl bg-[#228276] text-white px-2 flex ${styles.ActiveTab}`
                      : "flex"
                  }
                  onClick={() => handleTabClick("Upcoming")}
                >
                  <div className="flex m-auto">Scheduled</div>
                </div>
                <div
                  className={
                    activeTab === "Completed"
                      ? `rounded-xl bg-[#228276] text-white px-2 flex ${styles.ActiveTab}`
                      : "flex"
                  }
                  onClick={() => handleTabClick("Completed")}
                >
                  {/* <AiFillLock className="m-auto" /> */}
                  <div className="flex m-auto">Completed</div>
                </div>
              </div>) : null
              }
            </span>

            <span style={{ flexGrow: 1 }}>

              <div className={styles.inputIcons}>
                <i className={`fa fa-search ${styles.icon}`}></i>
                <input
                  className="focus:outline-none border pl-5 w-full focus:ring-[#EEEEEE] bg-[#EEEEEE] rounded-xl hover:bg-[#FAFAFA]"
                  type="text"
                  placeholder="Search"
                  onChange={handleSearchInputChange}
                />
              </div>
              {/* <input
                className="focus:outline-none border focus:ring-[#EEEEEE] bg-[#EEEEEE] rounded-xl hover:bg-[#FAFAFA]"
                type="text"
                placeholder="Search for candidate or interviewer..."
                value={interviewerSearchInput}
                onChange={handleSearchInputChange}
                style={{ width: '100%' }}
              /> */}
            </span>
            <span >
              <select className="focus:outline-none  border focus:ring-[#EEEEEE] bg-[#EEEEEE] rounded-xl hover:bg-[#FAFAFA]"
                onChange={(e) => { handleCompanyNameChange(e.target.value) }}
                defaultValue={selectedCompany}
                style={{ maxWidth: '200px' }}
              >
                <option selected>Select Company</option>
                {companyList.map((company, index) => (
                  <option key={index} value={company._id}>
                    {company._id}
                  </option>
                ))}
              </select>
            </span>
          </div>

          {/* tab sections  */}




          {/* Table Section */}



          <div className="flex flex-col">
            <div className="overflow-x-auto ">
              <div className="py-2 inline-block w-full ">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#FAFAFA] border-b">
                      <tr>
                        <th
                          scope="col"
                          className="w-[25%] text-sm font-medium text-[#888888] pl-4 px-2 py-4 text-left" // Adjust the width value as needed
                        >
                          Job Role
                        </th>
                        <th
                          scope="col"
                          className="w-[20%] text-sm font-medium text-[#888888] px-2 py-4 text-left" // Adjust the width value as needed
                        >
                          Interviewer
                        </th>
                        <th
                          scope="col"
                          className="w-[20%] text-sm font-medium text-[#888888] px-2 py-4 text-left" // Adjust the width value as needed
                        >
                          Candidate
                        </th>
                        <th
                          scope="col"
                          className="w-[20%] text-sm font-medium text-[#888888] px-2 py-4 text-left" // Adjust the width value as needed
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="w-[20%] text-sm font-medium text-[#888888] px-2 py-4 text-left" // Adjust the width value as needed
                        >
                          Slot
                        </th>
                        {/* Uncomment this section to add additional header cells */}
                        {/* <th
      scope="col"
      className="w-[20%] text-sm font-medium text-[#888888] px-2 py-4 text-left"
    >
      Status
    </th> */}
                      </tr>
                    </thead>
                    {activeTab === "On-going" && (
                      <>
                        {interviewState1 && interviewState1.length > 0 ? (

                          interviewState1.map((interview, index) => (
                            <tbody key={index}>
                              {/* {//console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                              <tr
                                // onMouseOver={() => setEditStatus(index)}
                                onMouseOut={() => setEditStatus('not-edit')}
                                className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF] " : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"}   py-4`}
                              >
                                {editStatus !== index || editStatus === 'not-edit' ? (
                                  <>

                                    <td className=" text-sm text-gray-900 font-light pl-3 px-1 py-4 flex items-center whitespace-nowrap">

                                      <img
                                        src={selectedImage ? selectedImage : Demo}
                                        alt="Interviewer"
                                        className="w-8 h-8 rounded-full mr-2"
                                      />


                                      {/* Right side: Job title and company */}
                                      <div>
                                        <div className="text-sm text-gray-900 font-light">{interview.jobTitle}</div>
                                        {/* Add additional information if needed */}
                                        <div className="text-xs text-gray-500 font-light">{selectedCompany}</div>
                                      </div>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                                      {interview.interviewers.firstName} {interview.interviewers.lastname}
                                    </td>

                                    <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                                      {interview.applicant.firstName} {interview.applicant.lastname}
                                    </td>

                                    <td className=" text-xs text-[#888888] font-light px-1  py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('DD/MM/YYYY')}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-1  py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                    </td>
                                    <td className="text-xs text-blue-900 font-light px-1 py-4 whitespace-nowrap">
                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                        onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                      >
                                        <span className="pr-2">
                                          {interview.applications.interviewState == 0 ? (
                                            <FaRegCalendarAlt />
                                          ) : interview.applications.interviewState == 1 ? (
                                            <AiOutlineEye />
                                          ) : interview.applications.interviewState == 2 ? (
                                            <FaVideo />
                                          ) : interview.applications.interviewState == 3 ? (
                                            <FcClock />
                                          ) : interview.applications.interviewState == 4 ? (
                                            <FaVideo />
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                        {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                      </span>
                                    </td>

                                  </>
                                ) : (
                                  <>

                                    <td className=" pl-3 px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {interview.jobTitle}
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td className=" px-2 whitespace-nowrap text-xs font-light text-gray-900">
                                      <span
                                        style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                        className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                      >
                                        <span className="cursor-pointer flex flex-row"
                                          onClick={() => cancelInterview(interview)}
                                        >
                                          <span className="pr-1">
                                            {interview.applications.interviewState == 0 ? (
                                              <AiOutlineClockCircle />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState == 0 ? "Cancel" : ''}
                                        </span>
                                      </span>
                                      <span
                                        style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                        className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                      >
                                        <span className="cursor-pointer flex flex-row"
                                          onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
                                        >
                                          <span className="pr-1">
                                            {interview.applications.interviewState == 0 ? (
                                              <AiOutlineClockCircle />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState == 0 ? "Reschedule" : ''}
                                        </span>
                                      </span>
                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                      // onClick={() => { /* Handle click event */ }}
                                      >
                                        <span className="cursor-pointer flex flex-row">
                                          <span className="pr-1">
                                            {interview.applications.interviewState === 4 ? (
                                              <FaFileAlt />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState === 4 && (
                                            <a
                                              href={`/admin/CPrintAbleAdmin/${encodeURIComponent(interview.applications._id)}`}
                                            >
                                              View Feedback
                                            </a>
                                          )}
                                        </span>
                                      </span>
                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                        onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                      >
                                        <span className="pr-2">
                                          {interview.applications.interviewState == 0 ? (
                                            <FaRegCalendarAlt />
                                          ) : interview.applications.interviewState == 1 ? (
                                            <AiOutlineEye />
                                          ) : interview.applications.interviewState == 2 ? (
                                            <FaVideo />
                                          ) : interview.applications.interviewState == 3 ? (
                                            <FcClock />
                                          ) : interview.applications.interviewState == 4 ? (
                                            <FaVideo />
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                        {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                      </span>
                                    </td>
                                    <td></td>
                                    <td></td>
                                  </>
                                )}
                              </tr>
                            </tbody>
                          ))
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan="6" className="text-[#747474] text-[27px] text-center pt-[100px]">
                                No Ongoing Interviews
                              </td>

                            </tr>
                            <tr>
                              <td colSpan="6" className="text-[#979797] text-[19px] text-center pt-[10px] pb-[100px]">
                                Looks like there are no ongoing interviews at the moment.
                              </td>
                            </tr>
                          </tbody>
                        )}
                        {ongoing > 0 && (

                          <div className="w-full">
                            <div className="flex justify-between my-2 mx-1 ml-3">
                              {Math.ceil(ongoing / 5) ? (
                                <div className="flex items-center">
                                  <span className="text-gray-600">Page</span>
                                  <div className="flex mx-2">
                                    {page > 1 && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-blue-500"
                                        onClick={() => {
                                          paginate_ongoing(page - 1);
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
                                        }}
                                      >
                                        &lt;
                                      </span>
                                    )}
                                    {page > 6 && (
                                      <>
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-blue-500`}
                                          onClick={() => {
                                            paginate_ongoing(1);
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
                                          }}
                                        >
                                          1
                                        </span>
                                        <span className="mx-1 text-gray-600">...</span>
                                      </>
                                    )}
                                    {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                      if (pageNumber > 0 && pageNumber <= Math.ceil(ongoing / 5)) {
                                        return (
                                          <span
                                            className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                              }`}
                                            key={pageNumber}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                            }}
                                            onClick={() => {
                                              paginate_ongoing(pageNumber);
                                            }}
                                          >
                                            {pageNumber}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                    {page < Math.ceil(ongoing / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                    {page < Math.ceil(ongoing / 5) - 4 && (
                                      <span
                                        className={`mx-2 cursor-pointer hover:text-green-500`}
                                        onClick={() => {
                                          paginate_ongoing(Math.ceil(ongoing / 5));
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
                                        }}
                                      >
                                        {Math.ceil(ongoing / 5)}
                                      </span>
                                    )}
                                    {page < Math.ceil(ongoing / 5) && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-green-500"
                                        onClick={() => {
                                          paginate_ongoing(page + 1);
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
                                        }}
                                      >
                                        &gt;
                                      </span>
                                    )}
                                  </div>
                                  {/* <span className="text-gray-600">of {Math.ceil(ongoing / 5)}</span> */}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {activeTab === "Upcoming" && (
                      <>
                        {interviewState0 && interviewState0.length > 0 ? (

                          interviewState0.map((interview, index) => (

                            <tbody key={index}>
                              {/* {//console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                              <tr
                                onMouseOver={() => setEditStatus(index)}
                                onMouseOut={() => setEditStatus('not-edit')}
                                className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"}   py-4`}
                              >
                                {editStatus !== index || editStatus === 'not-edit' ? (
                                  <>

                                    <td className=" text-sm text-gray-900 font-light pl-3 px-1 py-4 flex items-center whitespace-nowrap">

                                      <img
                                        src={selectedImage ? selectedImage : Demo}
                                        alt="Interviewer"
                                        className="w-8 h-8 rounded-full mr-2"
                                      />


                                      {/* Right side: Job title and company */}
                                      <div>
                                        <div className="text-sm text-gray-900 font-light">{interview.jobTitle}</div>
                                        {/* Add additional information if needed */}
                                        <div className="text-xs text-gray-500 font-light">{selectedCompany}</div>
                                      </div>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                      {interview.interviewers.firstName} {interview.interviewers.lastname}
                                    </td>

                                    <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
                                      {interview.applicant.firstName} {interview.applicant.lastname}
                                    </td>

                                    <td className=" text-sm text-[#888888] font-light px-2 py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('DD/MM/YYYY')}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                    </td>
                                    {/* <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
                                      <span style={{
                                        color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
                                        backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
                                      }}
                                        className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
                                      >
                                        {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
                                      </span>
                                      <span className="text-[#D6A45A]">
                                        {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
                                      </span>
                                    </td> */}

                                  </>
                                ) : (
                                  <>

                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {interview.jobTitle}
                                    </td>

                                    <td></td>
                                    <td></td>
                                    <td></td>

                                    <td style={{ left: "-100px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
                                      <span
                                        style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                        className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                      >
                                        <span className="cursor-pointer flex flex-row"
                                          onClick={() => cancelInterview(interview)}
                                        >

                                          {interview.applications.interviewState == 0 ? "Cancel" : ''}
                                        </span>
                                      </span>
                                      <span
                                        style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
                                        className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
                                      >
                                        <span className="cursor-pointer flex flex-row items-center"
                                          onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
                                        >
                                          <span className="pr-1">
                                            {interview.applications.interviewState == 0 ? (
                                              <AiOutlineClockCircle />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState == 0 ? "Reschedule" : ''}
                                        </span>
                                      </span>
                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                      // onClick={() => { /* Handle click event */ }}
                                      >
                                        <span className="cursor-pointer flex flex-row">
                                          <span className="pr-1">
                                            {interview.applications.interviewState === 4 ? (
                                              <FaFileAlt />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState === 4 && (
                                            <a
                                              href={`/admin/CPrintAbleAdmin/${encodeURIComponent(interview.applications._id)}`}
                                            >
                                              View Feedback
                                            </a>
                                          )}
                                        </span>
                                      </span>
                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                        onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                      >
                                        <span className="pr-2">
                                          {interview.applications.interviewState == 0 ? (
                                            <FaRegCalendarAlt />
                                          ) : interview.applications.interviewState == 1 ? (
                                            <AiOutlineEye />
                                          ) : interview.applications.interviewState == 2 ? (
                                            <FaVideo />
                                          ) : interview.applications.interviewState == 3 ? (
                                            <FcClock />
                                          ) : interview.applications.interviewState == 4 ? (
                                            <FaVideo />
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                        {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                      </span>
                                    </td>
                                    <td></td>
                                    <td></td>
                                  </>
                                )}
                              </tr>
                            </tbody>
                          ))
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan="6" className="text-[#747474] text-[27px] text-center pt-[100px]">
                                No Scheduled Interviews
                              </td>

                            </tr>
                            <tr>
                              <td colSpan="6" className="text-[#979797] text-[19px] text-center pt-[10px] pb-[100px]">
                                Looks like there are no scheduled interviews at the moment.
                              </td>
                            </tr>
                          </tbody>
                        )}

                        {upcoming > 0 && (

                          <div className="w-full">
                            <div className="flex justify-between my-2 mx-1 ml-3">
                              {Math.ceil(upcoming / 5) ? (
                                <div className="flex items-center">
                                  <span className="text-gray-600">Page</span>
                                  <div className="flex mx-2">
                                    {page > 1 && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-blue-500"
                                        onClick={() => {
                                          paginate_upcoming(page - 1);
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
                                        }}
                                      >
                                        &lt;
                                      </span>
                                    )}
                                    {page > 6 && (
                                      <>
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-blue-500`}
                                          onClick={() => {
                                            paginate_upcoming(1);
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
                                          }}
                                        >
                                          1
                                        </span>
                                        <span className="mx-1 text-gray-600">...</span>
                                      </>
                                    )}
                                    {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                      if (pageNumber > 0 && pageNumber <= Math.ceil(upcoming / 5)) {
                                        return (
                                          <span
                                            className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                              }`}
                                            key={pageNumber}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                            }}
                                            onClick={() => {
                                              paginate_upcoming(pageNumber);
                                            }}
                                          >
                                            {pageNumber}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                    {page < Math.ceil(upcoming / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                    {page < Math.ceil(upcoming / 5) - 4 && (
                                      <span
                                        className={`mx-2 cursor-pointer hover:text-green-500`}
                                        onClick={() => {
                                          paginate_upcoming(Math.ceil(upcoming / 5));
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
                                        }}
                                      >
                                        {Math.ceil(upcoming / 5)}
                                      </span>
                                    )}
                                    {page < Math.ceil(upcoming / 5) && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-green-500"
                                        onClick={() => {
                                          paginate_upcoming(page + 1);
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
                                        }}
                                      >
                                        &gt;
                                      </span>
                                    )}
                                  </div>
                                  {/* <span className="text-gray-600">of {Math.ceil(upcoming / 5)}</span> */}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {activeTab === "Completed" && (
                      <>
                        {interviewState4 && interviewState4.length > 0 ? (

                          interviewState4.map((interview, index) => (
                            <tbody key={index}>
                              {/* {//console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
                              <tr
                                onMouseOver={() => setEditStatus(index)}
                                onMouseOut={() => setEditStatus('not-edit')}
                                className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"}   py-4`}
                              >
                                {editStatus !== index || editStatus === 'not-edit' ? (
                                  <>

                                    <td className=" text-sm text-gray-900 font-light pl-3 px-1 py-4 flex items-center whitespace-nowrap">

                                      <img
                                        src={selectedImage ? selectedImage : Demo}
                                        alt="Interviewer"
                                        className="w-8 h-8 rounded-full mr-2"
                                      />


                                      {/* Right side: Job title and company */}
                                      <div>
                                        <div className="text-sm text-gray-900 font-light">{interview.jobTitle}</div>
                                        {/* Add additional information if needed */}
                                        <div className="text-xs text-gray-500 font-light">{selectedCompany}</div>
                                      </div>
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                                      {interview.interviewers.firstName} {interview.interviewers.lastname}
                                    </td>

                                    <td className="text-sm text-gray-900 font-light px-1 py-4 whitespace-nowrap">
                                      {interview.applicant.firstName} {interview.applicant.lastname}
                                    </td>

                                    <td className=" text-xs text-[#888888] font-light px-1  py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('DD/MM/YYYY')}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-1  py-4 whitespace-nowrap">
                                      {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
                                    </td>


                                  </>
                                ) : (
                                  <>

                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {interview.jobTitle}
                                    </td>

                                    <td></td>
                                    <td></td>


                                    <td style={{ marginTop: "18px" }} className="  px-2 whitespace-nowrap text-xs font-light text-gray-900">


                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                      // onClick={() => { /* Handle click event */ }}
                                      >
                                        <span className="cursor-pointer flex flex-row">
                                          <span className="pr-1">
                                            {interview.applications.interviewState === 4 ? (
                                              <FaFileAlt />
                                            ) : (
                                              <></>
                                            )}
                                          </span>
                                          {interview.applications.interviewState === 4 && (
                                            <a
                                              href={`/admin/CPrintAbleAdmin/${encodeURIComponent(interview.applications._id)}`}
                                            >
                                              View Feedback
                                            </a>
                                          )}
                                        </span>
                                      </span>

                                    </td>
                                    <td style={{ marginTop: "18px" }} className="  px-2  whitespace-nowrap text-xs font-light text-gray-900">

                                      <span
                                        style={{ width: '130px', cursor: "pointer" }}
                                        className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 items-center py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
                                        onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
                                      >
                                        <span className="pr-2">
                                          {interview.applications.interviewState == 0 ? (
                                            <FaRegCalendarAlt />
                                          ) : interview.applications.interviewState == 1 ? (
                                            <AiOutlineEye />
                                          ) : interview.applications.interviewState == 2 ? (
                                            <FaVideo />
                                          ) : interview.applications.interviewState == 3 ? (
                                            <FcClock />
                                          ) : interview.applications.interviewState == 4 ? (
                                            <FaVideo />
                                          ) : (
                                            <></>
                                          )}
                                        </span>
                                        {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
                                      </span>
                                    </td>
                                    <td></td>
                                  </>
                                )}
                              </tr>
                            </tbody>
                          ))
                        ) : (
                          <tbody>
                            <tr>
                              <td colSpan="6" className="text-[#747474] text-[27px] text-center pt-[100px]">
                                No Completed Interviews
                              </td>

                            </tr>
                            <tr>
                              <td colSpan="6" className="text-[#979797] text-[19px] text-center pt-[10px] pb-[100px]">
                                Looks like there are no completed interviews at the moment.
                              </td>
                            </tr>
                          </tbody>
                        )}

                        {completed > 0 && (

                          <div className="w-full">
                            <div className="flex justify-between my-2 mx-1 ml-3">
                              {Math.ceil(completed / 5) ? (
                                <div className="flex items-center">
                                  <span className="text-gray-600">Page</span>
                                  <div className="flex mx-2">
                                    {page > 1 && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-blue-500"
                                        onClick={() => {
                                          paginate_completed(page - 1);
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
                                        }}
                                      >
                                        &lt;
                                      </span>
                                    )}
                                    {page > 6 && (
                                      <>
                                        <span
                                          className={`mx-2 cursor-pointer hover:text-blue-500`}
                                          onClick={() => {
                                            paginate_completed(1);
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
                                          }}
                                        >
                                          1
                                        </span>
                                        <span className="mx-1 text-gray-600">...</span>
                                      </>
                                    )}
                                    {Array.from({ length: 5 }, (_, i) => page - 2 + i).map((pageNumber) => {
                                      if (pageNumber > 0 && pageNumber <= Math.ceil(completed / 5)) {
                                        return (
                                          <span
                                            className={`mx-2 cursor-pointer ${pageNumber === page ? "page_active text-white bg-green-600" : "hover:text-blue-500"
                                              }`}
                                            key={pageNumber}
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                              borderRadius: "4px",
                                              backgroundColor: pageNumber === page ? "#34D399" : "transparent",
                                            }}
                                            onClick={() => {
                                              paginate_completed(pageNumber);
                                            }}
                                          >
                                            {pageNumber}
                                          </span>
                                        );
                                      }
                                      return null;
                                    })}
                                    {page < Math.ceil(completed / 5) - 5 && <span className="mx-1 text-gray-600">...</span>}
                                    {page < Math.ceil(completed / 5) - 4 && (
                                      <span
                                        className={`mx-2 cursor-pointer hover:text-green-500`}
                                        onClick={() => {
                                          paginate_completed(Math.ceil(completed / 5));
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
                                        }}
                                      >
                                        {Math.ceil(completed / 5)}
                                      </span>
                                    )}
                                    {page < Math.ceil(completed / 5) && (
                                      <span
                                        className="mx-2 cursor-pointer hover:text-green-500"
                                        onClick={() => {
                                          paginate_completed(page + 1);
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
                                        }}
                                      >
                                        &gt;
                                      </span>
                                    )}
                                  </div>
                                  {/* <span className="text-gray-600">of {Math.ceil(completed / 5)}</span> */}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>


        </div>


        {modal2 && (
          <Transition
            appear
            show={modal2}
            as={Fragment}
            className="relative z-10 w-full "
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
                {fullScreenVideo == false ? (
                  <div className="flex min-h-full items-center justify-center p-4 text-center max-w-xl ml-auto">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all h-[95vh]">
                        <div className={`${!modal2 ? "hidden" : "block"} h-full`}>
                          <div className="w-full h-full">
                            <div className="w-full h-full">
                              <div className="border-b-2	">
                                <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                                  <div>
                                    <p className="font-semibold text-[#888888]">View media</p>
                                  </div>
                                  <div className="focus:outline-none border-none"
                                  >
                                    <button onClick={() => {
                                      setModal2(false);
                                      setRecordingURLS([]);
                                      setLiveStreamURLS([]);
                                      setPreinterviewImages([]);
                                    }}
                                      className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"

                                      style={{
                                        color: "#034488",
                                        border: `none${`!important`}`
                                      }}
                                    >
                                      <ImCross />
                                    </button>
                                    <span className="text-[#D6615A]">Cancel</span>
                                  </div>
                                </div>
                              </div>

                              <div className="w-full px-4 py-2" style={{ height: "95%", backgroundColor: "#FFFFFF" }}>
                                <div className="">
                                  {recordingURLS.length > 0 || liveStreamURLS.length > 0 ? (
                                    <div className="relative flex flex-col w-full justify-around mt-3">
                                      {recordingURLS.length > 0 ? (
                                        <>
                                          <h2 className="font-bold text-lg mb-3">Interview recordings</h2>
                                          <Carousel className="block">
                                            {
                                              recordingURLS.map((value, index) => {
                                                return (
                                                  <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                                    style={{ backgroundColor: "#6a6f6a" }}>
                                                    {<ReactPlayer
                                                      url={validateAndSanitizeURL(value.url)}
                                                      controls={true}
                                                      width="100%"
                                                      height="265px"
                                                    />}
                                                  </div>
                                                )
                                              })
                                            }
                                          </Carousel>
                                        </>
                                      ) : (
                                        <>
                                          <h2 className="font-bold text-lg mb-3">Live streaming</h2>
                                          <Carousel className="block">
                                            {
                                              liveStreamURLS.map((value, index) => {
                                                return (
                                                  <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                                    style={{ backgroundColor: "#6a6f6a" }}>
                                                    {
                                                      <ReactHlsPlayer
                                                        src={value.playback_url}
                                                        autoPlay={false}
                                                        controls={true}
                                                        width="100%"
                                                        height="265px"
                                                      />
                                                    }
                                                  </div>
                                                )
                                              })
                                            }
                                          </Carousel>
                                        </>
                                      )}
                                      <ImEnlarge className="absolute top-2 right-12 cursor-pointer text-[white]"
                                        onClick={() => {
                                          setFullScreenVideo(true);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      {spectate !== true ? (
                                        <>
                                          <h2 className="font-bold text-lg mb-3">Interview recordings</h2>
                                          <div className="relative flex w-full justify-center my-4">
                                            No recordings available !
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <h2 className="font-bold text-lg mb-3">Live streaming</h2>
                                          <div className="relative flex w-full justify-center my-4">
                                            No recordings available !
                                          </div>
                                        </>
                                      )}
                                    </>
                                  )
                                  }
                                  {preinterviewImages.length > 0 ? (
                                    <div>
                                      <div className="font-bold text-lg">Baselining images</div>
                                      <img alt="Loading.." src={DOMPurify.sanitize(preinterviewImages[activeSlide])} className="mt-3 h-[150px]" width="500" />
                                      <ImageCarousel
                                        containerProps={{
                                          style: {
                                            width: "100%",
                                            justifyContent: "space-between",
                                            userSelect: "none"
                                          }
                                        }}
                                        preventScrollOnSwipe
                                        swipeTreshold={60}
                                        activeSlideIndex={activeSlide}
                                        activeSlideProps={{

                                        }}
                                        onRequestChange={setActiveSlide}
                                        forwardBtnProps={{
                                          children: ">",
                                          style: {
                                            width: 30,
                                            height: 30,
                                            minWidth: 30,
                                            alignSelf: "center",
                                            outline: "None"
                                          }
                                        }}
                                        backwardBtnProps={{
                                          children: "<",
                                          style: {
                                            width: 30,
                                            height: 30,
                                            minWidth: 30,
                                            alignSelf: "center",
                                            outline: "None"
                                          }
                                        }}
                                        dotsNav={{
                                          show: false
                                        }}
                                        itemsToShow={3}
                                        speed={400}
                                      >
                                        {
                                          preinterviewImages.map((value, index) => {
                                            return (
                                              <img alt="Loading.." key={DOMPurify.sanitize(index)} src={DOMPurify.sanitize(value)}
                                                style={{
                                                  width: 110,
                                                  height: 100,
                                                  border: "30px solid white",
                                                  textAlign: "center",
                                                  lineHeight: "240px",
                                                  boxSizing: "border-box"
                                                }}
                                              >
                                              </img>
                                            )
                                          })
                                        }
                                      </ImageCarousel>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="font-bold text-lg">Baselining images</div>
                                      <p className="relative flex w-full justify-center my-4">Baselining images not available !</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                ) : (
                  <div className="flex min-h-full items-center justify-center p-4 text-center max-w-full">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white align-middle shadow-xl transition-all h-[95vh]">
                        <div className="relative">
                          {recordingURLS.length > 0 ? (
                            <Carousel className="block">
                              {
                                recordingURLS.map((value, index) => {
                                  return (
                                    <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                      style={{ backgroundColor: "#6a6f6a" }}>
                                      {<ReactPlayer
                                        url={validateAndSanitizeURL(value.url)}
                                        controls={true}
                                        width="100%"
                                        height="95vh"
                                      />}
                                    </div>
                                  )
                                })
                              }
                            </Carousel>
                          ) : (
                            liveStreamURLS.map((value, index) => {
                              return (
                                <div key={index} className="text-xl py-2 rounded-lg font-bold  flex"
                                  style={{ backgroundColor: "#6a6f6a" }}>
                                  {
                                    <ReactHlsPlayer
                                      src={value.playback_url}
                                      autoPlay={false}
                                      controls={true}
                                      width="100%"
                                      height="auto"
                                    />
                                  }
                                </div>
                              )
                            })
                          )}
                          <AiOutlineClose className="absolute cursor-pointer text-white w-5 h-5 top-1 right-12"
                            onClick={() => { setFullScreenVideo(false) }}
                          />
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                )
                }
              </div>
            </Dialog>
          </Transition>
        )}

        {modal1 && (
          <Transition
            appear
            show={modal1}
            as={Fragment}
            className="relative z-10 w-full"

          >
            <Dialog
              as="div"
              className="relative z-10 w-5/6"
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
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-xl ml-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full transform   bg-white text-left align-middle shadow-xl transition-all">
                      <div className={`${!modal1 ? "hidden" : "block"} h-full`}>

                        <div className="w-full ">

                          <div className="my-0 px-7 p-6 w-3/4 md:w-full text-left flex justify-between">
                            <div>
                              <p className="font-semibold  text-xl">Reschedule</p>
                            </div>
                            <Close
                              className={styles.CloseBtn}
                              onClick={() => {
                                setModal1(false);
                              }}
                            />
                            {/* <button className="focus:outline-none border-none" onClick={() => {
                                setModal1(false);
                              }}>
                                <button
                                  className="focus:outline-none bg-[#D6615A] text-xs text-white border-none rounded-xl px-1 py-1 my-0 pt--1 mr-3"

                                  style={{
                                    color: "#034488",
                                    border: `none${`!important`}`
                                  }}
                                >
                                  <ImCross />
                                </button>
                                <span className="text-[#D6615A]">Cancel</span>
                              </button> */}
                          </div>


                          <div className="w-full px-4 pb-4" style={{ height: "95%", backgroundColor: "#FFFFFF" }}>
                            <>

                              <h2 className="font-medium text-sm">Select date</h2>
                              <div className="flex w-full justify-center my-2">
                                {(() => {
                                  return (
                                    <DatePicker
                                      locale="id"
                                      minDate={new Date()}
                                      onChange={setStartTime}
                                      value={startTime}
                                      // selected={startDate}
                                      dateFormat="MM/dd/yyyy"
                                      highlightDates={highlight}
                                      inline
                                    />
                                  );
                                })()}
                              </div>
                              <h2
                                className={`text-left font-medium text-sm mt-3`}
                              >
                                Select Interviewer{" "}
                              </h2>
                              <select
                                className="form-control mt-2"
                                onChange={(e) => {

                                  const selectedValue = e.target.value;
                                  //console.log("e", selectedValue)
                                  if (selectedValue === "all") {
                                    setIdFlag(true);
                                    setDisableBtn(true);
                                    showXiSlotForAll();
                                    // For example, you can set a flag or update other states
                                  } else {
                                    setIdFlag(false);
                                    setSelectedXi(selectedValue);
                                    highlightDates();
                                    showXiSlot(selectedValue);
                                    setDisableBtn(true);
                                  }
                                }}
                              >
                                <option value="all">Anyone</option> {/* Hardcoded "All" option */}
                                {matchedXis && matchedXis.length > 0 ? (
                                  matchedXis.map((xi) => (
                                    <option key={xi._id} value={xi._id}>
                                      {xi.firstName + " " + xi.lastname}
                                    </option>
                                  ))
                                ) : (
                                  <option>select Interviewer</option>
                                )}
                              </select>

                              <div className="mt-4">
                                <div className="flex justify-between items-center mt-3">
                                  <h2
                                    className={`text-left font-medium text-sm `}
                                  >
                                    Slot Time{" "}
                                  </h2>
                                  <span className="text-left text-[#228276] font-medium text-sm cursor-pointer" onClick={handleRequestAvailability}>
                                    Request Availability
                                  </span>
                                </div>

                                <select
                                  className="form-control mt-2"
                                  onChange={async (e) => {
                                    const selectedSlotId = e.target.value;
                                    //console.log("=========>mean", xiSlot)
                                    let priority = await priorityEngine(
                                      xiSlot.find((item) => item._id === selectedSlotId).startDate,
                                      type
                                    );

                                    if (priority.status === 200) {
                                      setDisableBtn(false);
                                    }

                                    setslotId(priority.data.slot);
                                  }}
                                >
                                  {xiSlot.length === 0 && (
                                    <option value="" disabled selected>
                                      No slots available
                                    </option>
                                  )}
                                  {xiSlot &&
                                    xiSlot.some(item => {
                                      return (
                                        new Date(item.startDate).getDate() === new Date(startTime).getDate() &&
                                        new Date(item.startDate).getMonth() === new Date(startTime).getMonth() &&
                                        new Date(item.startDate).getFullYear() === new Date(startTime).getFullYear()
                                      );
                                    })
                                    ? xiSlot.map((item, index) => {
                                      if (
                                        new Date(item.startDate).getDate() === new Date(startTime).getDate() &&
                                        new Date(item.startDate).getMonth() === new Date(startTime).getMonth() &&
                                        new Date(item.startDate).getFullYear() === new Date(startTime).getFullYear()
                                      ) {
                                        const timezoneInfo = '(UTC+5:30)'; // Your timezone information
                                        return (
                                          <option
                                            key={item._id}
                                            value={item._id}
                                            className={`${slotId && slotId._id === item._id
                                              ? "bg-[#EEEEEE] text-white-600"
                                              : "bg-white text-gray-600"
                                              }`}
                                          >
                                            {`${String(new Date(item.startDate).getHours()).padStart(2, '0')}:${String(new Date(
                                              item.startDate
                                            ).getMinutes()).padStart(2, '0')} - ${String(new Date(item.endDate).getHours()).padStart(2, '0')}:${String(new Date(
                                              item.endDate
                                            ).getMinutes()).padStart(2, '0')}${'\u00A0\u00A0' /* Non-breaking space */}${timezoneInfo}`}
                                          </option>
                                        );
                                      }
                                      return null; // If no matching slots, return null to skip rendering this option
                                    })
                                    : (
                                      <option value="" disabled selected>
                                        No slots available
                                      </option>
                                    )}
                                </select>


                              </div>



                            </>
                          </div>
                          <div
                          >
                            {/* <h2 className="font-bold text-lg pt-4xl">Select time frame</h2>
                              <div className="rounded-lg bg-white border border-[#E3E3E3] w-full my-4 overflow-y-scroll h-2/5">
                                <div className="my-2 mx-2">
                                </div>
                              </div> */}

                            <div className="w-full border-t-2 p-4 border-gray-400  flex justify-between">
                              <button
                                className="focus:outline-none bg-[#fff] rounded-lg px-4  py-2 border b-2 text-black font-500"

                                style={

                                  { flexBasis: '30%', marginRight: '5px' } // Add margin-right for the gap
                                }
                                onClick={() => {
                                  setModal1(false);
                                }}
                              >
                                Cancel

                              </button>
                              <button
                                className="hover:bg-[#228276] focus:outline-none bg-[#228276] rounded-lg px-[100px] py-2 text-white font-500"
                                disabled={disableBtn}
                                style={
                                  disableBtn === true
                                    ? { backgroundColor: "#B3B3B3" }
                                    : { backgroundColor: "#228276", flexBasis: '70%' }
                                }
                                onClick={handleConfrimReschedule}
                              >
                                Reschedule
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

        {showInputModal && (
          <Transition appear show={showInputModal}>
            <Dialog
              as="div"
              className="fixed inset-0 z-50 overflow-y-auto"
              onClose={handleCloseInputModal}
            >
              <div className="flex items-center justify-center min-h-screen">
                {/* Second modal content p-4 w-[500px]*/}
                <Dialog.Panel className="p-4 w-[500px] transform bg-white text-left">
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-bold ">Request Availability</h2>
                    </div>
                    <Close
                      // className={styles.CloseBtn}
                      onClick={handleCloseInputModal}
                    />
                  </div>
                  <textarea
                    className={" block p-11 w-full h-[18rem] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "}
                    onChange={handleMessageChange}
                    value={message}
                    placeholder="Write your query here..."
                  />
                  <div className="mt-4 flex w-full">

                    <button
                      className="bg-[#228276] w-full text-white px-4 py-2 rounded-lg"
                      // onClick={() => {
                      //   if (idFlag) {
                      //     //console.log("rain", matchedXis)

                      //   } else {
                      //     //console.log("name", selectedXi)
                      //     //console.log("ama", startTime)
                      //   }

                      // }}
                      onClick={() => { handleXIRequestEmail(); }}
                    >
                      Send Request
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>
        )}

        {confirmModal && (
          <Transition appear show={confirmModal}>
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
            <Dialog
              as="div"
              className="fixed inset-0 z-50 overflow-y-auto"
              onClose={handleCloseInputModal}
            >
              <div className="flex items-center justify-center min-h-screen">
                {/* Second modal content */}
                <Dialog.Panel className="bg-white p-4 w-[60%] rounded-lg">
                  <div className="mb-1 flex justify-between items-center">
                    <h2 className="text-lg font-bold">Interview Reschedule</h2>
                    <Close
                      // className={styles.CloseBtn}
                      onClick={handleCloseInputModal}
                    />
                  </div>
                  <div>
                    <p>Are you sure you want to reschedule the interview</p>
                  </div>

                  <div className="mt-4 flex w-full justify-end gap-2">

                    <button
                      className=" bg-[#fff] rounded-lg px-4  py-2 border b-2 text-black w-[20%]"


                      onClick={() => {
                        setConfirmModal(false);
                      }}
                    >
                      Cancel

                    </button>
                    <button
                      className="bg-[#228276] w-[30%] text-white px-4 py-2 rounded-lg"

                      onClick={() => { scheduleSlot() }}
                    >
                      Reschedule
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </Transition>
        )}

      </div>
    </div>
  );
}

export default InterviewList;





// hiii

// {interviewListByCompany && interviewListByCompany.map((interview, index) => {
//   return (
//     <tbody key={index}>
//       {/* {//console.log('INTERVIEW-------------', interview ? interview.slots.startDate  : 'NO INTERVIEW')} */}
//       <tr
//         onMouseOver={() => setEditStatus(index)}
//         onMouseOut={() => setEditStatus('not-edit')}
//         className={`${editStatus !== index || editStatus === 'not-edit' ? "bg-[#FFFFFF]" : "bg-[#FAFAFA] shadow-[0px 1px 2px rgba(0, 0, 0, 0.12)]"} border-b  py-4`}
//       >
//         {editStatus !== index || editStatus === 'not-edit' ? (
//           <>
//             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               {index + 1}
//             </td>
//             <td className=" text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
//               {interview._id}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.interviewers.firstName} {interview.interviewers.lastname}
//             </td>

//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.firstName} {interview.applicant.lastname}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.email}
//             </td>
//             <td className="text-sm text-gray-900 font-light pr-4 py-4 whitespace-nowrap">
//               {interview.applicant.contact}
//             </td>
//             <td className="text-sm text-gray-900 font-light px-2 py-4 whitespace-nowrap">
//               {moment(interview.slots.startDate).format('HH:mm')} - {moment(interview.slots.endDate).format('HH:mm')}
//             </td>
//             <td className="text-xs text-blue-900 font-light px-2 py-4 whitespace-nowrap">
//               <span style={{
//                 color: (interview.applications.interviewState) == 0 ? '#DC8551' : interview.applications.interviewState == 1 ? "#3D71C2" : interview.applications.interviewState == 2 ? "#228276" : interview.applications.interviewState == 3 ? "#D6615A" : interview.applications.interviewState == 4 ? "#228276" : '',
//                 backgroundColor: (interview.applications.interviewState) == 0 ? 'rgba(220, 133, 81, 0.1)' : interview.applications.interviewState == 1 ? "rgba(41, 92, 170, 0.1)" : interview.applications.interviewState == 2 ? "rgba(34, 130, 118, 0.1)" : interview.applications.interviewState == 3 ? "rgba(214, 97, 90, 0.1)" : interview.applications.interviewState == 4 ? "rgba(34, 130, 118, 0.1)" : ''
//               }}
//                 className={`${interview.applications.interviewState >= 0 ? "border border-gray-900 rounded px-3 py-1 text-xs mr-2 mb-1" : ""}`}
//               >
//                 {interview.applications.interviewState == 0 ? "Upcoming" : interview.applications.interviewState == 1 ? "On-going" : interview.applications.interviewState == 2 ? "Completed" : interview.applications.interviewState == 3 ? "No show" : interview.applications.interviewState == 4 ? "Completed" : ''}
//               </span>
//               <span className="text-[#D6A45A]">
//                 {interview.applications.interviewState == 4 ? "Feedback pending" : ""}
//               </span>
//             </td>
//             <td style={{ marginRight: "6px" }} className="flex justify-start text-xs text-[#888888] font-light px-6 py-4 whitespace-nowrap">
//               {moment(interview.slots.startDate).format('DD:MM:YYYY')}
//             </td>
//           </>
//         ) : (
//           <>
//             <td></td>
//             <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//               {interview.jobTitle}
//             </td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td style={{ left: "-150px", position: "relative", marginTop: "18px" }} className="flex justify-end px-2 whitespace-nowrap text-xs font-light text-gray-900">
//               <span
//                 style={interview.applications.interviewState == 0 ? { width: '80px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
//                 className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
//               >
//                 <span className="cursor-pointer flex flex-row"
//                   onClick={() => cancelInterview(interview)}
//                 >
//                   <span className="pr-1">
//                     {interview.applications.interviewState == 0 ? (
//                       <AiOutlineClockCircle />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState == 0 ? "Cancel" : ''}
//                 </span>
//               </span>
//               <span
//                 style={interview.applications.interviewState == 0 ? { width: '130px', backgroundColor: "rgba(214, 97, 90, 0.1)" } : { width: '100px' }}
//                 className={`${interview.applications.interviewState == 0 ? "border border-gray-900 rounded-xl px-3 py-2 text-[#D6615A] mr-2 mb-1" : ""}`}
//               >
//                 <span className="cursor-pointer flex flex-row"
//                   onClick={() => handleActionsOnHover(interview.applications.meetingID, "Reschedule", interview)}
//                 >
//                   <span className="pr-1">
//                     {interview.applications.interviewState == 0 ? (
//                       <AiOutlineClockCircle />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState == 0 ? "Reschedule" : ''}
//                 </span>
//               </span>
//               <span
//                 style={{ width: '130px', cursor: "pointer" }}
//                 className={`${interview.applications.interviewState === 4 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
//               // onClick={() => { /* Handle click event */ }}
//               >
//                 <span className="cursor-pointer flex flex-row">
//                   <span className="pr-1">
//                     {interview.applications.interviewState === 4 ? (
//                       <FaFileAlt />
//                     ) : (
//                       <></>
//                     )}
//                   </span>
//                   {interview.applications.interviewState === 4 && (
//                     <a
//                       href={`/admin/CPrintAbleAdmin/${interview.applications._id}`}
//                     >
//                       View Feedback
//                     </a>
//                   )}
//                 </span>
//               </span>
//               <span
//                 style={{ width: '130px', cursor: "pointer" }}
//                 className={`${interview.applications.interviewState >= 0 ? "bg-[#228276] border border-gray-900 rounded-xl px-3 py-2 text-[white] mr-2 mb-1 flex flex-row" : ""}`}
//                 onClick={() => handleActionsOnHover(interview.applications.meetingID, Number(interview.applications.interviewState), interview)}
//               >
//                 <span className="pr-2">
//                   {interview.applications.interviewState == 0 ? (
//                     <FaRegCalendarAlt />
//                   ) : interview.applications.interviewState == 1 ? (
//                     <AiOutlineEye />
//                   ) : interview.applications.interviewState == 2 ? (
//                     <FaVideo />
//                   ) : interview.applications.interviewState == 3 ? (
//                     <FcClock />
//                   ) : interview.applications.interviewState == 4 ? (
//                     <FaVideo />
//                   ) : (
//                     <></>
//                   )}
//                 </span>
//                 {interview.applications.interviewState == 0 ? "Send reminder" : interview.applications.interviewState == 1 ? "Spectate" : interview.applications.interviewState == 2 ? "View recording" : interview.applications.interviewState == 3 ? "Reschedule" : interview.applications.interviewState == 4 ? "View recording" : ''}
//               </span>
//             </td>
//           </>
//         )}
//       </tr>
//     </tbody>
//   )
// })}


// hiiend
