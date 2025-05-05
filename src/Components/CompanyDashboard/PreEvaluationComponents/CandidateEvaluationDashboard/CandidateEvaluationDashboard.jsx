import { AiFillCaretDown, AiFillLock, AiOutlinePlus } from "react-icons/ai";
import { IoCaretUpSharp } from "react-icons/io5";
import { Checkbox } from "@material-ui/core";
import styles from "./CandidateEvaluationDashboard.module.css";
import CustomChip from "../../../CustomChip/CustomChip";
import AddCandidatesComponent from "../AddCandidatesComponent/AddCandidatesComponent";
import { useState, useEffect } from "react";
import Filter from "../../../../assets/images/Reports/Filter.svg";
import FilterComponent from "./FilterComponent/FilterComponent";
import CandidateDetailsRow from "../CandidateDetailsRow/CandidateDetailsRow";
import PreEvaluationDashboardMenu from "../PreEvaluationDashboardMenu/PreEvaluationDashboardMenu";
import Button from "../../../Button/Button";
import { useParams } from "react-router";
import { Divider } from "@mui/material";
import ReportHeaderComponent from "../EvaluationReportsComponent/ReportHeaderComponent/ReportHeaderComponent";
import ReportComponent from "../EvaluationReportsComponent/ReportComponent/ReportComponent";
import TagViewCandidateDetailsRow from "../CandidateDetailsRow/TagViewCandidateDetailsRow";
import CustomInput from "../../../CustomInput/CustomInput";
import InterviewStatusComponent from "../InterviewStatusComponent/InterviewStatusComponent";
const CandidateEvaluationDashboard = ({
  showTableHeader = false,
  candidateProfiles,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [isOnClickTagView, setIsOnClickTagView] = useState(false);
  const [data, setData] = useState(null);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [isTagChange, setIsTageChange] = useState(false);
  const [showInterviewStatus, setShowInterviewStatus] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const [sortOrder, setSortOrder] = useState({
    column: "",
    ascending: true,
  });

  const { id: jobId } = useParams();

  useEffect(() => {
    if (filteredCandidates && filteredCandidates.length > 0) {
      setData(filteredCandidates);
    } else {
      setData(candidateProfiles);
    }
  }, [filteredCandidates, candidateProfiles, isTagChange]);
  const [selectedCandidate, setSelectedCandidate] = useState({});

  useEffect(() => {
    setFilteredCandidates(candidateProfiles);
  }, [candidateProfiles]);

  // console.log("changeme", candidateProfiles)

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleTagView = (candidate) => {
    setIsOnClickTagView(true);

    setSelectedCandidate(candidate);
  };

  const handleSectionClose = () => {
    setIsOnClickTagView(false);
  };

  const handleTagChange = () => {
    setIsTageChange(true);
  };

  const handleSearch = async (searchValue) => {
    const lowercasedFilterValue = searchValue.trim().toLowerCase();
    let filteredCandidates;
    if (!lowercasedFilterValue) {
      // If filterValue is empty, don't apply filtering
      filteredCandidates = candidateProfiles;
    } else {
      // Apply filtering logic when filterValue is not empty
      filteredCandidates = candidateProfiles?.filter((candidate) => {
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
          candidate.tag &&
          candidate.tag.toLowerCase().includes(lowercasedFilterValue);

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

  const handleViewDetails = (selectedCandidate) => {
    setIsOnClickTagView(true);
    setSelectedCandidate(selectedCandidate);
  };

  const handleShowInterviewStatus = () => {
    setShowInterviewStatus(true);
  };

  const handleAscend = (property) => {
    let sortedCandidates;

    if (property === "Name") {
      sortedCandidates = [...candidateProfiles].sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return sortOrder.ascending
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    } else if (property === "Invitation Status") {
      sortedCandidates = [...candidateProfiles].sort((a, b) => {
        const valueA = a.status || 0;
        const valueB = b.status || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    }
    //  else if (property === "Talent Match") {
    //   sortedCandidates = [...candidateProfiles].sort((a, b) => {
    //     const valueA = a.tag.toLowerCase();
    //     const valueB = b.tag.toLowerCase();

    //     if (valueA < valueB) {
    //       return sortOrder.ascending ? -1 : 1;
    //     }
    //     if (valueA > valueB) {
    //       return sortOrder.ascending ? 1 : -1;
    //     }
    //     return 0;
    //   });
    // } 
    else if (property === "Talent Match") {
      sortedCandidates = [...candidateProfiles].sort((a, b) => {
        const valueA = a.talentMatchConfidence || 0;
        const valueB = b.talentMatchConfidence || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    }
    else if (property === "Tags") {
      sortedCandidates = [...candidateProfiles].sort((a, b) => {
        const valueA = a.customtags?.length || 0;
        const valueB = b.customtags?.length || 0;
        return sortOrder.ascending ? valueA - valueB : valueB - valueA;
      });
    } else {
      sortedCandidates = [...candidateProfiles].sort((a, b) => {
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
    setFilteredCandidates(sortedCandidates);
    setSortOrder({
      column: property,
      ascending: !sortOrder.ascending,
    });
  };



  return (
    <>
      {showInterviewStatus ? (
        <InterviewStatusComponent
          jobId={jobId}
          setShowInterviewStatus={setShowInterviewStatus}
        />
      ) : null}
      {isOnClickTagView ? (
        // divided view
        <div className={styles.SectionWrapper}>
          <div className={styles.LeftSection} style={{ position: "relative" }}>
            {showFilter ? (

              <FilterComponent
                setFilteredCandidates={setFilteredCandidates}
                filteredCandidates={filteredCandidates}
                setShowFilter={setShowFilter}
              />

            ) : null}
            <div
              className={`text-xl pt-2 rounded-lg font-bold flex justify-between w-[95%] px-4 ${styles.DashboardMenu}`}
              style={{ backgroundColor: "#FFFFFF", gap: "1.3rem" }}
            >
              <div className={styles.CandidateHeadingWrapper}>
                <span className={styles.CandidateHeading}>Candidates</span>
                <span className={styles.Dot}>.</span>
                <span className={styles.CandidateNumber}>
                  {candidateProfiles?.length}
                </span>
              </div>
              <Divider orientation="vertical" />
              <div>
                <div className={styles.inputIcons}>
                  <i className={`fa fa-search ${styles.icon}`}></i>
                  <CustomInput
                    className={styles.inputFieldShort}
                    type="text"
                    placeholder="Search candidate"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <img
                src={Filter}
                alt="filter"
                className={styles.FilterImg}
                onClick={handleShowFilter}
              />
            </div>
            <div
              className={styles.InterviewStatusWrapper}
              style={{ background: "linear-gradient(0deg, #FAFAFA, #FAFAFA)" }}
            >
              <span className={styles.InterviewStatus}
                onClick={handleShowInterviewStatus}>
                View Interview Status
              </span>
            </div>
            <div className={styles.CandidateDetailsWrapper}>
              <table className={styles.TeamTable}>
                {showTableHeader ? (
                  <thead className="bg-white border-b px-2 py-2">
                    <tr className={`w-[100%] ${styles.HeadingRow} `}>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#888888]"

                      >
                        <div
                          className="flex flex-row gap-1 items-center px-1 py-2"
                          style={{
                            background:
                              "linear-gradient(0deg, #E3E3E3, #E3E3E3)",
                          }}
                        >
                          <div className={styles.IconWrapper}
                            onClick={() => handleAscend("Name")}
                            style={{ cursor: "pointer" }}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div>Name</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                ) : null}
                {filteredCandidates.length === 0 ? (
                  <div className="flex items-center justify-center ">
                    <p>No matching candidates found.</p>
                  </div>

                ) : (
                  <tbody>
                    {data?.map((candidate, index) => {
                      return (
                        <TagViewCandidateDetailsRow
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
                          isSelected={selectedCandidateId === candidate.candidateId}
                          handleCandidateClick={() => setSelectedCandidateId(candidate.candidateId)}
                          customClass={styles.RowCustomClass}
                          handleShowReport={handleTagView}
                        />
                      );
                    })}
                  </tbody>)}
              </table>
            </div>
          </div>
          <div className={styles.RightSection}>

            {/* <ReportHeaderComponent chipsData={chipsData} showSelectReport={false} /> */}
            <ReportComponent
              selectedCandidate={selectedCandidate}
              handleSectionClose={handleSectionClose}
              handleTagChange={handleTagChange}
              setIsOnClickTagView={setIsOnClickTagView}
            />
          </div>
        </div>
      ) : (
        <div className={styles.Wrapper}>
          {showFilter ? (
            <FilterComponent
              setFilteredCandidates={setFilteredCandidates}
              filteredCandidates={filteredCandidates}
              setShowFilter={setShowFilter}
            />
          ) : null}
          <div className={styles.Wrapper}>

            <div
              className={`text-xl pt-3 rounded-lg font-bold  flex justify-between w-[95%] px-6 ${styles.DashboardMenu}`}
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className={styles.MenuWrapper}>
                <div className={styles.CandidateHeadingWrapper}>
                  <span className={styles.CandidateHeading}>Candidates</span>
                  <span className={styles.Dot}>.</span>
                  <span className={styles.CandidateNumber}>
                    {candidateProfiles?.length}
                  </span>
                </div>
                {/* <div className="flex gap-4">
                  <p className="text-base font-medium text-[#888888] self-center">
                    Invited
                  </p>
                </div> */}
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
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <img
                  src={Filter}
                  alt="filter"
                  className={styles.FilterImg}
                  onClick={handleShowFilter}
                />
              </div>
            </div>
            <div
              className={styles.ViewInterviewStatusWrapper}
            >
              <span className={styles.ViewInterviewStatus} onClick={handleShowInterviewStatus}>
                View interview status
              </span>
            </div>
            <div
              className="overflow-hidden"
              style={{ overflowY: "scroll", height: "70vh" }}
            >
              <table className="w-full">
                {/* table header, name, status etc */}
                {showTableHeader ? (
                  <thead className="bg-white border-b">

                    <tr className={`w-[100%] ${styles.HeadingRow} `}>
                      {/* <th scope="col" className="text-sm font-medium text-[#888888]  px-6">
                      <Checkbox />
                    </th> */}
                      {/* <th className="w-16"></th> */}
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#888888] w-[40%]"

                      >
                        <div className="flex flex-row gap-2 items-center">
                          <div className={styles.IconWrapper}
                            onClick={() => handleAscend("Name")}
                            style={{ cursor: "pointer" }}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div>Name</div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#888888] w-[15%]"

                      >
                        <div className="flex flex-row gap-2 items-center">
                          <div onClick={() => handleAscend("Talent Match")}
                            style={{ cursor: "pointer" }}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div className={styles.HeadingText}>
                            {" "}
                            Talent Match
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-[#888888] "

                      >
                        <div className="flex flex-row gap-2 items-center">
                          <div onClick={() => handleAscend("Invitation Status")}
                            style={{ cursor: "pointer" }}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div className={styles.HeadingText}>
                            {" "}
                            Invitation Status
                          </div>
                        </div>
                      </th>
                      <th
                        className="text-sm font-medium text-[#888888]"
                      >
                        <div className="flex flex-row gap-2 items-center">
                          <div onClick={() => handleAscend("Tags")}
                            style={{ cursor: "pointer" }}>
                            <IoCaretUpSharp style={{ fontSize: ".6rem" }} />
                            <AiFillCaretDown style={{ fontSize: ".6rem" }} />
                          </div>
                          <div className={""}> Tags</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                ) : null}
                {filteredCandidates?.length === 0 ? (
                  <div className="flex items-center justify-center ">
                    <p>No matching candidates found.</p>
                  </div>

                ) : (
                  <tbody>
                    {data?.map((candidate, index) => {
                      return (
                        <CandidateDetailsRow
                          key={index}
                          candidate={candidate}
                          index={index}
                          showStatus={true}
                          showCheckbox={true}
                          showAddingMethod={true}
                          showEllipsisMenu={false}
                          showSourceAdded={false}
                          handleTagView={handleTagView}
                          handleViewDetails={handleViewDetails}
                          isSelected={selectedCandidateId === candidate.candidateId}
                          handleCandidateClick={() => setSelectedCandidateId(candidate.candidateId)}
                        />
                      );
                    })}

                    {/* {candidateProfiles?.map((candidate, index) => {
                    return (
                      <CandidateDetailsRow
                        candidate={candidate}
                        index={index}
                        showStatus={true}
                        showCheckbox={true}
                        showAddingMethod={true}
                        showEllipsisMenu={false}
                        showSourceAdded={false}
                        handleTagView={handleTagView}
                      />
                    );
                  })} */}
                  </tbody>
                )}
              </table>
            </div>

          </div>



        </div>
      )}
    </>
  );
};

export default CandidateEvaluationDashboard;
