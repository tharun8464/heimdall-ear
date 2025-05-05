import PreEvaluationDashboardMenu from "../PreEvaluationDashboardMenu/PreEvaluationDashboardMenu";
import SortIcon from "../../../../assets/images/PreEvaluation/SortIcon.svg";
import SortIconDes from "../../../../assets/images/PreEvaluation/SortIconAsc.svg";
import SortIconAsc from "../../../../assets/images/PreEvaluation/SortIconDes.svg";
import SortIconWhite from "../../../../assets/images/PreEvaluation/SortIconWhite.svg";
import culturalMatch from "../../../../assets/images/culturalMatch.svg";
import teamDynamics from "../../../../assets/images/teamDynamics.svg";
import cognitiveMatch from "../../../../assets/images/cognitiveMatch.svg";
import technicalRating from "../../../../assets/images/technicalRating.svg";
import CustomChip from "../../../CustomChip/CustomChip";
import Avatar from "../../../../assets/images/UserAvatar.png";
import StarIcon from "@mui/icons-material/Star";
import { BiDotsVerticalRounded, BiItalic } from "react-icons/bi";
import usePopup from "../../../../Hooks/usePopup";
import InvitePopup from "./InvitePopup/InvitePopup";
import FilterComponent from "../CandidateEvaluationDashboard/FilterComponent/FilterComponent";
import ReportComponent from "../EvaluationReportsComponent/ReportComponent/ReportComponent";
import Filter from "../../../../assets/images/Reports/Filter.svg";
import { AiFillCaretDown, AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { IoCaretUpSharp } from "react-icons/io5";
import { Alert, Checkbox, Divider } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TagViewCandidateDetailsRow from "../CandidateDetailsRow/TagViewCandidateDetailsRow";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomInput, { CustomSelectInput } from "../../../CustomInput/CustomInput";
import ls from "localstorage-slim";
import styles from "./MainViewComponent.module.css";
import { Popover } from "@headlessui/react";
import { useEffect, useState } from "react";
import EditWeightageComponent from "./EditWeightageComponent/EditWeightageComponent";
import CustomizeViewComponent from "./CustomizeViewComponent/CustomizeViewComponent";
import usePreEvaluation from "../../../../Hooks/usePreEvaluation";
import { useSelector } from "react-redux";
import useAnalysis from "../../../../Hooks/useAnalysis";
import Button from "../../../Button/Button";
import { useParams } from "react-router";
import useInvite from "../../../../Hooks/useInvite";
import PsychometryInviteButton from "../../../../Components/Button/PsychometryInviteButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  getStorage,
  getSessionStorage,
  removeStorage,
  removeSessionStorage,
  setStorage,
  setSessionStorage,
} from "../../../../service/storageService";
import { getJobById, getPsychDetailsLI, updateHasVmPro } from "../../../../service/api";
import ConfidenceMarker from "../ConfidenceMarker/ConfidenceMarker";
import { Tooltip } from "react-tooltip";
import InterviewStatusComponent from "../InterviewStatusComponent/InterviewStatusComponent";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import {
  getCompanyCredit,
  getCreditMapByCompany,
  verifyServiceEnabled,
} from "../../../../service/creditMapService";
import ReportHeaderComponent from "../EvaluationReportsComponent/ReportHeaderComponent/ReportHeaderComponent";
import Loader from "../../../Loader/Loader";
import MainViewOnClickCandidateRow from "./MainViewOnClickCandidateRow/MainViewOnClickCandidateRow";
import { getChallengeByUserId } from "../../../../service/challengeService";
import { useDispatch } from "react-redux";
import { getMainViewProfilesSuccess } from "../../../../Store/slices/preEvaluationSlice";
import { notify } from "../../../../utils/notify";


import useReport from "../../../../Hooks/useReport";

// **************
import { getTraitsForPlay } from "../../../../service/invitationService";
import ManageListComponent from "../../../ManageListComponent/ManageListComponent";
// *************

// companynames
import { getAllCompany } from "../../../../service/preEvaluation/getCompanyNameById";

// 
// testing setup
const tableHeader = [
  // {
  //   text: "",
  //   icon: ''
  // },
  {
    text: "",
    icon: ""
  },
  {
    text: "Name",
    icon: ""
  },
  {
    text: "Cultural Match",
    icon: culturalMatch
  },
  {
    text: "Team Dynamics",
    icon: teamDynamics
  },
  {
    text: "Cognitive Match",
    icon: cognitiveMatch
  },
  {
    text: "Technical Rating",
    icon: technicalRating
  },
  {
    text: "Talent Match",
    icon: ""
  },
  {
    text: "Candidate Source",
    icon: ""
  },
];



