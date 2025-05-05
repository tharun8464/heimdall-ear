import { useEffect, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { IoCaretUpSharp } from "react-icons/io5";
import Button from "../Button/Button";
import CandidateDetailsRow from "../CompanyDashboard/PreEvaluationComponents/CandidateDetailsRow/CandidateDetailsRow";
import ReportHeaderComponent from "../CompanyDashboard/PreEvaluationComponents/EvaluationReportsComponent/ReportHeaderComponent/ReportHeaderComponent";
import PreEvaluationDashboardMenu from "../CompanyDashboard/PreEvaluationComponents/PreEvaluationDashboardMenu/PreEvaluationDashboardMenu";
import ManagePodComponent from "./ManagePodComponent/ManagePodComponent";
import styles from "./TeamCompatibilityComponent.module.css";
import TeamDynamicsComponent from "./TeamDynamicsComponent/TeamDynamicsComponent";
import AddPodComponent from "./AddPodComponent/AddPodComponent";
import CompatibilityTableComponent from "./CompatibilityTableComponent/CompatibilityTableComponent";
import Filter from "../../assets/images/Reports/Filter.svg";
import useTeamCompatibility from "../../Hooks/useTeamCompatibility";
import { Divider } from "@mui/material";
import usePod from "../../Hooks/usePod";
import { useSelector } from "react-redux";
import FilterComponent from "../CompanyDashboard/PreEvaluationComponents/CandidateEvaluationDashboard/FilterComponent/FilterComponent";
import PodManagementLaunch from "../PodManagementComponent/PodManagementLaunch";
import CustomInput from "../CustomInput/CustomInput";
import getStorage, { getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";
import usePreEvaluation from "../../Hooks/usePreEvaluation";
const TeamCompatibilityComponent = ({
  candidateProfiles,
  jobId,
  isTeam,
  setCandidate,
  reportRef
}) => {
  const { getTeamDynamicsById } = useTeamCompatibility();
  const { handleGetAllPods } = usePod();
  const [showManagePods, setShowManagePodsPopup] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState(candidateProfiles);
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreatePod] = useState(false);
  const [compatibilityMapState, setCompatibilityMapState] = useState([{}]);
  const { allPodsData: allPodsReduxData } = useSelector(state => state.pod);

  const {
    handleTeamDynamicsConfidence,
    handleCreateTeamCompatibility,
    handleGetMainViewProfiles,
  } = usePreEvaluation();
  // For sorting
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" for ascending, "desc" for descending

  // Team dynamics data
  const [teamData, setTeamData] = useState(null);

  // For candidate data
  const [candidatesData, setCandidatesData] = useState(null);

  // For pods data
  const [podsData, setPodsData] = useState([{}]);

  // All pods

  const [allPods, setAllPods] = useState(null);

  // Clicked pod
  const [loading, setLoading] = useState(false);
  const [clickedPod, setClickedPod] = useState([]);

  const [selectedPods, setSelectedPods] = useState([]);
  const [user, setUser] = useState();
  // selected candidate
  const { mainViewProfiles, isGetMainViewProfilesLoading, companyName, mainViewProf } =
    useSelector(state => state.preEvaluation);
  const [selectedCandidate, setSelectedCandidate] = useState(
    candidateProfiles && candidateProfiles[0] ? candidateProfiles[0] : {},
  );
  const [hasReport, setHasReport] = useState(false);
  const chipsData = [
    { title: "Good Fit", type: "success" },
    { title: "Good Fit", type: "success" },
    { title: "Good Fit", type: "success" },
  ];

  const getUser = async () => {
    let user = await JSON.parse(getSessionStorage("user"));
    setUser(user);
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const initial = async () => {
      await handleGetAllPods(jobId);
    };
    initial();
  }, []);

  useEffect(() => {
    const initial = async () => {
      setPodsData([...allPodsReduxData]);
      const data = allPodsReduxData?.filter(value => value?.isSelected === true);
      setSelectedPods(data.length !== 0 ? data : allPodsReduxData);
      //setAllPods(res);
      setAllPods(data);
    };
    if (allPodsReduxData) {
      initial();
    }
  }, [allPodsReduxData]);

  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      const company_id = user?.company_id;
      const linkedinUrl = isTeam
        ? setCandidate?.profileURL
          ? setCandidate?.profileURL
          : setCandidate?.linkedinUrl
        : selectedCandidate?.profileURL;
      const data = { linkedinUrl, jobId };

      let res = await getTeamDynamicsById(company_id, data);
      setTeamData(res);
      //let res1 = await handleGetAllPods(jobId);
      const filteredPods = res?.summarized?.pods?.filter(pod =>
        podsData?.some(item => item["_id"] === pod["podId"]),
      );

      setClickedPod(filteredPods ? filteredPods : res?.summarized?.pods[0]);
    };
    initial();
  }, [podsData, selectedCandidate, setCandidate, jobId, isTeam]);

  // const filteredPods = teamData?.summarized?.pods
  // .map(pod => pod.podId === podsData?._id ? pod : null)
  // .filter(Boolean);

  // setClickedPod(filteredPods)

  useEffect(() => {
    const updateCompatibilityMapState = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      const company_id = user?.company_id;
      //console.log(Object.values(candidateProfiles[0]?.overallTeamCompatibility[0])[0]);
      candidateProfiles?.map(async (candidate, index) => {

        let res = await getTeamDynamicsById(company_id, {
          linkedinUrl: candidate?.profileURL,
          jobId,
        });
        if (res) {
          let teamCompatibilityScore = res?.summarized?.overallCompatibility;
          teamCompatibilityScore = Math.round(teamCompatibilityScore * 100);
          let memScore;
          if (teamCompatibilityScore >= 85) {
            memScore = "High+";
          } else if (teamCompatibilityScore >= 75) {
            memScore = "High";
          } else if (teamCompatibilityScore >= 65) {
            memScore = "Medium";
          } else {
            memScore = "Low";
          }
          setCompatibilityMapState(prevState => ({
            ...prevState,
            [candidate.candidateId]: memScore,
          }));
        }
      });
    };
    updateCompatibilityMapState();
  }, []);

  useEffect(() => { }, [filteredCandidates, showCreate]);

  const handleShowManagePods = () => {
    setShowManagePodsPopup(true);
  };

  const handleFilterClick = async () => {
    setShowFilter(prev => !prev);
  };

  const handleSearch = async searchValue => {
    const lowercasedFilterValue = searchValue.trim().toLowerCase();
    let filteredCandidates;
    if (!lowercasedFilterValue) {
      // If filterValue is empty, don't apply filtering
      filteredCandidates = candidateProfiles;
    } else {
      // Apply filtering logic when filterValue is not empty
      filteredCandidates = candidateProfiles?.filter(candidate => {
        // Ensure that each property is defined before calling toLowerCase()
        const firstNameMatch =
          candidate.firstName &&
          candidate.firstName.toLowerCase().includes(lowercasedFilterValue);
        const lastNameMatch =
          candidate.lastName &&
          candidate.lastName.toLowerCase().includes(lowercasedFilterValue);
        const profileURLMatch =
          candidate.profileURL &&
          candidate.profileURL.toLowerCase().includes(lowercasedFilterValue);
        const contactMatch =
          candidate.contact &&
          candidate.contact.toLowerCase().includes(lowercasedFilterValue);
        const emailMatch =
          candidate.email &&
          candidate.email.toLowerCase().includes(lowercasedFilterValue);
        const tagMatch =
          candidate.tag && candidate.tag.toLowerCase().includes(lowercasedFilterValue);

        // Check if the filter value matches any of the fields
        return (
          firstNameMatch ||
          lastNameMatch ||
          profileURLMatch ||
          contactMatch ||
          emailMatch ||
          tagMatch
        );
      });
    }
    setFilteredCandidates(filteredCandidates);
  };

  const handleCandidateSelected = candidate => {
    setSelectedCandidate(candidate);
  };

  const handleCreatePod = async () => {
    setShowCreatePod(true);
  };

  const handleCreatePodClose = async () => {
    setShowCreatePod(false);
  };

  let teamCompatibilityScore = teamData?.summarized?.overallCompatibility;
  teamCompatibilityScore = Math.round(teamCompatibilityScore * 100);
  let memScore;

  if (teamCompatibilityScore > 85) {
    memScore = "High+";
  } else if (teamCompatibilityScore > 75) {
    memScore = "High";
  } else if (teamCompatibilityScore > 65) {
    memScore = "Medium";
  } else {
    memScore = "Low";
  }

  // For sorting
  const sortCandidates = () => {
    const sortedCandidates = candidateProfiles ? [...candidateProfiles] : [];
    sortedCandidates.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    setFilteredCandidates(sortedCandidates);
  };

  useEffect(() => {
    sortCandidates();
  }, [candidateProfiles, sortOrder]);

  const handleSort = () => {
    // Toggle the sortOrder when clicking on the sort header
    setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleViewDetails = selectedCandidate => {
    //setIsOnClickTagView(true);
    setSelectedCandidate(selectedCandidate);
  };

  const handleCandidateClick = () => { };
  //alert(selectedCandidate.firstName+"========"+selectedCandidate?.hasTeamDynamicReport)


  return (
    <>
      {isTeam ? (
        <div id="dynamics-report-node" className={styles.RightSection} ref={reportRef}>
          {(allPods && allPods.length >= 0) || selectedPods.length > 0 ? (
            <>

              <div className={styles.TeamDynamicsWrapper}>
                {(mainViewProf?.evaluationid?.hasTeamDynamicReport || hasReport) && (
                  <TeamDynamicsComponent
                    teamData={teamData}
                    candidatesData={setCandidate}
                    isTeam={isTeam}
                    clickedPod={clickedPod !== "null" ? clickedPod : allPods[0]}
                  />
                )}
              </div>
              <div className={styles.SmallPadding}>
                <AddPodComponent
                  allPods={selectedPods?.length !== 0 ? selectedPods : allPods}
                  selectedPods={selectedPods}
                  setSelectedPods={setSelectedPods}
                  handleShowManagePods={handleShowManagePods}
                  jobId={jobId}
                />
              </div>
              {teamData && (mainViewProf?.evaluationid?.hasTeamDynamicReport || hasReport) ? (
                <div className={styles.SmallPadding}>
                  {/* //clickedPod={clickedPod !== "null" ? clickedPod : allPods[0]} */}
                  <CompatibilityTableComponent
                    podsData={podsData}
                    setPodsData={setPodsData}
                    teamData={teamData}
                    candidatesData={candidatesData}
                    clickedPod={clickedPod?.length !== 0 ? clickedPod : [allPods[0]]}
                    allPods={allPods}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <div className={styles.CreatePodComponent}>
              <Button
                btnType={"secondary"}
                text={"+ Create a pod"}
                onClick={handleCreatePod}
              />
              <p className={styles.CreatePodTip}>
                Create a pod to check team compatibility and balance{" "}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div id="dynamics-report-node" className={styles.SectionWrapper}>
          {showFilter ? (
            <FilterComponent
              setFilteredCandidates={setFilteredCandidates}
              filteredCandidates={filteredCandidates}
              setShowFilter={setShowFilter}
            />
          ) : null}

          {showCreate ? (
            <PodManagementLaunch handleCreatePodClose={handleCreatePodClose} />
          ) : null}
          {showManagePods ? (
            <ManagePodComponent
              setShowManagePodsPopup={setShowManagePodsPopup}
              jobId={jobId}
              setPodsData={setPodsData}
              setSelectedPods={setSelectedPods}
              handleCreatePod={handleCreatePod}
              allPods={selectedPods?.length === 0 ? allPods : selectedPods}
            />
          ) : null}
          <div className={styles.LeftSection}>
            <div
              className={`text-xl pt-2 rounded-lg font-bold flex justify-between w-[95%] px-4`}
              style={{ backgroundColor: "#FFFFFF", gap: "1.3rem" }}>
              <div className={styles.CandidateHeadingWrapper}>
                <span className={styles.CandidateHeading}>Candidates</span>
                <span className={styles.Dot}>.</span>
                <span className={styles.CandidateNumber}>
                  {candidateProfiles?.length}
                </span>
              </div>
              <Divider orientation="vertical" />
              {/* <div>
                <input
                  className={`${styles.SearchBar} focus:outline-none focus:ring-[#EEEEEE] border-[E3E3E3] text-[#333333]`}
                  type="text"
                  placeholder="Search candidate"
                  style={{
                    borderColor: "#E3E3E3",
                    fontWeight: "200",
                    backgroundColor: "rgba(244, 247, 248, 1)",
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                ></input>
              </div> */}
              <div className={styles.inputIcons}>
                <i className={`fa fa-search ${styles.icon}`}></i>
                <CustomInput
                  className={styles.inputField}
                  type="text"
                  placeholder="Search candidate"
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              <div className={styles.MenuWrapper}>
                <img
                  src={Filter}
                  alt="filter"
                  className={styles.FilterImg}
                  onClick={handleFilterClick}
                />
              </div>
            </div>
            <div className={styles.ManagePodsWrapper}>
              <span
                className={styles.ManagePods}
                onClick={handleShowManagePods}
                style={{ marginLeft: "-10px" }}>
                Manage pods
              </span>
            </div>
            <div className="flex flex-row gap-2 items-center" />
            <div className={styles.CandidateDetailsWrapper}>
              <table className={styles.TeamTable}>
                <thead className="bg-white border-b px-2 py-2">
                  <tr className={`w-[100%] ${styles.HeadingRow} `}>
                    <th
                      scope="col"
                      colSpan="2"
                      className="text-sm font-medium text-[#888888]">
                      <div
                        className="flex flex-row gap-1 items-center px-1 py-2"
                        style={{
                          background: "linear-gradient(0deg, #E3E3E3, #E3E3E3)",
                        }}>
                        <div className={styles.IconWrapper}>
                          <IoCaretUpSharp
                            onClick={handleSort}
                            style={{ fontSize: ".6rem" }}
                          />
                          <AiFillCaretDown
                            onClick={handleSort}
                            style={{ fontSize: ".6rem" }}
                          />
                        </div>
                        <div>Name</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                {filteredCandidates?.map((candidate, index) => {
                  return (
                    <CandidateDetailsRow
                      selectedCandidate={selectedCandidate}
                      candidate={candidate}
                      index={index}
                      showStatus={false}
                      showCheckbox={false}
                      showAddingMethod={false}
                      showEllipsisMenu={false}
                      showCandidateChips={true}
                      showTalentMatch={true}
                      showSourceAdded={false}
                      isTeamDynamics={true}
                      customClass={styles.RowCustomClass}
                      setCandidatesData={setCandidatesData}
                      handleTagView={handleCandidateSelected}
                      handleViewDetails={handleViewDetails}
                      handleCandidateClick={handleCandidateClick}
                      memScore={
                        compatibilityMapState[candidate?.candidateId]
                          ? compatibilityMapState[candidate?.candidateId]
                          : ""
                      }
                    />
                  );
                })}
              </table>
            </div>
          </div>
          <div className={styles.RightSection}>
            <ReportHeaderComponent
              showSelectReport={false}
              selectedCandidate={selectedCandidate}
              chipsData={chipsData}
              allPods={allPods}
              setHasReport={setHasReport}
            />
            {/* {selectedCandidate?.hasTeamDynamicReport?( && allPods.length > 0 */}

            {/* {(allPods && allPods.length > 0) || selectedPods.length > 0 ? ( */}
            {(allPods && allPods.length >= 0) || selectedPods.length > 0 ? (
              <>
                <div className={styles.TeamDynamicsWrapper}>
                  {(mainViewProf?.evaluationid?.hasTeamDynamicReport || hasReport) && (
                    <TeamDynamicsComponent
                      teamData={teamData}
                      candidatesData={selectedCandidate}
                      isTeam={isTeam}
                      clickedPod={clickedPod !== "null" ? clickedPod : allPods[0]}
                    />
                  )}
                </div>
                <div className={styles.SmallPadding}>
                  <AddPodComponent
                    allPods={selectedPods?.length > 0 ? selectedPods : allPods}
                    selectedPods={selectedPods}
                    setSelectedPods={setSelectedPods}
                    handleShowManagePods={handleShowManagePods}
                    jobId={jobId}
                  />
                </div>
                {teamData && (mainViewProf?.evaluationid?.hasTeamDynamicReport || hasReport) ? (
                  <div className={styles.SmallPadding}>
                    {/* //clickedPod={clickedPod !== "null" ? clickedPod : allPods[0]} */}
                    <CompatibilityTableComponent
                      podsData={podsData}
                      setPodsData={setPodsData}
                      teamData={teamData}
                      candidatesData={candidatesData}
                      clickedPod={clickedPod?.length !== 0 ? clickedPod : [allPods[0]]}
                      allPods={selectedPods?.length !== 0 ? selectedPods : allPods}
                      selectedPods={selectedPods}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className={styles.CreatePodComponent}>
                <Button
                  btnType={"secondary"}
                  text={"+ Create a pod"}
                  onClick={handleCreatePod}
                />
                <p className={styles.CreatePodTip}>
                  Create a pod to check team compatibility and balance{" "}
                </p>
              </div>
            )}
            {/* //   )):(<div className={styles.CreatePodComponent}>
              
          //      <div className="items-center flex justify-center">
          //   {" "}
          //   No reports available for {selectedCandidate?.firstName}{" "}
          //   {selectedCandidate?.lastName}
          // </div>
          //   </div>)} */}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamCompatibilityComponent;
