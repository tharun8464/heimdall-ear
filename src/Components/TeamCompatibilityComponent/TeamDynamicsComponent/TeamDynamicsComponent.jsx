import { AiOutlinePlus } from "react-icons/ai";
import styles from "./TeamDynamicsComponent.module.css";

import ProgressLine from "../ProgressBar/ProgressLine";
import DefineWeightageComponent from "./DefineWeightageComponent";
import { useEffect, useState } from "react";
import { Popover } from "@headlessui/react";


function TeamDynamicsComponent({ teamData, candidatesData, clickedPod, isTeam }) {
  
  const [showWeightage, setShowWeightage] = useState(false);
 
  useEffect(() => { }, [showWeightage]);

  let teamPodData
  clickedPod?.map((click) => (
    // //console.log"cp" , click)
    teamPodData = click
  ))
  const overallBalance = teamData?.summarized?.overallBalance;
  let teamBalance = "";

  if (overallBalance === "Positive") {
    teamBalance = "Positively";
  } else if (overallBalance === "Slight Negative") {
    teamBalance = "Slightly Negatively";
  } else if (overallBalance === "Negative") {
    teamBalance = "Negatively";
  } else {
    teamBalance = "Neutrally"; // Default value if the string doesn't match any of the expected values
  }
const [updatedCompatibilityScore,setUpdatedCompatibilityScore]=useState();
  let teamCompatibilityScore = teamData?.summarized?.overallCompatibility;
  teamCompatibilityScore = Math.round(teamCompatibilityScore * 100);
  
  let memScore;
  let compatibilityScore = teamCompatibilityScore?teamCompatibilityScore * 6.30:2;  

  if (teamCompatibilityScore >= 85) {
    memScore = "High+";
  } else if (teamCompatibilityScore >= 75) {
    memScore = "High";
  } else if (teamCompatibilityScore >= 65) {
    memScore = "Medium";
  } else {
    memScore = "Low";
  }

  const handleShowWeightage = () => {
    setShowWeightage(true);
    //setShowWeightage((prev) => !prev);
  }

  const handlePopoverClick = (event) => {
    // Prevent clicks inside the popover from closing it
    event.stopPropagation();
  };

  // Calculate the color based on the teamCompatibilityScore
  let memScoreBackColor;
  let memScoreTextColor;
  if (teamCompatibilityScore >= 85) {
    memScoreBackColor = '#e3cfef';
    memScoreTextColor ='#9747FF';
  } else if (teamCompatibilityScore >= 75) {
    memScoreBackColor = '#cdebe8';
    memScoreTextColor ='#228276';
  } else if (teamCompatibilityScore >= 65) {
    memScoreBackColor = '#f3f3dc';
    memScoreTextColor ='#D99442';
  } else {
    memScoreBackColor = '#f3dfdc';
    memScoreTextColor ='#D6615A';
  }

  // Use the calculated color in the style
  const memScoreStyle = {
    backgroundColor: memScoreBackColor,
    color:memScoreTextColor,
  };

  return (
    <>
      <div className={styles.Wrapper}>
        <div
          className={styles.Common}
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <h6 className={styles.MainHeading}>Team Dynamics</h6>
          </div>

         { isTeam ?(null):(
          <div>
            <Popover preventBodyScroll>
                <Popover.Button className={styles.SelectPopoverButton} onClick={handleShowWeightage}>Define Weightage</Popover.Button>
              <Popover.Panel className={styles.SelectPopoverPanel} style={{ display: showWeightage ? "block" : "none", marginLeft: "-75px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }} onClick={handlePopoverClick}>
                <DefineWeightageComponent candidatesData={candidatesData}/>
              </Popover.Panel>
            </Popover>
       
          </div>)}
        </div>
        <div className={`${styles.Common} ${styles.TextCont}`}>
          <p className={styles.TextStyle}>
            Adding <b>{candidatesData?.firstName} {candidatesData?.lastName} </b> to the team may impact overall
            balance
            <span> <b>{teamBalance}</b> </span>
          </p>
        </div>
        <div className={styles.SecondCont}>
          <div className={styles.Common} style={{ justifyContent: "space-between" }}>
            <p>Compatibility</p>
            <div className={`${styles.Common} ${styles.IconBox}`} style={memScoreStyle}>
              <p>{memScore}</p>
              {/* <AiOutlinePlus></AiOutlinePlus> */}
            </div>
          </div>
          <div className={styles.IndicatorCont}>
            {/* <div className={`${styles.MatchIndicatorWrapper}`}>
              <img src={MatchIndicator} alt="" className={styles.Indicator} />
              <img className={styles.FullWidth} src={MatchBar} alt="" />
            </div> */}

            <ProgressLine
              compatibilityScore={compatibilityScore}
              background="#fafafa;"
              visualParts={[
                {
                  percentage: "65%",
                  color: "#D6615A",
                  progressPercentage: 0

                },
                {
                  percentage: "10%",
                  color: "#D99442",
                  progressPercentage: 0
                },
                {
                  percentage: "10%",
                  color: "#228276",
                  progressPercentage: 0
                },
                {
                  percentage: "15%",
                  color: "#9747FF",
                  progressPercentage: 0
                }
              ]}

            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamDynamicsComponent;