import { useState } from "react";
import CustomChip from "../../../CustomChip/CustomChip";
import Filter from "../../../../assets/images/Reports/Filter.svg";
import styles from "./PreEvaluationDashboardMenu.module.css";
import { Divider } from "@mui/material";
import Button from "../../../Button/Button";
import FilterComponent from "../CandidateEvaluationDashboard/FilterComponent/FilterComponent";
import CustomInput from "../../../CustomInput/CustomInput";
const PreEvaluationDashboardMenu = ({
  setShowEditWeightage,
  setShowCustomizeView,
  isSmallView = false,
  customClaas,
  candidatesLength,
  handleFilter,
  setFilteredMainviewProfiles,
  filteredMainviewProfiles,
  showFilter,
  setShowFilter,
  setShowManageList
}) => {
  // const [filteredCandidates, setFilteredCandidates] = useState([]);

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const hanldeShowEditWeightage = () => {
    setShowEditWeightage(true);
    setShowCustomizeView(false);
  };
  const handleShowCustomizeView = () => {
    setShowCustomizeView(true);
    setShowEditWeightage(false);
  };

  const handleShowManageList = () => {
    setShowManageList(true)
  }

  return (
    <div
      className={`text-xl pt-3 font-bold  flex justify-between w-[95%] px-6 ${styles.DashboardMenu
        } ${customClaas ? customClaas : ""}`}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className={styles.MenuWrapper}>
        {/* <CustomChip label={"All"} type="success" /> */}
        {/* <div className="flex gap-4">
          <p className="text-base font-medium text-[#888888] self-center">Invited</p>
        </div> */}
        {showFilter ? (
          <FilterComponent
            setFilteredCandidates={setFilteredMainviewProfiles}
            filteredCandidates={filteredMainviewProfiles}
            setShowFilter={setShowFilter}
            viewType={"main"}
          />
        ) : null}
        <div className={styles.CandidateHeadingWrapper}>
          <span className={styles.CandidateHeading}>Candidates</span>
          <span className={styles.Dot}>.</span>
          <span className={styles.CandidateNumber}>
            {filteredMainviewProfiles?.length}
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
            onChange={(e) => handleFilter(e.target.value)}
          ></input>
        </div> */}
        <div className={styles.inputIcons}>
          <i className={`fa fa-search ${styles.icon}`}></i>
          <CustomInput
            className={styles.inputField}
            type="text"
            placeholder="Search candidate"
            onChange={(e) => handleFilter(e.target.value)}
          />
        </div>
        {isSmallView ? null : (
          <>
            <Divider orientation="vertical" />
            <Button
              text={"Customize view"}
              className={styles.CustomBtnClass}
              onClick={handleShowCustomizeView}
            />
            <Button
              text={"Define Weightage"}
              className={styles.CustomBtnClass}
              onClick={hanldeShowEditWeightage}
            />
          </>
        )}
        {/* <span>Manage List</span> */}
        <Button text={'Manage List'} btnType={'transparent'} className={'cursor-pointer'} onClick={handleShowManageList} />
        <img
          src={Filter}
          alt="filter"
          className={"cursor-pointer"}
          onClick={handleShowFilter}
        />
      </div>
    </div>
  );
};

export default PreEvaluationDashboardMenu;
