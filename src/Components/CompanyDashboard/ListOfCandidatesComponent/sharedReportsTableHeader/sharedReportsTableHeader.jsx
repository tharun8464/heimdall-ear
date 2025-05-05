// import filter from "../../../assets/sharedReports/filter.svg";
// import CustomInput from "../../customInput/customInput.jsx";
import Button from "../../../Button/Button";
import CustomInput from "../../../CustomInput/CustomInput";
import styles from "./sharedReportsTableHeader.module.css";
import Filter from '../../../../assets/images/Reports/Filter.svg'
import { useState } from "react";
import ManageListComponent from "../../../ManageListComponent/ManageListComponent";

const SharedReportsTableHeader = ({
  isSmallView = false,
  customClaas,
  handleFilter,
  filteredMainviewProfiles,
  setShowFilter,
}) => {
  const [showManageList, setShowManageList] = useState(false)
  const handleShowFilter = () => {
    setShowFilter(prev => !prev);
  };

  const handleShowManageList = () => {
    setShowManageList(true)
  }

  return (
    <div
      className={`pt-3 flex justify-between w-full max-w-6xl mx-auto ${styles.DashboardMenu
        } ${customClaas ? customClaas : ""}`}
      style={{ backgroundColor: "#FFFFFF" }}>
      {
        showManageList ? (
          <ManageListComponent setShowManageList={setShowManageList} />) : null
      }
      <div className={styles.MenuWrapper}>

        <span>All</span>
        <div className={styles.CandidateHeadingWrapper}>
          <Button text={'Add Candidates'} btnType={'secondary'} />
        </div>

        <div className={styles.inputIcons}>
          <i className={`fa fa-search ${styles.icon}`}></i>
          <CustomInput
            className={styles.inputField}
            type="text"
            placeholder="Search candidate"
            onChange={e => handleFilter(e.target.value)}
          />
        </div>
        {isSmallView ? null : (
          <>
          </>
        )}
        <div className="ml-auto flex gap-4">

          <span className="text-[var(--primary-green)] cursor-pointer" onClick={handleShowManageList}>
            Manage Lists
          </span>
          <img
            src={Filter}
            alt="filter"
            className={"cursor-pointer "}
            onClick={handleShowFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedReportsTableHeader;