const MainViewComponent = ({ setSelectedCandidatesForList, selectedCandidatesForList, setManageListShare, manageListShare, setUncheckBoxes }) => {
  const { handleGetListData } = useReport()
  const [refreshPage, setRefreshPage] = useState(false);
  const [hoveredCandidateIndex, setHoveredCandidateIndex] = useState(null);
  const [filteredMainviewProfiles, setFilteredMainviewProfiles] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showEditWeightage, setShowEditWeightage] = useState(false);
  const [desiredWeight, setDesiredWeight] = useState(() => {
    // Retrieve the value from localStorage on component initialization
    const storedValue = getSessionStorage("desiredWeight");
    try {
      return storedValue ? JSON.parse(storedValue) : 0;
    } catch (error) {
      return 0;
    }
  });


  const [showCustomizeView, setShowCustomizeView] = useState(false);
  const [showEnterTagName, setShowEnterTagName] = useState(false);
  const [showInterviewStatus, setShowInterviewStatus] = useState(false);
  const [isOnClickTagView, setIsOnClickTagView] = useState(false);
  const [user, setUser] = useState();
  const [job, setJob] = useState();
  const [isTagChange, setIsTageChange] = useState(false);
  const [data, setData] = useState(null);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [customTagName, setCustomTagName] = useState("");
  const [highlightedCandidateIndex, setHighlightedCandidateIndex] = useState(null);
  const [value, setValue] = useState({});
  const [bigfivealways, setBigfivealways] = useState(false);
  const [bigfivesixty, setBigfivesixty] = useState('');
  const [teamDynamicReport, setTeamDynamicReport] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    column: "",
    ascending: true,
  });
  const [sortingIcon, setSortingIcon] = useState(SortIcon);
  const [sortingText, setSortingText] = useState('');
  useEffect(() => {
    if (sortOrder?.column && sortOrder?.ascending) {
      setSortingIcon(SortIconAsc);
    } else if (sortOrder?.column && !sortOrder?.ascending) {
      setSortingIcon(SortIconDes);
    } else {
      setSortingIcon(SortIcon);
    }
  }, [sortOrder]);
  const [isInviteCellLoading, setIsInviteCellLoading] = useState({});
  const [isCultureCellLoading, setIsCultureCellLoading] = useState({});
  const [isTeamCellLoading, setIsTeamCellLoading] = useState({});
  const [isCogCellLoading, setIsCogCellLoading] = useState({});
  const showTableHeader = false;
  const [rowLoadingState, setRowLoadingState] = useState({});
  const [isPsychometryInviteSent, setPsychometryInviteSent] = useState(false);
  const dispatch = useDispatch();
  const [allCompany, setAllCompany] = useState([])
  const [externalCompanyId, setExternalCompanyId] = useState(null)
  const [externalCompanyName, setExternalCompanyName] = useState(null)


  const [showManageList, setShowManageList] = useState(false)


  // ****************
  const [mains, setMains] = useState([{ pullrep: "not empty" }])
  // ***************

  const { handlePopupCenterOpen, handlePopupCenterComponentRender } = usePopup();

  const { isInviteCandidateForInterviewLoading, isInviteCandidateForCognitiveLoading } =
    useSelector(state => state.invite);

  const handleShowPopup = async (
    {
      firstName,
      lastName,
      email,
      contact,
      linkedinURL,
      evaluationId,
      action,
      phoneNo,
      indiProfileId,
      company_id,
    },
    isCognitive = false,
  ) => {


    try {
      const respo = await getCreditMapByCompany(user.company_id);

      const response = await getCompanyCredit(user.company_id);


      const creditPop = response?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;

      const maxCredit = respo?.data?.credit.find(
        entry => entry.action === action,
      )?.credit;

      //console.log("renovo", maxCredit)
      if (creditPop > maxCredit) {
        handlePopupCenterOpen(true);
        const handleCloseLoader = () => {
          setIsCultureCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsTeamCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsInviteCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          setIsCogCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: false,
          }));
          // Additional close actions if needed
        };

        const handleCultLoader = () => {
          setIsCultureCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleTeamLoader = () => {
          setIsTeamCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleTechLoader = () => {
          setIsInviteCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };

        const handleCognitiveLoader = () => {
          setIsCogCellLoading(prevState => ({
            ...prevState,
            [evaluationId]: true,
          }));
        };


        handlePopupCenterComponentRender(
          <ConfirmPopup
            handleCloseLoader={handleCloseLoader}
            handleCultLoader={handleCultLoader}
            handleTeamLoader={handleTeamLoader}
            handleTechLoader={handleTechLoader}
            handleCognitiveLoader={handleCognitiveLoader}
            data={{
              firstName,
              lastName,
              email,
              contact,
              linkedinURL,
              evaluationId,
              action,
              company: externalCompanyId ? externalCompanyId : user.company_id,
              phoneNo,
              companyName: externalCompanyName ? externalCompanyName : companyName?.companyName,
              companyId: externalCompanyId ? externalCompanyId : company_id,
              jobId,
              creditPop,
              maxCredit,
              indiProfileId,
            }}
            isCognitive={isCognitive}
          />,
        );
      } else {
        handlePopupCenterOpen(true);
        handlePopupCenterComponentRender(
          <InvitePopup
            data={{
              firstName,
              lastName,
              email,
              contact,
              linkedinURL,
              evaluationId,
              action,
              company: user.company_id,
              creditPop,
              maxCredit,
              indiProfileId,
            }}
          />,
        );
      }
    } catch (error) {
      // Handle errors from the verification service
      console.error("Error verifying service:", error);
    }
  };

  const { handleCalculateTalentMatch } = useAnalysis();
  const {
    handleGetCognitiveMatch,
    handleGetCultureMatch,
    handleGetTechnicalRating,
    handleCreateTeamCompatibility,
    handleGetCompanyNameById,
    handleTeamDynamicsConfidence,
    handleAddTags,
    handleDeleteCandidate,
    handleGetMainViewProfiles,
    handleDeleteTag,
    handleTeamDynamicReportFlag,
  } = usePreEvaluation();

  const { handleInviteCandidateForCognitive, handleInviteCandidateForInterview } =
    useInvite();

  const {
    mainViewProfiles,
    companyName,
    isGetMainViewProfilesLoading,
    isGetCultureMatchLoading,
    isTeamDynamicsConfLoading,
  } = useSelector(state => state.preEvaluation);

  const { id: jobId } = useParams();

  const [loading, setLoading] = useState(false);
  const { allPodsData } = useSelector(state => state.pod);
  const [selectedPods, setSelectedPods] = useState(0);
  useEffect(() => {
    const data = allPodsData?.filter(value => value?.isSelected === true);
    setSelectedPods(data?.length);
  }, [allPodsData]);




  useEffect(() => {
    let timeoutId;

    if (desiredWeight) {
      // Set a timer for 10 seconds
      setLoading(true);
      timeoutId = setTimeout(() => {
        handleGetMainViewProfiles(jobId);
        setLoading(false);
      }, 5000);
    }

    return () => {
      // Clear the timer if the component unmounts or if the dependency changes
      clearTimeout(timeoutId);
      dispatch(getMainViewProfilesSuccess([]));
      setLoading(false);
    };
  }, [desiredWeight]);

  const items = [
    { item: "Cultural Match" },
    { item: "Team Compatibility" },
    { item: "Cognitive Match" },
    { item: "Technical Rating" },
  ];

  const [checkedItems, setCheckedItems] = useState(
    items.reduce((acc, item) => {
      acc[item.item] = true;
      return acc;
    }, {}),
  );

  const handleGetCultureMatchReport = (indiProfileId, evaluationId) => {
    if (!indiProfileId) {
      notify("No data yet, Please try again later", "error");
      return;
    }

    const data = {
      organizationID: user.company_id,
      profileID: indiProfileId,
    };

    // Trigger the asynchronous operations
    handleGetCultureMatch(data, evaluationId, jobId);
    let timeoutId;

    if (indiProfileId) {
      // Set a timer for 10 seconds

      timeoutId = setTimeout(() => {
        //console.log("lake")
        handleGetMainViewProfiles(jobId);
        setLoading(false);
      }, 5000);
    }

    return () => {
      // Clear the timer if the component unmounts or if the dependency changes
      clearTimeout(timeoutId);
    };
  };
  // console.log("fili", mainViewProfiles);
  useEffect(() => {
    if (filteredCandidates && filteredCandidates.length > 0) {
      setData(filteredCandidates);
    } else {
      setData(mainViewProfiles);
    }
  }, [filteredCandidates, mainViewProfiles, isTagChange]);

  useEffect(() => {
    mainViewProfiles?.map(
      ({
        _id: evaluationId,
        userId,
        totalExp,
        cognitiveMatch,
        cognitionInvited,
        firstName,
        lastName,
        hasPlayedSomeGame,
      }) => {
        if (
          !cognitiveMatch &&
          userId &&
          cognitionInvited &&
          job?.jobRole &&
          hasPlayedSomeGame
        ) {
          const data = {
            UserId: userId,
            Experience: totalExp ?? 0,
            JobRole: job?.jobRole,
            evaluationId,
          };
          const errorData = {
            firstName,
            lastName,
          };
          handleGetCognitiveMatch(data, evaluationId, jobId, errorData);
        }
      },
    );
  }, [mainViewProfiles]); //mainViewProfiles

  const [selectedCandidate, setSelectedCandidate] = useState({});

  const handleCancel = () => {
    // Close the modal when "Cancel" button is clicked
    setShowEnterTagName(false);
  };

  const handleGetTalentMatch = async (jobId, evaluationId, desiredWeight) => {
    const data = {
      jobId: jobId,
      evaluationId: evaluationId,
      desiredWeight: desiredWeight,
    };
    handleCalculateTalentMatch(data);
  };

  const getComapanies = async () => {
    let resp = await getAllCompany()

    if (resp) {
      setAllCompany(resp?.data)
      let selectedValue = job?.hiringOrganization
      let matchedValues = resp?.data?.find(value => value.name === selectedValue);
      matchedValues?.name ? setExternalCompanyName(matchedValues?.name) : setExternalCompanyName("")
      matchedValues?._id ? setExternalCompanyId(matchedValues?._id) : setExternalCompanyId("")
      // setTimeout(() => {

      // }, [3000])

      // const userDocRef = await createDocumentUserFromAuth(response.user);
    }

    // console.log(allCompany, "aaaaaaaaaaawwwwwwwwww", resp?.data)

  };
  // const getComapanieId = async () => {
  //   let selectedValue = job?.hiringOrganization
  //   let matchedValues = allCompany.find(value => value.name === selectedValue);
  //   matchedValues?.name ? setExternalCompanyName(matchedValues?.name) : setExternalCompanyName(null)
  //   matchedValues?._id ? setExternalCompanyId(matchedValues?._id) : setExternalCompanyId(null)
  //   setTimeout(() => {
  //     console.log("aaaaaaaaaaahhhhhhhhhhh", companyName?.companyName, "oiu", selectedValue, "loj", matchedValues, "loiy", externalCompanyId, externalCompanyName)
  //   }, [3000])


  // }
  useEffect(() => {
    getComapanies();

  }, [externalCompanyId, externalCompanyName]);
  useEffect(() => {

  }, [allCompany])

  const handleChange = e => {
    setCustomTagName(e.target.value);
  };

  const handleRemoveCandidate = candidateId => {
    handleDeleteCandidate(candidateId, jobId);
    // handleGetBestProfiles(jobId);
  };

  const handleAddCustomTag = async (candidateId, tag) => {
    try {
      await handleAddTags(candidateId, tag, jobId);
      setShowEnterTagName(false);
      setCustomTagName("");
      // setPopoverOpen(false);
      // setPopoverVisible(false);
      // await handleGetBestProfiles(jobId);
    } catch (error) { }
  };

  const handleDeleteChip = async (candidateId, tagId) => {
    try {
      handleDeleteTag(candidateId, tagId);
      //setPopoverVisible(!isPopoverVisible)
    } catch (error) { }
  };

  const handleShowEnterTagName = () => {
    setShowEnterTagName(true);
  };

  const handleTagView = candidate => {
    setIsOnClickTagView(true);
    setSelectedCandidate(candidate);
  };

  const handleSectionClose = () => {
    setIsOnClickTagView(false);
  };

  const handleTagChange = () => {
    setIsTageChange(true);
  };

  useEffect(() => {
    let data = {};
    if (filteredMainviewProfiles && filteredMainviewProfiles.length > 0) {
      for (let profile of filteredMainviewProfiles) {
        data[profile?._id] = profile?._id;
      }
    }
    setValue(data);
  }, [filteredMainviewProfiles]);


  // const handleSearch = async searchValue => {
  //   const lowercasedFilterValue = searchValue.trim().toLowerCase();
  //   let filteredCandidates;
  //   if (!lowercasedFilterValue) {
  //     // If filterValue is empty, don't apply filtering
  //     filteredCandidates = mainViewProfiles;
  //   } else {
  //     // Apply filtering logic when filterValue is not empty
  //     filteredCandidates = filteredMainviewProfiles?.filter(candidate => {
  //       // Ensure that each property is defined before calling toLowerCase()
  //       const firstNameMatch =
  //         candidate.firstName &&
  //         candidate.firstName.toLowerCase().includes(lowercasedFilterValue);
  //       const lastNameMatch =
  //         candidate.lastName &&
  //         candidate.lastName.toLowerCase().includes(lowercasedFilterValue);
  //       const profileURLMatch =
  //         candidate.profileURL &&
  //         candidate.profileURL.toLowerCase().includes(lowercasedFilterValue);
  //       const contactMatch =
  //         candidate.contact &&
  //         candidate.contact.toLowerCase().includes(lowercasedFilterValue);
  //       const emailMatch =
  //         candidate.email &&
  //         candidate.email.toLowerCase().includes(lowercasedFilterValue);
  //       // const tagMatch =
  //       //   candidate.tag &&
  //       //   candidate.tag.toLowerCase().includes(lowercasedFilterValue);

  //       // Check if the filter value matches any of the fields
  //       return (
  //         firstNameMatch || lastNameMatch || profileURLMatch || contactMatch || emailMatch
  //         // tagMatch
  //       );
  //     });
  //   }
  //   //console.log(filteredCandidates)
  //   setFilteredMainviewProfiles(filteredCandidates);
  // };



  const handleSearch = searchValue => {
    // Normalize the search value by trimming and splitting on whitespace, then converting to lowercase
    const searchTerms = searchValue.trim().toLowerCase().split(/\s+/);

    // Apply filtering logic if there are search terms; otherwise, show all profiles
    const filteredCandidates = mainViewProfiles.filter(candidate => {
      if (!searchTerms.length || searchTerms[0] === "") {
        // If no valid search terms, return all candidates
        return true;
      }

      // Check if any search term is present in any of the fields
      return searchTerms.every(term => {
        // Ensure that each property is defined before calling toLowerCase()
        const firstNameMatch =
          candidate.firstName &&
          candidate.firstName.toLowerCase().includes(term);
        const lastNameMatch =
          candidate.lastName &&
          candidate.lastName.toLowerCase().includes(term);
        const profileURLMatch =
          candidate.profileURL &&
          candidate.profileURL.toLowerCase().includes(term);
        const contactMatch =
          candidate.contact &&
          candidate.contact.toLowerCase().includes(term);
        const emailMatch =
          candidate.email &&
          candidate.email.toLowerCase().includes(term);


        // Check if any of the fields match the current search term
        return (
          firstNameMatch || lastNameMatch || profileURLMatch || contactMatch || emailMatch
        );
      });
    });

    // Update the state to re-render with filtered candidates
    setFilteredMainviewProfiles(filteredCandidates);
  };



  //===== getlabels start =====

  const getTalentMatchChipLabel = talentMatch => {
    if (talentMatch > 0.85) {
      return { chipType: "high-plus", label: "High+" };
    }
    if (talentMatch >= 0.75 && talentMatch <= 0.85) {
      return { chipType: "high-talent", label: "High" };
    }
    if (talentMatch >= 0.65 && talentMatch < 0.75) {
      return { chipType: "medium-talent", label: "Medium" };
    }
    if (talentMatch < 0.65) {
      return { chipType: "low-talent", label: "Low" };
    }
  };

  const getTeamCompatibilityLabel = teamCompatibility => {
    teamCompatibility = teamCompatibility * 100;
    if (teamCompatibility > 85) {
      return { chipType: "success", label: "High+" };
    }
    if (teamCompatibility >= 75 && teamCompatibility <= 85) {
      return { chipType: "success", label: "High" };
    }
    if (teamCompatibility >= 65 && teamCompatibility < 75) {
      return { chipType: "warning", label: "Medium" };
    }
    if (teamCompatibility < 65) {
      return { chipType: "error", label: "Low" };
    }
  };

  const getCulturalMatchLabel = inputString => {
    switch (inputString) {
      case "low":
        return "Low";
      case "Low":
        return "Low";
      case "medium":
        return "Mid";
      case "Medium":
        return "Mid";
      case "high":
        return "High"
      case "High":
        return "High"
      case "High+":
        return "High+";
      case "high+":
        return "High+";
      default:
        return null; // You can choose an appropriate default value or handle the case as needed
    }
  };

  function getCultureMatchChipType(cultureMatch) {
    if (cultureMatch === "low" || cultureMatch === "Low") {
      return "error";
    } else if (cultureMatch === "medium" || cultureMatch === "med" || cultureMatch === "Medium") {
      return "warning";
    } else if (cultureMatch === "high" || cultureMatch === "high+" || cultureMatch === "High" || cultureMatch === "High+") {
      return "success";
    } else {
      return null; // You can choose an appropriate default value or handle the case as needed
    }
  }

  //===== getlabels end =====

  function convertLevelToNumber(inputString) {
    const lowerCaseInput = inputString?.toLowerCase();

    switch (lowerCaseInput) {
      case "low":
      case "Low":
        return 1;
      case "medium":
      case "med":
      case "Medium":
        return 2;
      case "high":
        return 3;
      case "high+":
        return 4;
      default:
        return null; // You can choose an appropriate default value or handle the case as needed
    }
  }

  // Get tech ratings

  // useEffect(() => {
  //   const getTechRating = async () => {
  //     mainViewProfiles?.map(async (can, index) => {
  //       if (can?.interviewInvited && mainViewProfiles?.length > 0 && jobId) {
  // await handleGetTechnicalRating(jobId, can?.email);
  //       }
  //     });
  //   };
  //   getTechRating();
  // }, [mainViewProfiles, jobId]);

  useEffect(() => {
    // Save the value to localStorage whenever it changes
    setSessionStorage("desiredWeight", JSON.stringify(desiredWeight));
  }, [desiredWeight]);

  useEffect(() => {
    const storedJobId = getSessionStorage("ids");
    const big5 = JSON.parse(getSessionStorage("configurations"));
    // const big5S = getSessionStorage("isPsychoSixtyPercent");
    // alert(big5A?.isPsychoAlways)
    setBigfivealways(big5?.isPsychoAlways);
    setBigfivesixty(big5?.isPsychoSixtyPercent);
    // console.log("eraser1",storedJobId)
    // console.log("eraser2",jobId)
    if (storedJobId !== undefined && storedJobId !== JSON.stringify(jobId)) {
      removeSessionStorage("desiredWeight");
      removeSessionStorage("weightsdata");
      setSessionStorage("ids", JSON.stringify(jobId));
    }
  }, [jobId]);

  const handleShowInterviewStatus = () => {
    setShowInterviewStatus(true);
  };

  const getUser = async () => {
    let user = await JSON.parse(getSessionStorage("user"));
    setUser(user);
  };
  // console.log("aaaaaaaaaaappppppppeeee1111", "user.company_id=", user)
  // console.log("aaaaaaaaauuuuuuuuuuuuuu111", companyName)

  useEffect(() => {
    handleGetMainViewProfiles(jobId);
    return () => {
      dispatch(getMainViewProfilesSuccess([]));
    };
  }, [jobId]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user?.company_id) {
      handleGetCompanyNameById(user?.company_id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredMainviewProfiles(mainViewProfiles);
  }, [mainViewProfiles]);

  useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      let res = await getJobById(jobId, access_token);

      if (res) {
        setJob(res.data.job);
      } else {
        //console.log("no response")
      }
    };
    getData();
  }, [jobId]);

  const handleGetProfileImgeBorder = (
    hasFeedback,
    hasVMProReport,
    hasVmLiteReport,
    overallTeamCompatibility,
  ) => {
    const trueCount = [
      hasFeedback,
      hasVMProReport,
      hasVmLiteReport,
      overallTeamCompatibility,
    ].filter(Boolean).length;

    if (trueCount === 1) {
      return 1;
    } else if (trueCount === 2) {
      return 2;
    } else if (trueCount === 3) {
      return 3;
    } else if (trueCount === 4) {
      return 4;
    } else {
      return 0; // This case should not occur, but added for completeness
    }
  };

  const handleAscend = property => {
    let sortedCandidates;
    setSortingText(property);
    if (property === "Name") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return sortOrder.ascending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (property === "Cultural Match") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const valueA = a.culturalMatch?.ConfidenceScoreCandidate || 0;
        const valueB = b.culturalMatch?.ConfidenceScoreCandidate || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else if (property === "Team Dynamics") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        // console.log("mork",a.overallTeamCompatibility)
        const valueA = a.overallTeamCompatibility || 0;
        const valueB = b.overallTeamCompatibility || 0;
        // console.log("nama",valueA,valueB)
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else if (property === "Cognitive Match") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const valueA = a.cognitiveMatch?.percentageMatch || 0;
        const valueB = b.cognitiveMatch?.percentageMatch || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else if (property === "Technical Rating") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const valueA = a.technicalRating || 0;
        const valueB = b.technicalRating || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else if (property === "Talent Match") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const valueA = a.talentMatch || 0;
        const valueB = b.talentMatch || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else if (property === "Candidate Source") {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const sourceA = (a.source || "").toLowerCase();
        const sourceB = (b.source || "").toLowerCase();

        return sortOrder.ascending
          ? sourceA.localeCompare(sourceB)
          : sourceB.localeCompare(sourceA);
      });
    } else {
      sortedCandidates = [...filteredMainviewProfiles].sort((a, b) => {
        const valueA =
          typeof a[property] === "number"
            ? a[property]
            : a[property]
              ? a[property].toLowerCase()
              : "";
        const valueB =
          typeof b[property] === "number"
            ? b[property]
            : b[property]
              ? b[property].toLowerCase()
              : "";
        return sortOrder.ascending
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    setFilteredMainviewProfiles(sortedCandidates);
    setSortOrder({
      column: property,
      ascending: !sortOrder.ascending,
    });
  };

  const handleShowFilter = () => {
    setShowFilter(true);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  // useEffect(() => {
  //   if (filteredMainviewProfiles) {

  //   }
  // }, [filteredMainviewProfiles]);

  useEffect(() => {
    if (filteredMainviewProfiles) {
      filteredMainviewProfiles?.map(async profile => {
        if (profile?.hasVMProReport === false && profile?.userId) {
          let traitResp = await getChallengeByUserId(profile?.userId);
          if (
            traitResp?.status === 200 &&
            profile?.hasVmLiteReport === true &&
            profile?.cognitionInvited === true
          ) {
            let evalRes = await updateHasVmPro(jobId, {
              email: profile?.email,
            });
            if (evalRes?.status === 200) {
              setRefreshPage(true);
            }
          }
        }
      });
      // get talent match score and confidence
      filteredMainviewProfiles?.map(
        ({
          culturalMatch,
          cognitiveMatch,
          technicalRating,
          overallTeamCompatibility,
          _id: evaluationId,
          talentMatch,
        }) => {
          // console.log("eraser", desiredWeight)
          handleGetTalentMatch(jobId, evaluationId, desiredWeight);
        },
      );
    }
  }, [filteredMainviewProfiles, desiredWeight]);

  useEffect(() => { }, [refreshPage]);

  // To check and put VMPRO report
  // ****************
  // to show pull report if user has played all games
  const handleShowPopup1 = async (datat) => {

    try {
      if (mainViewProfiles !== null && mainViewProfiles.length !== 0) {
        let mais = await Promise.all(mainViewProfiles.map(async (items, index) => {
          try {
            if (items.userId) {
              // let traitsResp = await getTraitsForPlay("661fafb1736ef96a31b156bd");
              // let traitsResp = await getTraitsForPlay("6674648a223edb51c9adfc39");
              // let traitsResp = await getTraitsForPlay("65a4de277369c7ef436bdebc");
              let traitsResp = await getTraitsForPlay(items.userId);
              // console.log(items.email, "aaaaaaaaaaaaaaaaatraithhhh", traitsResp)
              // console.log("aaaaaaaaaaaaaaaaatraithhhh1", traitsResp?.data?.traits[0]?.values)
              let unfinishedTraits = traitsResp?.data?.traits[0]?.values;
              let unfinishedcounter = 0;
              if (traitsResp?.data?.traits[0]?.values) {
                unfinishedTraits.map((data) => {
                  if (data === "Learning Agiltiy") {

                  } else {
                    unfinishedcounter++
                  }
                })
              }
              if (unfinishedcounter) {
                // console.log("aaaaaaaaaaaaaaaeeeeqqqqqqcounter", unfinishedcounter)
                const obj = { pullrep: "notplayedgames", ...items }

                return obj
              } else {
                const obj = { pullrep: "true", ...items }

                return obj
              }

            } else {
              const obj = { pullrep: "falsenouserId", ...items }

              return obj
            }

          } catch (error) {
            const obj = { pullrep: "error", ...items }

            return obj
          }
        }
        ))
        // console.log("aaaaaaaaaaaaaaaamais", mais)
        setMains(mais);

      }//mainvieprofile map

    } catch (error) {
      // console.log("aaaaaaaaaerror", error)
      const obj = { pullrep: "error", ...items }

      return obj
    }

  }
  useEffect(() => {
    handleShowPopup1();
  }, [mainViewProfiles])
  // ***************

  const handleSelectCandidatesForList = (e, candidate) => {
    if (e.target.checked) {
      setSelectedCandidatesForList(prev => [...prev, candidate]);
    } else {
      setSelectedCandidatesForList(prev => prev.filter(c => c._id !== candidate._id));
    }
  }

  const uncheckBoxesFunc = (data) => {
    setUncheckBoxes(data);
    setSelectedCandidatesForList([])
  }


  const style = {
    CheckboxClass: {
      padding: 0,
      '&.Mui-checked': {
        color: "#228276",
      }
    }
  }



  return (
    <>
      {showInterviewStatus ? (
        <InterviewStatusComponent
          jobId={jobId}
          setShowInterviewStatus={setShowInterviewStatus}
        />
      ) : null}
      {showEditWeightage ? (
        <EditWeightageComponent
          setShowEditWeightage={setShowEditWeightage}
          setDesiredWeight={setDesiredWeight}
        />
      ) : null}
      {showCustomizeView ? (
        <CustomizeViewComponent
          items={items}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          setShowCustomizeView={setShowCustomizeView}
        />
      ) : null}
      {
        showManageList || manageListShare ? (
          <ManageListComponent setManageListShare={setManageListShare} setShowManageList={setShowManageList} selectedCandidatesForList={selectedCandidatesForList} setUncheckBoxes={uncheckBoxesFunc} />) : null
      }
      {!isOnClickTagView ? (
        <div className={styles.Wrapper}>
          <PreEvaluationDashboardMenu
            setShowManageList={setShowManageList}
            setShowCustomizeView={setShowCustomizeView}
            setShowEditWeightage={setShowEditWeightage}
            filteredMainviewProfiles={filteredMainviewProfiles}
            handleFilter={handleSearch}
            setFilteredMainviewProfiles={setFilteredMainviewProfiles}
            setShowFilter={setShowFilter}
            showFilter={showFilter}
          />
          <div
            className={styles.ViewInterviewStatusWrapper}
          >
            <span className={styles.ViewInterviewStatus}
              onClick={handleShowInterviewStatus}>View interview status</span>
          </div>
          {(isGetMainViewProfilesLoading &&
            (!mainViewProfiles || mainViewProfiles.length === 0)) ||
            loading ? (
            <Loader />
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.Table}>
                <thead>
                  <tr className={styles.TableHeadingRow}>
                    {tableHeader.map(({ text, icon }, index) => (
                      <td
                        key={index}
                        className={`${styles.TableHeadingCell} ${text === "Talent Match" ? styles.TalentMatchHeadingCell : ""
                          }`}
                      >
                        <div className={styles.TableHeadingWrapper}>
                          {text === "Talent Match" ? (
                            <img src={SortIconWhite} onClick={() => handleAscend(text)}
                              style={{ cursor: "pointer" }} alt="" />
                          ) : (
                            <img src={sortingText === text ? sortingIcon : SortIcon} onClick={() => handleAscend(text)}
                              style={{ cursor: "pointer" }} alt="" />
                          )}
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <span className={styles.TableHeadingText}>{text}</span>
                            <span className={styles.TableHeadingIcon}><img src={icon ? icon : ""} /></span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredMainviewProfiles
                    ? filteredMainviewProfiles?.map(
                      (
                        {
                          _id,
                          firstName,
                          lastName,
                          email,
                          cultureScore,
                          cognitiveScore,
                          technicalScore,
                          talentMatch,
                          cognitiveMatch,
                          phoneNo,
                          linkedinURL,
                          linkedinUrl,
                          _id: evaluationId,
                          interviewInvited,
                          cognitionInvited,
                          technicalRating,
                          overallTeamCompatibility,
                          hasTeamDynamicReport,
                          linkedinurlkey,
                          culturalMatch,
                          cultureInvited,
                          totalExp,
                          userId,
                          source,
                          talentMatchConfidence,
                          teamDynamicsConfidence,
                          indiProfileData,
                          experience,
                          userImage,
                          indiProfileId,
                          linkedinUrlKey,
                          hasFeedback,
                          hasVMProReport,
                          hasVmLiteReport,
                          tags,
                          isEnoughDataAvailable,
                          psychJobStatus,
                          checked
                        },
                        index,
                      ) => {
                        // Initialize variable to track success status

                        // Call the asynchronous function

                        return (
                          <tr
                            key={index}
                            onMouseEnter={() => setHoveredCandidateIndex(index)}>
                            {/* name and role cell */}
                            <td className="px-0">
                              <div className="w-full flex items-center justify-center">
                                <Checkbox sx={style.CheckboxClass} onChange={(e) => handleSelectCandidatesForList(e, filteredMainviewProfiles[index])} checked={checked}></Checkbox>
                              </div>
                            </td>
                            <td
                              className={styles.UserInfoCell}
                              style={{ width: "20%", cursor: "pointer" }}
                              onClick={() => {
                                handleTagView({
                                  firstName,
                                  lastName,
                                  email,
                                  cultureScore,
                                  cognitiveScore,
                                  technicalScore,
                                  talentMatch,
                                  cognitiveMatch,
                                  phoneNo,
                                  linkedinURL,
                                  linkedinUrl,
                                  evaluationId,
                                  interviewInvited,
                                  cognitionInvited,
                                  technicalRating,
                                  overallTeamCompatibility,
                                  hasTeamDynamicReport,
                                  linkedinurlkey,
                                  culturalMatch,
                                  cultureInvited,
                                  totalExp,
                                  userId,
                                  source,
                                  talentMatchConfidence,
                                  teamDynamicsConfidence,
                                  indiProfileData,
                                  experience,
                                  userImage,
                                  indiProfileId,
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                });
                                setHighlightedCandidateIndex(index);
                              }}>
                              <div
                                className={`flex flex-row gap-4 ${styles.userDPandInfoWrapper}`}>
                                {handleGetProfileImgeBorder(
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                  overallTeamCompatibility > 0 ? 1 : 0,
                                ) === 1 && (
                                    <div className={styles.Circle}>
                                      <img
                                        className="object-contain"
                                        src={userImage ? userImage : Avatar}
                                        alt=""></img>
                                    </div>
                                  )}
                                {handleGetProfileImgeBorder(
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                  overallTeamCompatibility > 0 ? 1 : 0,
                                ) === 2 && (
                                    <div className={styles.Circle}>
                                      <ul className={styles.Lines}>
                                        <li></li>
                                        <li style={{ transform: "rotate(-90deg)" }}></li>
                                      </ul>
                                      <img
                                        className="object-contain"
                                        src={userImage ? userImage : Avatar}
                                        alt=""></img>
                                    </div>
                                  )}
                                {handleGetProfileImgeBorder(
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                  overallTeamCompatibility > 0 ? 1 : 0,
                                ) === 3 && (
                                    <div className={styles.Circle}>
                                      <ul className={styles.Lines}>
                                        <li></li>
                                        <li></li>
                                        <li></li>
                                      </ul>
                                      <img
                                        className="object-contain"
                                        src={userImage ? userImage : Avatar}
                                        alt=""></img>
                                    </div>
                                  )}
                                {handleGetProfileImgeBorder(
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                  overallTeamCompatibility > 0 ? 1 : 0,
                                ) === 4 && (
                                    <div className={styles.Circle}>
                                      <ul className={styles.Lines}>
                                        {/* <li></li>
                                    <li
                                       style={{ transform: "rotate(-90deg)" }}
                                    ></li>
                                    <li
                                      style={{ transform: "rotate(90deg)" }}
                                    ></li>
                                    <li></li> */}
                                        <li style={{ transform: "rotate(0deg)" }}></li>
                                        <li style={{ transform: "rotate(90deg)" }}></li>
                                        <li style={{ transform: "rotate(180deg)" }}></li>
                                        <li style={{ transform: "rotate(270deg)" }}></li>
                                      </ul>
                                      <img
                                        className="object-contain"
                                        src={userImage ? userImage : Avatar}
                                        alt=""></img>
                                    </div>
                                  )}
                                {handleGetProfileImgeBorder(
                                  hasFeedback,
                                  hasVMProReport,
                                  hasVmLiteReport,
                                  overallTeamCompatibility > 0 ? 1 : 0,
                                ) === 0 && (
                                    <div className={styles.UserDp}>
                                      <img
                                        className={`object-contain ${styles.UserDp}`}
                                        src={userImage ? userImage : Avatar}
                                        alt=""></img>
                                    </div>
                                  )}

                                <div className="flex flex-col items-start">
                                  <button className="">
                                    {firstName} {lastName}
                                  </button>
                                  {indiProfileData && indiProfileData?.length > 0 ? (
                                    <p className="text-sm">
                                      {indiProfileData[0]?.title} ,{" "}
                                      {indiProfileData[0]?.organization}
                                    </p>
                                  ) : experience && experience?.length > 0 ? (
                                    <p className="text-sm">
                                      {experience[0]?.title} ,{" "}
                                      {experience[0]?.company_name}
                                    </p>
                                  ) : null}
                                  <div
                                    className=""
                                    style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                                    {/* {role} , {company} */}
                                  </div>
                                  {/* <div className={styles.ChipsWrapper}>
                      <CustomChip customClass={styles.ChipsCustomClass} label={"Vm lite"} />
                      <CustomChip customClass={styles.ChipsCustomClass} label={"Vm pro"} />
                      <CustomChip customClass={styles.ChipsCustomClass} label={"Interview"} />
                    </div> */}
                                </div>
                              </div>
                            </td>
                            {/* culture match cell */}
                            <td
                              className={`${styles.TextAlignCenter} ${checkedItems["Cultural Match"] ? "" : styles.Overlay
                                }`}
                              style={{ width: "12%" }}>
                              {checkedItems["Cultural Match"] ? (
                                culturalMatch ? (
                                  // false ? (

                                  <div className="flex flex-row items-center justify-center">
                                    <div
                                      className={`${culturalMatch?.ConfidenceScoreCandidate <= bigfivesixty ? "flex" : "hidden"
                                        } flex-row items-start pr-2`}
                                    >
                                      <PsychometryInviteButton
                                        firstName={firstName}
                                        lastName={lastName}
                                        email={email}
                                        contact={phoneNo}
                                        linkedinURL={linkedinUrl}
                                        evaluationId={evaluationId}
                                        indiProfileId={indiProfileId}
                                        companyId={user?.company_id}
                                        // companyId={externalCompanyId ? externalCompanyId : user?.company_id}
                                        psychometryInvited={cultureInvited}
                                        candidateUserId={_id}
                                        action={213}
                                        jobId={job?._id}
                                        cult={culturalMatch?.FlippedMatch}
                                      />
                                    </div>

                                    {/* Use a placeholder when PsychometryInviteButton is hidden */}
                                    {culturalMatch?.ConfidenceScoreCandidate >= bigfivesixty && (
                                      <div ></div>//className="pr-2" style={{ minWidth: '50px' }}
                                    )}
                                    <CustomChip
                                      customClass={styles.FontWeight600}
                                      label={getCulturalMatchLabel(culturalMatch?.FlippedMatch)}
                                      type={getCultureMatchChipType(culturalMatch?.FlippedMatch)}
                                    />
                                    <ConfidenceMarker
                                      confidence={culturalMatch?.ConfidenceScoreCandidate}
                                      dataToolTipId={`cultureMatchTip${index}`}
                                    />
                                    <Tooltip
                                      id={`cultureMatchTip${index}`}
                                      content={`Data confidence: ${culturalMatch?.ConfidenceScoreCandidate}%`}
                                    />
                                  </div>

                                ) : isCultureCellLoading[evaluationId] ||
                                  (isCultureCellLoading[evaluationId] &&

                                    isGetMainViewProfilesLoading)
                                  ? <Loader />
                                  : isEnoughDataAvailable && psychJobStatus === 'FETCH_EXECUTED'
                                    ? (

                                      bigfivealways ? (
                                        // false ? (
                                        <PsychometryInviteButton
                                          firstName={firstName}
                                          lastName={lastName}
                                          email={email}
                                          contact={phoneNo}
                                          linkedinURL={linkedinUrl}
                                          evaluationId={evaluationId}
                                          indiProfileId={indiProfileId}
                                          psychometryInvited={cultureInvited}
                                          companyId={user?.company_id}
                                          // companyId={externalCompanyId ? externalCompanyId : user?.company_id}
                                          candidateUserId={_id}
                                          action={213}
                                          jobId={job?._id}
                                        />
                                      ) :
                                        <Button
                                          type={"secondary"}
                                          className={styles.PullBtn}
                                          text={"Pull report"}
                                          onClick={() => {
                                            if (indiProfileId) {
                                              handleShowPopup(
                                                {
                                                  firstName: firstName,
                                                  lastName: lastName,
                                                  email: email,
                                                  contact: phoneNo,
                                                  linkedinURL: linkedinUrl,
                                                  evaluationId: evaluationId,
                                                  action: 211,
                                                  phoneNo,
                                                  indiProfileId,
                                                  // company_id: user?.company_id,
                                                  company_id: externalCompanyId ? externalCompanyId : user?.company_id

                                                },
                                                true,
                                              );
                                            } else {
                                              notify(
                                                "No data yet, Please try again later",
                                                "error",
                                              );
                                            }
                                          }}
                                        />
                                    )
                                    : (psychJobStatus === 'FETCH_PERMANENT_FAILURE' || psychJobStatus === 'JOB_NOT_CREATED')
                                      ? (!cultureInvited ?
                                        <div className="flex items-center -mx-2 flex-row">
                                          <div className="-mr-1 ml-[0.86rem]">
                                            <PsychometryInviteButton
                                              firstName={firstName}
                                              lastName={lastName}
                                              email={email}
                                              contact={phoneNo}
                                              linkedinURL={linkedinUrl}
                                              evaluationId={evaluationId}
                                              indiProfileId={indiProfileId}
                                              psychometryInvited={cultureInvited}
                                              companyId={user?.company_id}
                                              // companyId={externalCompanyId ? externalCompanyId : user?.company_id}

                                              candidateUserId={_id}
                                              action={213}
                                              jobId={job?._id}
                                            />
                                          </div>
                                          <span className="font-medium mr-2 text-xs italic text-[#d6615a]">
                                            Not enough data
                                          </span>
                                        </div> : (<div className="flex items-center justify-center flex-row">
                                          <span className="font-medium text-xs italic text-[#d6615a]">
                                            Invited
                                          </span>
                                        </div>))
                                      : (<div className="flex items-center justify-center flex-row">
                                        <span className="font-medium -mr-2 text-xs italic text-[#d6615a]">
                                          Pending...
                                        </span>
                                      </div>)
                              ) : (
                                <p className={styles.MatchText}>{"culturalMatch"}</p>
                              )
                              }
                            </td>
                            {/* team compatibility cell */}
                            <td
                              className={`${styles.TextAlignCenter} ${checkedItems["Team Compatibility"] ? "" : styles.Overlay
                                }`}
                              style={{ width: "12%" }}>
                              <>
                                {checkedItems["Team Compatibility"] ? (
                                  hasTeamDynamicReport ? (
                                    <>
                                      <CustomChip
                                        customClass={styles.FontWeight600}
                                        label={
                                          getTeamCompatibilityLabel(
                                            overallTeamCompatibility,
                                          )?.label
                                        }
                                        type={
                                          getTeamCompatibilityLabel(
                                            overallTeamCompatibility,
                                          )?.chipType
                                        }
                                      />
                                      <ConfidenceMarker
                                        confidence={overallTeamCompatibility * 100}
                                        dataToolTipId={`teamMatchId${index}`}
                                      />
                                      <Tooltip
                                        content={`Data confidence: ${overallTeamCompatibility
                                          ? overallTeamCompatibility * 100
                                          : 0
                                          }%`}
                                        id={`teamMatchId${index}`}
                                      />
                                    </>
                                  ) : isTeamCellLoading[evaluationId] ||
                                    (isTeamCellLoading[evaluationId] &&
                                      isGetMainViewProfilesLoading) ? (
                                    <Loader />
                                  ) : isEnoughDataAvailable && psychJobStatus === 'FETCH_EXECUTED' ? (
                                    <>
                                      <Button
                                        className={styles.PullBtn}
                                        text={"Pull report"}
                                        onClick={() => {
                                          handleShowPopup(
                                            {
                                              firstName: firstName,
                                              lastName: lastName,
                                              email: email,
                                              contact: phoneNo,
                                              linkedinURL: linkedinUrl,
                                              evaluationId: evaluationId,
                                              action: 212,
                                              phoneNo,
                                              indiProfileId,
                                              // company_id: user?.company_id,
                                              company_id: externalCompanyId ? externalCompanyId : user?.company_id,
                                            },
                                            true,
                                          );
                                        }}
                                      />

                                    </>
                                  ) : (psychJobStatus === 'FETCH_PERMANENT_FAILURE' || psychJobStatus === 'JOB_NOT_CREATED')
                                    ? (
                                      <span className={styles.NodataText}>
                                        Not enough data
                                      </span>
                                    ) : (<span className={styles.NodataText}>
                                      Pending...
                                    </span>)
                                ) : (
                                  <p className={styles.MatchText}>
                                    {"teamCompatibility"}
                                  </p>
                                )}
                              </>
                            </td>
                            {/* cognitive match cell */}
                            <td
                              className={`${styles.TextAlignCenter} ${checkedItems["Cognitive Match"] ? "" : styles.Overlay
                                }`}
                              style={{ width: "12%" }}>
                              {checkedItems["Cognitive Match"] ? (
                                // cognitiveMatch 
                                mains?.map((value) => {
                                  if (value.email === email) {

                                    return (cognitiveMatch)//value.pullrep === "true" && 
                                      ? (
                                        <>
                                          <CustomChip
                                            label={
                                              cognitiveMatch?.percentageClass
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                              cognitiveMatch?.percentageClass?.slice(1)
                                            }
                                            type={getCultureMatchChipType(
                                              cognitiveMatch?.percentageClass,
                                            )}
                                          />
                                          <ConfidenceMarker
                                            confidence={cognitiveMatch?.Confidence}
                                            dataToolTipId={`cognitiveMatchTip${index}`}
                                          />
                                          {cognitiveMatch?.Confidence ? (
                                            <Tooltip
                                              id={`cognitiveMatchTip${index}`}
                                              content={`Data confidence: ${cognitiveMatch?.Confidence}%`}
                                            />
                                          ) : null}
                                        </>
                                      ) : !cognitionInvited ? (
                                        isCogCellLoading[evaluationId] &&
                                          isInviteCandidateForCognitiveLoading ? (
                                          <Loader />
                                        ) : (
                                          // <Button
                                          //   className={styles.PullBtn}
                                          //   text={"Invite"}
                                          //   onClick={() => {
                                          //     handleShowPopup(
                                          //       {
                                          //         firstName: firstName,
                                          //         lastName: lastName,
                                          //         email: email,
                                          //         contact: phoneNo,
                                          //         linkedinURL: linkedinUrl,
                                          //         evaluationId: evaluationId,
                                          //         action: 3,
                                          //         phoneNo,
                                          //         company_id: user?.company_id,
                                          //       },
                                          //       true,
                                          //     );
                                          //   }}
                                          // />

                                          // **************

                                          mains?.map((value) => {
                                            if (value.email === email) {
                                              // return (value.pullrep === "undefined" || value.pullrep === "false")
                                              // return true
                                              return (value.pullrep === "true")
                                                ?
                                                <div>
                                                  <Button
                                                    className={styles.PullBtn}
                                                    text={"Pull report"}
                                                    onClick={() => {
                                                      handleShowPopup(
                                                        {
                                                          firstName: firstName,
                                                          lastName: lastName,
                                                          email: email,
                                                          contact: phoneNo,
                                                          linkedinURL: linkedinUrl,
                                                          evaluationId: evaluationId,
                                                          action: 3,
                                                          phoneNo,
                                                          company_id: user?.company_id,
                                                        },
                                                        true,
                                                      );
                                                    }}
                                                  />
                                                </div>
                                                :

                                                <div>

                                                  <Button
                                                    className={styles.PullBtn}
                                                    text={"Invite"}
                                                    onClick={() => {
                                                      handleShowPopup(
                                                        {
                                                          firstName: firstName,
                                                          lastName: lastName,
                                                          email: email,
                                                          contact: phoneNo,
                                                          linkedinURL: linkedinUrl,
                                                          evaluationId: evaluationId,
                                                          action: 3,
                                                          phoneNo,
                                                          company_id: user?.company_id,
                                                        },
                                                        true,
                                                      );
                                                    }}
                                                  />

                                                </div>
                                            }
                                          })
                                          // **************


                                        )
                                      ) : (
                                        <span className={styles.InvitedText}>Invited</span>
                                      )
                                  }
                                })
                              ) : (
                                <p className={styles.MatchText}>{"No data"}</p>
                              )}
                            </td>
                            {/* tech rating cell */}
                            <td
                              className={`${styles.TextAlignCenter} ${styles.TechRatingCell
                                } 
                            ${checkedItems["Technical Rating"] ? "" : styles.Overlay}`}
                              style={{ width: "12%" }}>
                              {checkedItems["Technical Rating"] ? (
                                technicalRating !== undefined &&
                                  typeof technicalRating === "number" &&
                                  technicalRating >= 0 ? (
                                  <>
                                    {new Array(Math.round(technicalRating))
                                      ?.fill(1)
                                      ?.map((_, index) => (
                                        <StarIcon
                                          key={index}
                                          sx={{
                                            color: `${checkedItems["Technical Rating"]
                                              ? "var(--primary-green)"
                                              : "var(--primary-grey)"
                                              }`,
                                            fontSize: "1.2rem",
                                          }}
                                        />
                                      ))}
                                    {Math.round(technicalRating) < 5
                                      ? new Array(Math.round(5 - technicalRating))
                                        ?.fill(1)
                                        ?.map((_, index) => (
                                          <StarIcon
                                            key={index}
                                            sx={{
                                              color: `${checkedItems["Technical Rating"]
                                                ? "var(--border-grey)"
                                                : "var(--primary-grey)"
                                                }`,
                                              fontSize: "1.2rem",
                                            }}
                                          />
                                        ))
                                      : null}
                                  </>
                                ) : interviewInvited ? (
                                  <p className={styles.NodataText}>Invited</p>
                                ) : isInviteCellLoading[evaluationId] &&
                                  isInviteCandidateForInterviewLoading ? (
                                  <Loader />
                                ) : (
                                  <Button
                                    text={"Invite"}
                                    className={styles.PullBtn}
                                    onClick={() => {
                                      handleShowPopup({
                                        firstName: firstName,
                                        lastName: lastName,
                                        email: email,
                                        contact: phoneNo,
                                        linkedinURL: linkedinUrl,
                                        evaluationId: evaluationId,
                                        action: 1,
                                      });
                                    }}
                                  />
                                )
                              ) : (
                                <p className={styles.MatchText}>No data</p>
                              )}
                            </td>
                            <td
                              className={`${styles.TextAlignCenter} ${styles.TalentMatchCell}    `}
                              style={{ width: "15%" }}>
                              {talentMatch ? (
                                <>
                                  <CustomChip
                                    customClass={styles.FontWeight600}
                                    label={getTalentMatchChipLabel(talentMatch)?.label}
                                    type={getTalentMatchChipLabel(talentMatch)?.chipType}
                                  />
                                  <ConfidenceMarker
                                    confidence={talentMatchConfidence * 100}
                                    dataToolTipId={`talentMatchTip${index}`}
                                  />
                                  <Tooltip
                                    id={`talentMatchTip${index}`}
                                    content={`Data confidence: ${(
                                      talentMatchConfidence * 100
                                    ).toFixed(2)}%`}
                                  />
                                </>
                              ) : (
                                <span className={styles.NodataText}>Not enough data</span>
                              )}
                            </td>

                            {/* adding methods */}

                            <td
                              className={`${styles.SourceCell} text-sm text-gray-900 font-medium  whitespace-nowrap`}
                              style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                              <div className={`flex justify-end pr-2 gap-1 ${""}`}>
                                {source}
                              </div>
                            </td>

                            <td
                              className={`${styles.SourceCell} text-sm text-gray-900 font-medium pr-2 whitespace-nowrap`}
                              style={{ color: "rgba(51, 51, 51, 0.5)" }}>
                              {/* {hoveredCandidateIndex === index ? ( */}
                              {
                                <div className={`${styles.AddingMethodContentWrapper}`}>
                                  <Popover>
                                    <Popover.Button
                                      className={styles.SelectPopoverButton}
                                      onClick={() => setPopoverOpen(true)}
                                    // onBlur={() => setPopoverOpen(false)}
                                    >
                                      {/* Select */}
                                      {tags?.some(tag => tag.tagname === "Not a fit")
                                        ? "Not a fit"
                                        : tags?.some(tag => tag.tagname === "May be")
                                          ? "May be"
                                          : "Select"}

                                      <ArrowDropDownIcon fontSize="small" />
                                    </Popover.Button>
                                    <Popover.Panel
                                      className={styles.SelectPopoverPanel}
                                      style={{
                                        display: isPopoverOpen ? "block" : "none",
                                      }}>
                                      <ul>
                                        <li
                                          className={`${false && styles.SelectedClass} ${styles.Options
                                            } ${styles.CursorPointer} text-black`}
                                          onClick={() => {
                                            if (
                                              !tags?.some(
                                                tag => tag.tagname === "Not a fit",
                                              )
                                            ) {
                                              handleAddCustomTag(evaluationId, "May be");
                                              setPopoverOpen(false);
                                            } else {
                                              const notAFitTag = tags?.find(
                                                tag => tag.tagname === "Not a fit",
                                              );

                                              // If the tag is found, delete it using handleDeleteChip
                                              if (notAFitTag) {
                                                handleDeleteChip(
                                                  evaluationId,
                                                  notAFitTag._id,
                                                );
                                              }
                                              handleAddCustomTag(evaluationId, "May be");
                                              setPopoverOpen(false);
                                            }
                                          }}>
                                          May be
                                        </li>
                                        <li
                                          className={`${false && styles.SelectedClass} ${styles.Options
                                            } ${styles.CursorPointer} text-black`}
                                          onClick={() => {
                                            if (
                                              !tags?.some(tag => tag.tagname === "May be")
                                            ) {
                                              handleAddCustomTag(
                                                evaluationId,
                                                "Not a fit",
                                              );
                                              setPopoverOpen(false);
                                            } else {
                                              const notAFitTag = tags?.find(
                                                tag => tag.tagname === "May be",
                                              );

                                              // If the tag is found, delete it using handleDeleteChip
                                              if (notAFitTag) {
                                                handleDeleteChip(
                                                  evaluationId,
                                                  notAFitTag._id,
                                                );
                                              }
                                              handleAddCustomTag(
                                                evaluationId,
                                                "Not a fit",
                                              );
                                              setPopoverOpen(false);
                                            }
                                          }}>
                                          Not a fit
                                        </li>
                                      </ul>
                                    </Popover.Panel>
                                  </Popover>
                                  <Popover
                                    className={`relative  text-sm  ${styles.Popover}`}>
                                    <Popover.Button
                                      className="focus:outline-0  border-none rounded-xl text-[#888888]"
                                      onClick={() => setPopoverVisible(true)}>
                                      <BiDotsVerticalRounded className="m-auto" />
                                    </Popover.Button>
                                    <Popover.Panel
                                      className={`absolute z-10 w-full flex flex-col ${styles.OnSelectMenu}`}
                                      style={{
                                        display: isPopoverVisible ? "block" : "none",
                                      }}>
                                      <div
                                        className={`overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 ${styles.OnSelectMenuWrapper}`}>
                                        <div
                                          className={`flex items-center text-gray-800 w-full gap-2 ${styles.PopoverBtnClass} ${styles.CursorPointer}`}
                                          onClick={handleShowEnterTagName}>
                                          <AddCircleIcon
                                            sx={{
                                              fontSize: "20px",
                                              color: "var(--dark-grey)",
                                            }}
                                          />
                                          <span
                                            className="font-semibold rounded-xl flex w-full justify-left"
                                            href="/">
                                            Add custom tag
                                          </span>
                                        </div>
                                        {showEnterTagName ? (
                                          <div
                                            className={`${styles.AddCustomTagPopover}`}>
                                            <span className={styles.EnterTagText}>
                                              Enter tag name
                                            </span>
                                            <CustomInput
                                              placeholder={"Tag name"}
                                              onChange={handleChange}
                                            />
                                            <div className={styles.BtnWrapper}>
                                              <Button
                                                btnType={"primary"}
                                                text={"Create"}
                                                onClick={() =>
                                                  handleAddCustomTag(
                                                    evaluationId,
                                                    customTagName,
                                                  )
                                                }
                                              />
                                              <Button
                                                btnType={"secondary"}
                                                text={"Cancel"}
                                                onClick={handleCancel}
                                              />
                                            </div>
                                          </div>
                                        ) : null}
                                        <div
                                          className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.CursorPointer}`}>
                                          <RemoveRedEyeIcon
                                            sx={{
                                              fontSize: "20px",
                                              color: "var(--dark-grey)",
                                            }}
                                          />
                                          <span
                                            className="font-semibold rounded-xl flex w-full justify-left"
                                            href="/"
                                            // onClick={() => handleVDetails(candidate)}
                                            onClick={() =>
                                              handleTagView({
                                                firstName,
                                                lastName,
                                                email,
                                                cultureScore,
                                                cognitiveScore,
                                                technicalScore,
                                                talentMatch,
                                                cognitiveMatch,
                                                phoneNo,
                                                linkedinURL,
                                                linkedinUrl,
                                                evaluationId,
                                                interviewInvited,
                                                cognitionInvited,
                                                technicalRating,
                                                overallTeamCompatibility,
                                                linkedinurlkey,
                                                culturalMatch,
                                                totalExp,
                                                userId,
                                                source,
                                                talentMatchConfidence,
                                                teamDynamicsConfidence,
                                                indiProfileData,
                                                experience,
                                                userImage,
                                                indiProfileId,
                                                hasFeedback,
                                                hasVMProReport,
                                                hasVmLiteReport,
                                                hasTeamDynamicReport,
                                              })
                                            }>
                                            View details
                                          </span>
                                        </div>
                                        <div
                                          className={`flex items-center text-gray-800 space-x-2 w-full ${styles.PopoverBtnClass} ${styles.RemovePopoverBtnClass} ${styles.CursorPointer}`}
                                          onClick={() =>
                                            handleRemoveCandidate(evaluationId)
                                          }>
                                          <DeleteIcon
                                            sx={{
                                              fontSize: "20px",
                                              color: "var(--red-error)",
                                            }}
                                          />
                                          <span className="font-semibold rounded-xl flex w-full justify-left">
                                            Remove
                                          </span>
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Popover>
                                </div>
                              }
                              {/* // ) : ( */}

                              {/* )} */}
                            </td>
                          </tr>
                        );
                      },
                    )
                    : null}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // onclick view
        <div className={styles.SectionWrapper}>
          <div className={styles.LeftSection} style={{ position: "relative" }}>
            {showFilter ? (
              <FilterComponent
                setFilteredCandidates={setFilteredMainviewProfiles}
                filteredCandidates={filteredMainviewProfiles}
                setShowFilter={setShowFilter}
              />
            ) : null}
            <div
              className={` ${styles.DashboardMenu}`}
              style={{
                backgroundColor: "#FFFFFF",
                gap: "1.3rem",
              }}>
              <div className={styles.SearchWrapper}>
                <div className={styles.CandidateHeadingWrapper}>
                  <span className={styles.CandidateHeading}>Candidates</span>
                  <span className={styles.Dot}>.</span>
                  <span className={styles.CandidateNumber}>
                    {filteredMainviewProfiles?.length}
                  </span>
                </div>
                {/* <Divider orientation="vertical" /> */}
                <div>
                  <div className={styles.inputIcons}>
                    {/* <i className={`fa fa-search ${styles.icon}`}></i> */}
                    <CustomInput
                      className={styles.inputField}
                      type="text"
                      placeholder="Search candidate"
                      onChange={e => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.MenuWrapper}>
                <img
                  src={Filter}
                  alt="filter"
                  className={styles.FilterImg}
                  onClick={handleShowFilter}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div
              className={styles.InterviewStatusWrapper}
              style={{ background: "linear-gradient(0deg, #FAFAFA, #FAFAFA)" }}
            >
              <span className={styles.InterviewStatus}
                onClick={handleShowInterviewStatus}>View Interview Status</span>
            </div>
            <div className={`w-[100%] ${styles.HeadingRow} `}>
              <div
                scope="col"
                className="text-sm font-medium text-[#888888]"
              >
                <div
                  className="flex flex-row gap-1 items-center px-1 py-2"
                  style={{
                    background: "linear-gradient(0deg, #E3E3E3, #E3E3E3)",
                  }}>
                  <div className={styles.IconWrapper} onClick={() => handleAscend("Name")}
                    style={{ cursor: "pointer" }}>
                    <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                    <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                  </div>
                  <div>Name</div>
                </div>
              </div>
            </div>

            <div className={styles.CandidateDetailsWrapper}>
              <table className={styles.TeamTable}>
                {showTableHeader ? (
                  <thead className="bg-white border-b px-2 py-2">
                    <tr className={`w-[100%] ${styles.HeadingRow} `}>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#888888]"
                        onClick={() => handleAscend("Name")}
                        style={{ cursor: "pointer" }}>
                        <div
                          className="flex flex-row gap-1 items-center px-1 py-2"
                          style={{
                            background: "linear-gradient(0deg, #E3E3E3, #E3E3E3)",
                          }}>
                          <div className={styles.IconWrapper}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div>Name</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {filteredMainviewProfiles?.map((candidate, index) => {
                    return (
                      <MainViewOnClickCandidateRow
                        candidate={candidate}
                        index={index}
                        showStatus={false}
                        showCheckbox={false}
                        showAddingMethod={false}
                        showEllipsisMenu={true}
                        showCandidateChips={true}
                        showTalentMatch={false}
                        showTags={false}
                        showSourceAdded={true}
                        isTeamDynamics={true}
                        showTalent={true}
                        customClass={styles.RowCustomClass}
                        handleShowReport={handleTagView}
                        highlightedCandidateIndex={highlightedCandidateIndex}
                        setHighlightedCandidateIndex={setHighlightedCandidateIndex}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.RightSection}>
            {/* <ReportHeaderComponent
              // chipsData={chipsData}
              showSelectReport={false}
            /> */}
            <ReportComponent
              selectedCandidate={selectedCandidate}
              handleSectionClose={handleSectionClose}
              handleTagChange={handleTagChange}
              isMainView={true}
              setIsOnClickTagView={setIsOnClickTagView}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MainViewComponent;
