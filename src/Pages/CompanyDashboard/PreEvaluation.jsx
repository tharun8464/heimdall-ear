import { useEffect, useState } from "react";
import NewCompanySideBar from "../../Components/CompanyDashboard/NewCompanySideBar/NewCompanySideBar";
import CandidateEvaluationDashboard from "../../Components/CompanyDashboard/PreEvaluationComponents/CandidateEvaluationDashboard/CandidateEvaluationDashboard";
import PreEvaluationMenu from "../../Components/CompanyDashboard/PreEvaluationComponents/PreEvaluationMenu/PreEvaluationMenu";
import EvaluationReportsComponent from "../../Components/CompanyDashboard/PreEvaluationComponents/EvaluationReportsComponent/EvaluationReportsComponent";
import MainViewComponent from "../../Components/CompanyDashboard/PreEvaluationComponents/MainViewComponent/MainViewComponent";
import styles from "../../assets/stylesheet/preEvaluation.module.css";
import AddCandidatesComponent from "../../Components/CompanyDashboard/PreEvaluationComponents/AddCandidatesComponent/AddCandidatesComponent";
import usePreEvaluation from "../../Hooks/usePreEvaluation";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import useNewBaselining from "../../Hooks/useNewBaselining";
import TeamCompatibilityComponent from "../../Components/TeamCompatibilityComponent/TeamCompatibilityComponent";
import Sidebar from "../../Components/CompanyDashboard/Sidebar";
import NewNavbar from "../../Components/UserDashboard/NewNavbar/NewNavbar";
import Navbar from "../../Components/CompanyDashboard/Navbar";
import { useLocation } from 'react-router-dom';
import Loader from "../../Components/Loader/Loader";
import { getJobById } from "../../service/api";
import getStorage from "../../service/storageService";
import { notify } from "../../utils/notify";
import TopBar from "../../Components/Global/TopBar.jsx";
import { ControlsProvider } from '../../Components/Global/controlsContext';
import Navigation from "../../Components/Global/Navigation.jsx";
import CompanyNavaigationObject from "../CompanyDashboard/CompanyNavigationObject.js";

const PreEvaluation = () => {


  const [viewType, setViewType] = useState("main");
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const { handleGetHeimdallToken } = useNewBaselining();
  const [sections, setSections] = useState(1);
  const { id: jobId } = useParams();
  const [job, setJob] = useState();
  // console.log("id:", jobId);
  const { handleGetBestProfiles, handleGetMainViewProfiles } =
    usePreEvaluation();

  const { bestProfiles } = useSelector((state) => state.preEvaluation);
  const { mainViewProfiles, isGetMainViewProfilesLoading } = useSelector((state) => state.preEvaluation);
  const [selectedCandidatesForList, setSelectedCandidatesForList] = useState([])
  const [candidateLinkedinRequired, setCandidateLinkedinRequired] = useState(false)
  const [manageListShare, setManageListShare] = useState(false);
  const [uncheckBoxes, setUncheckBoxes] = useState('');


  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (selectedTab) => {
    setIsLoading(true);

    // Simulate data loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout duration based on your actual data loading time

    // Perform other actions related to tab change
    // Example: set the selected tab in state
  };

  useEffect(() => {
    // You can use this useEffect to trigger any additional actions when isLoading changes
    // For example, fetching data when isLoading becomes false
    if (!isLoading) {
      // Fetch data or perform actions here
    }
  }, [isLoading]);

  useEffect(() => {
    handleGetBestProfiles(jobId);
    handleGetMainViewProfiles(jobId);
  }, [jobId]);
  //console.log("mainly",mainViewProfiles)
  useEffect(() => {
    handleGetHeimdallToken();
  }, [jobId]);


  useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = getStorage("access_token");
      let res = await getJobById(jobId, access_token);
      if (res) {
        if (res.data.job?.isCandidateLinkedinRequired === true || res.data.job?.isCandidateLinkedinRequired === false) {
          setCandidateLinkedinRequired(res.data.job.isCandidateLinkedinRequired)
        }
        else {
          setCandidateLinkedinRequired(true)
        }
        setJob(res.data.job);
      } else {
        notify(`Tokin Expired please login again`, "error");
      }
    };
    getData();
  }, [jobId]);

  const uncheckBoxesFunc = (data) => {
    setUncheckBoxes(data);
  }
  useEffect(() => {
    if (uncheckBoxes === 'uncheckAllBoxes') setUncheckBoxes('');
  }, [uncheckBoxes]);


  return (
    <ControlsProvider>
      <div className="max-w-screen bg-slate-50">
        <div className="w-full">
          <TopBar user={1} />
        </div>
        <div className={"flex w-full fixed"}>
          <div className="apply-overlay">&nbsp;</div>
          <Navigation menu={CompanyNavaigationObject?.menu} />
          <div className="flex bg-slate-50 w-full h-full oflowx-scroll">
            <div class="container mx-auto bg-slate-50 p-4">
              <div class="dashboard common-db-content-wrapper bg-white drop-shadow-md rounded-lg">
                <div className={styles.ContentWrapper}>
                  {showAddCandidate ? (
                    <AddCandidatesComponent candidateLinkedinRequired={candidateLinkedinRequired} setShowAddCandidate={setShowAddCandidate} candidateProfiles={mainViewProfiles} />
                  ) : (
                    false
                  )}
                  <PreEvaluationMenu
                    viewType={viewType}
                    setViewType={setViewType}
                    setShowAddCandidate={setShowAddCandidate}
                    handleTabChange={handleTabChange}
                    selectedCandidatesForList={selectedCandidatesForList}
                    manageListShare={manageListShare}
                    setManageListShare={setManageListShare}
                    uncheckBoxes={uncheckBoxes}
                  />
                  <p className="text-md font-bold pb-2 text-gray-500"> {job?.jobTitle}</p>
                  <>
                    {isLoading && <Loader />}

                    {viewType === "tag" && !isLoading ? (
                      <CandidateEvaluationDashboard
                        showTableHeader={true}
                        candidateProfiles={bestProfiles?.data}
                      />
                    ) : null}
                    {viewType === "team" && !isLoading ? (
                      <TeamCompatibilityComponent
                        candidateProfiles={bestProfiles?.data}
                        jobId={jobId}
                      />
                    ) : null}
                    {viewType === "main" && !isLoading ? (
                      <MainViewComponent manageListShare={manageListShare} setManageListShare={setManageListShare} sections={sections} setSelectedCandidatesForList={setSelectedCandidatesForList} selectedCandidatesForList={selectedCandidatesForList} setUncheckBoxes={uncheckBoxesFunc} />
                    ) : null}
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ControlsProvider>
  );
};

export default PreEvaluation;
