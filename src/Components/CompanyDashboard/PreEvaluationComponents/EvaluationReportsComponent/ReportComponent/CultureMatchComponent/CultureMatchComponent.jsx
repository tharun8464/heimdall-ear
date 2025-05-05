import styles from "./CultureMatchComponent.module.css";
import MatchBar from "../../../../../../assets/images/Reports/MatchBar.svg";
import MatchIndicator from "../../../../../../assets/images/Reports/MatchIndicator.png";
import ColorBar from "./ColorBar";
import ProgressLine from "../../../ProgressBar/ProgressLine";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useReport from "../../../../../../Hooks/useReport";

const CultureMatchComponent = ({
  cultDetailsData,
  selectedCandidate,
  companyName,
  isMainView,
  jobTitle,
}) => {
  const { handleGetCultHire, handleGetCultExp, handleGetCultTile } =
    useReport();

  const { cultExpData } = useSelector((state) => state.report);
  const { cultTileData } = useSelector((state) => state.report);
  const { cultHireData } = useSelector((state) => state.report);

  useEffect(() => {
    const data = {
      OrganizationName: companyName,
      CandidateProfileId: isMainView
        ? selectedCandidate?.indiProfileId
        : selectedCandidate?.mProfileId,
    };

    handleGetCultHire(data);
  }, [selectedCandidate]);

  useEffect(() => {
    const data = {
      OrganizationName: companyName,
      CandidateProfileId: isMainView
        ? selectedCandidate?.indiProfileId
        : selectedCandidate?.mProfileId,
      TotalExperience: selectedCandidate?.totalExp,
    };

    handleGetCultExp(data);
  }, [selectedCandidate]);

  useEffect(() => {
    const data = {
      OrganizationName: companyName,
      CandidateProfileId: isMainView
        ? selectedCandidate?.indiProfileId
        : selectedCandidate?.mProfileId,
      JobTitle: isMainView
        ? selectedCandidate?.indiProfileData?.[0]?.title
        : selectedCandidate?.companyRole,
    };

    handleGetCultTile(data);
  }, [selectedCandidate]);

  const { Data } = cultDetailsData;
  if (!Data) {
    return null;
  }

  const experiencePercentage = cultExpData?.Data?.FlippedMatchPercentage ?? 0;
  const titlePercentage = cultTileData?.Data?.FlippedMatchPercentage ?? 0;
  const hirePercentage = cultHireData?.Data?.FlippedMatchPercentage ?? 0;

  //console.log("left", matchPercentage)
  const totalScore = Data?.ConfidenceScoreOrganization;
  const integerTotalScore = totalScore ? Math.round(totalScore) : null;

  return (
    <div className={styles.Wrapper}>
      <div className="flex justify-between items-center">
        <h2 className={styles.Heading}>Cultural match within {companyName}</h2>
        <div className="flex items-center  border b-2 text-[14px] text-black font-[400] py-2 px-3 rounded-2xl">
          <div className="w-3 h-3 bg-[#228276] rounded-full mr-2"></div>
          Data confidence: {integerTotalScore}
        </div>
      </div>

      <div>
        <div className={styles.MatchInfo}>
          <span className={styles.Title}>Comparable title</span>
          {cultTileData?.Data?.FlippedMatchPercentage ? (
            <div className="flex space-x-1">
              <div className={styles.IndicatorCont}>
                <ProgressLine
                  compatibilityScore={titlePercentage}
                  background="#fafafa;"
                  visualParts={[
                    {
                      percentage: "40%",
                      color: "#D6615A",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "20%",
                      color: "#D99442",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "15%",
                      color: "#228276",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "25%",
                      color: "#9747FF",
                      progressPercentage: 0,
                    },
                  ]}
                />
              </div>
              <p>{titlePercentage}</p>
            </div>
          ) : (
            <div>No Data</div>
          )}
        </div>

        <div className={styles.MatchInfo}>
          <span className={styles.Title}>Comparable experiences</span>
          {cultExpData?.Data?.FlippedMatchPercentage ? (
            <div className="flex space-x-1">
              <div className={styles.IndicatorCont}>
                <ProgressLine
                  compatibilityScore={experiencePercentage}
                  background="#fafafa;"
                  visualParts={[
                    {
                      percentage: "40%",
                      color: "#D6615A",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "20%",
                      color: "#D99442",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "15%",
                      color: "#228276",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "25%",
                      color: "#9747FF",
                      progressPercentage: 0,
                    },
                  ]}
                />
              </div>
              <p>{experiencePercentage}</p>
            </div>
          ) : (
            <div> No Data </div>
          )}
        </div>
        <div className={styles.MatchInfo}>
          <span className={styles.Title}>Recent hiring</span>
          {cultHireData?.Data?.FlippedMatchPercentage ? (
            <div className="flex space-x-1">
              <div className={styles.IndicatorCont}>
                <ProgressLine
                  compatibilityScore={hirePercentage}
                  background="#fafafa;"
                  visualParts={[
                    {
                      percentage: "40%",
                      color: "#D6615A",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "20%",
                      color: "#D99442",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "15%",
                      color: "#228276",
                      progressPercentage: 0,
                    },
                    {
                      percentage: "25%",
                      color: "#9747FF",
                      progressPercentage: 0,
                    },
                  ]}
                />
              </div>
              <p>{hirePercentage}</p>
            </div>
          ) : (
            <div>No Data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CultureMatchComponent;
