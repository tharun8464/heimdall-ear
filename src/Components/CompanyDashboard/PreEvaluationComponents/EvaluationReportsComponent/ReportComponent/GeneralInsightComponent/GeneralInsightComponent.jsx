import styles from "./GeneralInsightComponent.module.css";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import TextAndChipComponent from "./TextAndChipComponent/TextAndChipComponent";
import { ArrowCircleDown } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";
import TextSumChip from "./TextSumChip/TextSumChip";
import { useEffect, useState } from "react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const GeneralInsightComponent = () => {
  const { psychDetailsData } = useSelector((state) => state.report);
  const { vmProData } = useSelector((state) => state.report);

  const [strengthItems, setStrengthItems] = useState([]);
  const [weaknessItems, setWeaknessItems] = useState([]);
  const [sumPoints, setSumPoints] = useState([]);

  const { vmReport } = vmProData ?? {};
  // console.log("vmReport:", vmReport);

  const { calculatedData } = psychDetailsData ?? {};

  const generalInsights = calculatedData?.GeneralInsights ?? {};
  const strengthByHighestScore = vmReport?.saw;
  const weaknessByLowestScore = vmReport?.saw;
  const summary = vmReport?.personalityInsight;
  
  useEffect(() => {
    if (strengthByHighestScore?.strength) {
      const newStrengthItems = strengthByHighestScore.strength.map(
        (strength, index) => ({
          title: strength,
        })
      );
      setStrengthItems(newStrengthItems);
    }

    if (weaknessByLowestScore?.weakness) {
      const newWeaknessItems = weaknessByLowestScore.weakness.map(
        (weakness, index) => ({
          title: weakness,
        })
      );
      setWeaknessItems(newWeaknessItems);
    }

    if (summary?.narrations) {
      const newSumPoints = summary.narrations.map((narration, index) => ({
        title: narration,
      }));
      setSumPoints(newSumPoints);
    }
  }, [strengthByHighestScore, weaknessByLowestScore, summary]);

  var options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  const data = {
    labels: Object.keys(generalInsights).map(
      (label) =>
        `${label?.charAt(0)?.toUpperCase()}${label?.slice(1)}: ${
          generalInsights[label]
        }`
    ),
    datasets: [
      {
        data: Object.values(generalInsights),
        backgroundColor: "#2282761a",
        borderColor: "#228276",
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.Heading}>General Insights</h2>
      {Object.keys(generalInsights).length > 0 ? (
        <div className={styles.RadarWrapper}>
          <Radar width={50} height={50} data={data} options={options} />
        </div>
      ) : (
        <div>No data available</div>
      )}
      <hr />
      <div className={styles.BottomSection}>
        <div className={styles.HeadingWrapper}>
          <h2 className={styles.Heading}>Summary</h2>
        </div>
        <div className={styles.ContentsumWrapper}>
          {sumPoints && sumPoints.length > 0 ? (
            sumPoints?.map(({ title }) => (
              <TextSumChip title={title} chipType="success" />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className={styles.HeadingWrapper}>
          <h2 className={styles.Heading}>Probable strengths </h2>
          <ArrowCircleUpIcon
            fontSize="small"
            sx={{ color: "var(--primary-green)" }}
          />
        </div>
        <div className={styles.ContentWrapper}>
          {strengthItems && strengthItems.length > 0 ? (
            strengthItems.map(({ title }) => (
              <TextAndChipComponent
                key={title}
                title={title}
                chipType="success"
              />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className={styles.SuggestionHeadingWrapper}>
          <div className={styles.HeadingWrapper}>
            <h2 className={styles.Heading}>Probable areas of improvement </h2>
            <ArrowCircleDown
              fontSize="small"
              sx={{ color: "var(--red-error)" }}
            />
          </div>
          {/* <div className={styles.SuggestionHeading}>
            <CircleIcon
              color="var(--brown-warning)"
              sx={{ fontSize: ".6rem", color: "var(--brown-warning)" }}
            />
            <span>Our Suggesstions</span>
          </div> */}
        </div>
        <div className={styles.ContentWrapper}>
          {weaknessItems && weaknessItems.length > 0 ? (
            weaknessItems.map(({ title }) => (
              <TextAndChipComponent
                key={title}
                title={title}
                chipType="warning"
              />
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralInsightComponent;
