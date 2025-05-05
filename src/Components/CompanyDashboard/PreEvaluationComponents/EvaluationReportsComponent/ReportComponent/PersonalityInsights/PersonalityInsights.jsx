import InsightComponent from "./InsightComponent/InsightComponent";
import styles from "./PersonalityInsights.module.css";
import { useSelector } from "react-redux";

const PersonalityInsights = ({ vmReport, chipsRef }) => {
  const { psychDetailsData } = useSelector((state) => state.report);
  if (!psychDetailsData) {
    return null;
  }
  const { profile, calculatedData } = psychDetailsData;
  if (!calculatedData || !profile) {
    return null;
  }

  const PersonalityInsights = calculatedData.PersonalityInsights;

  const Q1percentage = PersonalityInsights.q1;

  const Q2percentage = PersonalityInsights.q2;

  const Q3percentage = PersonalityInsights.q3;

  const Q4percentage = PersonalityInsights.q4;

  const Q5percentage = PersonalityInsights.q5;

  const Q6percentage = PersonalityInsights.q6;

  const Q7percentage = PersonalityInsights.q7;




  const personalityData = vmReport?.personalityInsight?.personality || [];

  // Map the API data to the format you need for rendering

  const Qpercentage = [Q1percentage, Q2percentage, Q3percentage, Q4percentage, Q5percentage, Q6percentage, Q7percentage];
  const data = personalityData.map((item, index) => ({
    chips: item.tags,
    text: item.category,
    // Assuming you have some percentage value from your API; replace this with actual data
    percentage: Qpercentage[index], // Replace with the actual percentage value from the API
  }));

  return (
    <div className={styles.Wrapper}>
      <h2 className={styles.Heading}>Personality Insights</h2>
      {data.length > 0 ? (
        data.map(({ chips, text, percentage }, index) => (
          <InsightComponent key={index} chips={chips} text={text} percentage={percentage} chipsRef={chipsRef} />
        ))
      ) : (
        <p>No data available.</p>
      )}
    </div>


  );
};

export default PersonalityInsights;
