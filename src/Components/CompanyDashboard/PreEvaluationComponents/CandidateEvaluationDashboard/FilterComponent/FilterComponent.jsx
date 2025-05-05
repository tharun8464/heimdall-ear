import React, { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import styles from "./FilterComponent.module.css";
import CustomChip from "../../../../CustomChip/CustomChip";
import { Checkbox, Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import FitIcon from "../../../../../assets/images/Reports/FitIcon.svg";
import CandidateSourceGreenIcon from "../../../../../assets/images/PreEvaluation/CandidateSourceGreenIcon.svg";
import FitGreyIcon from "../../../../../assets/images/PreEvaluation/FitGreyIcon.svg";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SourceIcon from "../../../../../assets/images/Reports/SourceIcon.svg";
import { filterProfiles } from "../../../../../service/api";
import { getBestProfiles } from "../../../../../service/preEvaluation/getBestProfiles";
import { useParams } from "react-router";
import CandidateEvaluationDashboard from "../../../PreEvaluationComponents/CandidateEvaluationDashboard/CandidateEvaluationDashboard.jsx";
import { useSelector } from "react-redux";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation.js";

const FilterComponent = ({
  setShowFilter,
  filteredCandidates,
  setFilteredCandidates,
  viewType,
}) => {
  const { handleFilterMainViewProfiles } = usePreEvaluation();
  // console.log("handleFilterMainViewProfiles:", handleFilterMainViewProfiles);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [activeFilter, setActiveFilter] = useState("tags");
  const [sortCandidates, setsortCandidates] = useState([]);
  const { id: jobId } = useParams();
  const [candidatesLocationOptions, setCandidatesLocationOptions] = useState(
    []
  );
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSource, setSelectedSource] = useState([]);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");

  // const [filterCriteria, setFilterCriteria] = useState([]);

  const { bestProfiles, mainViewProfiles } = useSelector(
    (state) => state.preEvaluation
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBestProfiles(jobId);
        setsortCandidates(data?.data?.data);
        const uniqueLocations = [
          ...new Set(sortCandidates.map((candidate) => candidate.location)),
        ];
        setCandidatesLocationOptions(uniqueLocations);
        applyFilters();
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    }
    fetchData();
  }, [selectedTags, selectedReports, selectedLocations, selectedSource, jobId]);

  const handleTagChange = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.filter((tag) => tag !== tagName)
      );
    } else {
      setSelectedTags((prevSelectedTags) => [...prevSelectedTags, tagName]);
    }
  };
  const handleReportsChange = (reports) => {
    if (selectedReports.includes(reports)) {
      setSelectedReports((prevSelectedReports) =>
        prevSelectedReports.filter((report) => report !== reports)
      );
    } else {
      setSelectedReports((prevSelectedReports) => [
        ...prevSelectedReports,
        reports,
      ]);
    }
  };

  const handleLocationChange = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations((prevSelectedLocations) =>
        prevSelectedLocations.filter((loc) => loc !== location)
      );
    } else {
      setSelectedLocations((prevSelectedLocations) => [
        ...prevSelectedLocations,
        location,
      ]);
    }
  };

  const handleSourceChange = (source) => {
    if (selectedSource.includes(source)) {
      setSelectedSource((prevSelectedSource) =>
        prevSelectedSource.filter((soc) => soc !== source)
      );
    } else {
      setSelectedSource((prevSelectedSource) => [
        ...prevSelectedSource,
        source,
      ]);
    }
  };

  const handleFilterChange = (filterBy) => {
    setActiveFilter(filterBy);
  };

  const applyFilters = async () => {
    const filterCriteria = [];

    if (selectedTags.length > 0) {
      filterCriteria.push({
        type: "tags",
        values: selectedTags.map((tag) => ({ tagname: tag })),
      });
    }

    if (selectedReports.length > 0) {
      filterCriteria.push({
        type: "reports",
        values: selectedReports,
      });
    }

    if (selectedLocations.length > 0) {
      filterCriteria.push({
        type: "location",
        values: selectedLocations.map((location) => ({ location: location })),
      });
    }

    if (selectedSource.length > 0) {
      filterCriteria.push({
        type: "source",
        values: selectedSource,
      });
    }
    if (filterCriteria.length > 0) {
      const requestBody = {
        jobId: jobId,
        filterCriteria: filterCriteria,
      };
      try {
        if (viewType === "main") {
          const responseData = await handleFilterMainViewProfiles(requestBody);
          // console.log("responseData:", responseData);
          setFilteredCandidates(responseData.data);
        } else {
          let res = await filterProfiles(requestBody);
          // console.log("responseDat:", res?.data);
          setFilteredCandidates(res?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (
      selectedTags.length === 0 &&
      selectedReports.length === 0 &&
      selectedLocations.length === 0 &&
      selectedLocations.length === 0 &&
      selectedSource.length === 0
    ) {
      if (viewType === "main") {
        console.log("no filter mainViewProfiles:", mainViewProfiles);
        setFilteredCandidates(mainViewProfiles);
      } else {
        setFilteredCandidates(bestProfiles?.data);
      }
    }
  }, [
    selectedTags,
    selectedReports,
    selectedLocations,
    selectedSource,
    viewType,
    mainViewProfiles,
  ]);

  const clearTag = (tagToClear) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.filter((tag) => tag !== tagToClear)
    );
  };
  const clearReports = (reportsToClear) => {
    setSelectedReports((prevSelectedReports) =>
      prevSelectedReports.filter((reports) => reports !== reportsToClear)
    );
  };

  const clearLocation = (locationToClear) => {
    setSelectedLocations((prevSelectedLocations) =>
      prevSelectedLocations.filter((location) => location !== locationToClear)
    );
  };
  const clearSource = (sourceToClear) => {
    setSelectedSource((prevSelectedSource) =>
      prevSelectedSource.filter((source) => source !== sourceToClear)
    );
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const iconStyle = {
    // display: "block",
    // fontSize: "12px",
    // lineHeight: "16px",
    // color: "#FFF",
    // position: "relative",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
  };

  const renderFilterOptions = () => {
    if (activeFilter === "tags") {
      return (
        <div className={styles.Filters}>
          <ul>
            {/* <li>
              <Checkbox
                onChange={() => handleTagChange("Good Fit")}
                checked={selectedTags.includes("Good Fit")}
                iconStyle={selectedTags.includes("Good Fit") ? iconStyle : {}}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />
              <span>Good Fit</span>
            </li> */}
            <li>
              <Checkbox
                onChange={() => handleTagChange("May be")}
                checked={selectedTags.includes("May be")}
                iconStyle={selectedTags.includes("May be") ? iconStyle : {}}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />
              <span>Maybe</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleTagChange("Not a fit")}
                checked={selectedTags.includes("Not a fit")}
                iconStyle={selectedTags.includes("Not a fit") ? iconStyle : {}}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />
              <span>Not a fit</span>
            </li>
          </ul>
        </div>
      );
    } else if (activeFilter === "location") {
      return (
        <div>
          <div className={styles.Filters}>
            <Input
              placeholder="Search Location"
              startAdornment={
                <InputAdornment position="start" style={{ border: "none" }}>
                  <SearchIcon style={{ border: "none", outline: "none" }} />
                </InputAdornment>
              }
              value={locationSearchQuery}
              onChange={(e) => setLocationSearchQuery(e.target.value)}
              inputProps={{ style: { outline: "none", boxShadow: "none" } }}
            />
          </div>
          <ul
            style={{
              maxHeight: "150px",
              overflowY: "scroll",
              border: "none",
            }}
          >
            {candidatesLocationOptions
              .filter((location) =>
                location
                  ?.toLowerCase()
                  .includes(locationSearchQuery?.toLowerCase())
              )
              .map((location) => (
                <li key={location}>
                  <Checkbox
                    onChange={() => handleLocationChange(location)}
                    checked={selectedLocations.includes(location)}
                    sx={{
                      color: "grey",
                      "&.Mui-checked": {
                        color: "var(--primary-green)",
                      },
                    }}
                  />
                  <span>{location}</span>
                </li>
              ))}
          </ul>
        </div>
      );
    } else if (activeFilter === "Reports") {
      return (
        <div className={styles.Filters}>
          <ul>
            <li>
              <Checkbox
                onChange={() => handleReportsChange("hasVmLiteReport")}
                checked={selectedReports.includes("hasVmLiteReport")}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>VM Lite</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleReportsChange("hasVMProReport")}
                checked={selectedReports.includes("hasVMProReport")}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>VM Pro</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleReportsChange("hasFeedback")}
                checked={selectedReports.includes("hasFeedback")}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>Feedback</span>
            </li>
          </ul>
        </div>
      );
    } else if (activeFilter === "source") {
      return (
        <div className={styles.Filters}>
          <ul>
            <li>
              <Checkbox
                onChange={() => handleSourceChange("Added")}
                checked={selectedSource.includes("Added")}
                iconStyle={selectedSource.includes("Added") ? iconStyle : {}}
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>Added</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleSourceChange("Recommended")}
                checked={selectedSource.includes("Recommended")}
                iconStyle={
                  selectedSource.includes("Recommended") ? iconStyle : {}
                }
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>Recommended</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleSourceChange("VMSourced")}
                checked={selectedSource.includes("VMSourced")}
                iconStyle={
                  selectedSource.includes("VMSourced") ? iconStyle : {}
                }
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>VM Sourced</span>
            </li>
            <li>
              <Checkbox
                onChange={() => handleSourceChange("SelfApplied")}
                checked={selectedSource.includes("SelfApplied")}
                iconStyle={
                  selectedSource.includes("SelfApplied") ? iconStyle : {}
                }
                sx={{
                  color: "grey",
                  "&.Mui-checked": {
                    color: "var(--primary-green)",
                  },
                }}
              />{" "}
              <span>Self Applied</span>
            </li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div className={styles.Wrapper} style={{marginTop:"60px"}}>
      <div className={styles.Menu}>
        <h2 className={styles.Heading}>Filters</h2>
        <div className="flex gap-1 items-center">
          <Close
            className={styles.Close}
            fontSize="small"
            onClick={handleCloseFilter}
          />
        </div>
      </div>
      <hr />
      <div className={styles.ChipsWrapper}>
        {selectedTags.map((tag, index) => (
          <>
            <div
              key={tag}
              style={{
                display: "flex",
                backgroundColor: "#88888880",
                borderRadius: "8px",
                alignItems: "center",
              }}
            >
              <CustomChip customClass={styles.CustomChipClass} label={tag} />              
              <Close
                className={styles.Close}
                fontSize="small"
                onClick={() => clearTag(tag)}
              />
            </div>
          </>
        ))}
        {selectedReports.map((reports, index) => (
          <>
            <div
              key={reports}
              style={{
                display: "flex",
                backgroundColor: "#88888880",
                borderRadius: "8px",
                alignItems: "center",
              }}
            >
              <CustomChip
                customClass={styles.CustomChipClass}
                label={
                  reports === 'hasVMProReport'
                    ? 'VM Pro'
                    : reports === 'hasVmLiteReport'
                    ? 'VM Lite'
                    : reports === 'hasFeedback'
                    ? 'Feedback'
                    : reports
                }
              />
              <Close
                className={styles.Close}
                fontSize="small"
                onClick={() => clearReports(reports)}
              />
            </div>
          </>
        ))}
        {selectedLocations.map((location, index) => (
          <>
            <div
              key={location}
              style={{
                display: "flex",
                backgroundColor: "#88888880",
                borderRadius: "8px",
                alignItems: "center",
              }}
            >
              <CustomChip
                customClass={styles.CustomChipClass}
                label={location}
              />
              <Close
                className={styles.Close}
                fontSize="small"
                onClick={() => clearLocation(location)}
              />
            </div>
          </>
        ))}
        {selectedSource.map((source, index) => (
          <>
            <div
              key={source}
              style={{
                display: "flex",
                backgroundColor: "#88888880",
                borderRadius: "8px",
                alignItems: "center",
              }}
            >
              <CustomChip customClass={styles.CustomChipClass} label={source} />
              <Close
                className={styles.Close}
                fontSize="small"
                onClick={() => clearSource(source)}
              />
            </div>
          </>
        ))}
      </div>
      <hr />

      <div className={styles.FilterWrapper}>
        <div className={styles.FilterSidebar}>
          <ul className={styles.List}>
            <li
              className={styles.Flex}
              onClick={() => handleFilterChange("tags")}
            >
              {activeFilter === "tags" ? (
                <img src={FitIcon} alt="" className={styles.Icon} />
              ) : (
                <img src={FitGreyIcon} alt="" className={styles.Icon} />
              )}{" "}
              <span className={styles.MarginLeft}>Fit</span>{" "}
            </li>
            <li
              className={styles.Flex}
              onClick={() => handleFilterChange("location")}
            >
              <LocationOnIcon
                sx={{
                  color:
                    activeFilter === "location"
                      ? "var(--primary-green)"
                      : "var(--font-grey-75)",
                }}
              />{" "}
              <span>Location</span>
            </li>
            <li
              className={styles.Flex}
              onClick={() => handleFilterChange("Reports")}
            >
              <ArticleIcon
                sx={{
                  color:
                    activeFilter === "Reports"
                      ? "var(--primary-green)"
                      : "var(--font-grey-75)",
                }}
              />{" "}
              <span>Reports</span>
            </li>
            <li
              className={styles.Flex}
              onClick={() => handleFilterChange("source")}
            >
              {activeFilter === "source" ? (
                <img
                  src={CandidateSourceGreenIcon}
                  alt=""
                  className={styles.Icon}
                />
              ) : (
                <img src={SourceIcon} alt="" className={styles.Icon} />
              )}
              <span
                className={styles.MarginLeft}
                // style={{
                //   color:
                //     activeFilter === "source"
                //       ? "var(--primary-green)"
                //       : "var(--primary-grey)",
                // }}
              >
                Source
              </span>{" "}
            </li>
          </ul>
        </div>
        {renderFilterOptions()}
      </div>
    </div>
  );
};

export default FilterComponent;
