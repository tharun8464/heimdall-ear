import { CgOrganisation } from "react-icons/cg";
import { useEffect, useState } from "react";
import styles from "./PercentageComponent.module.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router";
import usePreEvaluation from "../../../../../Hooks/usePreEvaluation";

const PercentageComponent = ({ title, logoSrc, percentage }) => {

 


  return (
    <div className={styles.Wrapper}>
      <div className={styles.Header}>
        <div className={styles.LogoWrapper}>
          <img src={logoSrc} alt={title} className={styles.Logo} />
          <span className={styles.Title}>{title}</span>
        </div>
        <span className={styles.Percentage}>{percentage}%</span>
      </div>
      <ProgressBar
        barContainerClassName={styles.BarContainerClassName}
        customLabel={null}
        completed={percentage}
        className={styles.ProgressBar}
        // completedClassName={styles.CompletedBar}
        bgColor="var(--primary-green)"
        baseBgColor={"var(--border-grey)"}
        borderRadius="14px"
        height=".6rem"
        isLabelVisible={false}
      />
    </div>
  );
};

export default PercentageComponent;
