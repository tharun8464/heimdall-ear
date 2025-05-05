import styles from "./CompatibilityTableComponent.module.css";
import MatchBar from "../../../assets/images/Reports/MatchBar.svg";
import MatchIndicator from "../../../assets/images/Reports/MatchIndicator.png";
import Button from "../../Button/Button";
import TablePodCard from "./TablePodCard/TablePodCard";
import ProgressLine from "../ProgressBar/ProgressLine";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomChip from "../../CustomChip/CustomChip";

function CompatibilityTableComponent({
  teamData,
  candidatesData,
  clickedPod,
  allPods,
  setPodsData,
  podsData,
  selectedPods,
}) {
  let clickedPodData = [];
  clickedPodData?.push(allPods[0]);
  if (teamData !== null) {
    for (const pod of teamData?.summarized?.pods) {
      if (pod?.podId === clickedPod[0]?._id) {
        clickedPodData.pop();
        clickedPodData = pod;
        break;
      }
    }
  }

  //console.log(teamData)
  //console.log(clickedPod)
  //console.log(allPods)
  // console.log(clickedPodData)
  // console.log(selectedPods)

  //const [selectedPod, setSelectedPod] = useState(teamData?.summarized?.pods[0]);

  const [selectedPod, setSelectedPod] = useState(
    ...teamData?.summarized?.pods?.filter(
      pod => pod?.podId === (selectedPods?.[0]?._id || selectedPods?.[0]?.podId),
    ),
  );
  const [memScore, setMemScore] = useState("");
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  //const [teamPodData, setTeamPodData] = useState(teamData?.summarized?.pods[0]);
  const [teamPodData, setTeamPodData] = useState(
    ...teamData?.summarized?.pods?.filter(
      pod => pod?.podId === (clickedPod[0]?._id || clickedPod[0]?.podId),
    ),
  );
  const [onClickedPod, setOnClickedPod] = useState();
  const { allPodsData } = useSelector(state => state.pod);
  const [podData, setPodData] = useState([]);

  useEffect(() => {
    setOnClickedPod(clickedPod[0]);
  }, []);

  useEffect(() => {
    setPodData(allPods?.length !== 0 ? allPods : allPodsData);
  }, [allPods]);

  useEffect(() => {
    let teamCompatibilityScore = !selectedPod
      ? teamPodData?.compatibilityResults?.[0]?.compatibility?.teamCompatibilityScore
      : selectedPod?.compatibilityResults?.[0]?.compatibility?.teamCompatibilityScore;
    //alert(teamCompatibilityScore)
    teamCompatibilityScore = Math.round(teamCompatibilityScore * 100);
    let compatibilityScore = teamCompatibilityScore ? teamCompatibilityScore * 3.25 : 2;
    setCompatibilityScore(compatibilityScore);
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
    setMemScore(memScore);
  }, [clickedPod, selectedPods, allPods]);

  useEffect(() => { }, [teamPodData]);

  const handleClickPod = async pod => {
    //setSelectedPod(pod);

    setSelectedPod(...teamData?.summarized?.pods.filter(item => item.podId === pod._id));
    setOnClickedPod(pod);
    setPodsData([pod]);
  };

  const getChipType = () => {
    if (memScore === "Low") {
      return "error";
    } else if (memScore === "High") {
      return "success";
    } else if (memScore === "Medium") {
      return "warning";
    } else if (memScore === "High+") {
      return "high-plus";
    }
  };

  return (
    <>
      <div>
        <div className={styles.TopContainer}>
          <div className={styles.Common} style={{ gap: "12px" }}>
            <div>
              <h6>Compatibility</h6>
            </div>
            {/* <div className={styles.TextBox}>
              <p>{memScore}</p>
            </div> */}
            <CustomChip label={memScore} type={getChipType()} />
          </div>
          <div className={styles.IndicatorCont}>
            {/* <div className={`${styles.MatchIndicatorWrapper}`}>
               <img src={MatchIndicator} alt="" className={styles.Indicator} /> 
              <img className={styles.FullWidth} src={MatchBar} alt="" />  
              </div>          */}

            <ProgressLine
              compatibilityScore={compatibilityScore}
              background="#fafafa;"
              style={{ height: "7px" }}
              visualParts={[
                {
                  percentage: "65%",
                  color: "#D6615A",
                  progressPercentage: 0,
                },
                {
                  percentage: "10%",
                  color: "#D99442",
                  progressPercentage: 0,
                },
                {
                  percentage: "10%",
                  color: "#228276",
                  progressPercentage: 0,
                },
                {
                  percentage: "15%",
                  color: "#9747FF",
                  progressPercentage: 0,
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.MiddleContainer} style={{ margin: "auto" }}>
          {podData?.map(pod => (
            <Button
              key={pod?.name}
              className={`${styles.BtnStyleNotSelected} ${pod === onClickedPod ? styles.BtnStyle : ""
                }`}
              btnType={"secondary"}
              text={pod?.name}
              onClick={pod === onClickedPod ? null : () => handleClickPod(pod)}
            />
          ))}
        </div>

        <div>
          {
            //clickedPodData1[0]?.compatibility?.scores?.map((dynamicsData) => {
            // return <TablePodCard {...dynamicsData} teamData = {teamData} candidatesData = {candidatesData} clickedPod = {clickedPod} clickedPodData = {clickedPodData} />
            //return <TablePodCard  {...dynamicsData} />
            //})[selectedPod][0]
            //clickedPod?.map(item=>item.compatibility?.scores?.map((dynamicsData)=>{clickedPod[0]
            clickedPod[0]?.compatibilityResults?.[0]?.compatibility?.scores?.map(dynamicsData => {
              return <TablePodCard {...dynamicsData} />;
            })
          }
          {
            //clickedPod[0]?.members?.map((dynamicsData) => { [clickedPodData][0]
            [clickedPodData][0]?.compatibilityResults?.[0]?.compatibility?.scores?.map(dynamicsData => {
              //return <TablePodCard {...dynamicsData} teamData = {teamData} candidatesData = {candidatesData} clickedPod = {clickedPod} clickedPodData = {clickedPodData} />
              return <TablePodCard {...dynamicsData} />;
            })
          }
        </div>
      </div>
    </>
  );
}

export default CompatibilityTableComponent;
