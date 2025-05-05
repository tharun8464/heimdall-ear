import React from 'react'
import styles from "./CognitiveAnalysis.module.css";
import { Radar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import AdditionalTraits from '../AdditionalTraits/AdditionalTraits';
import CognitInterpret from '../CognitInterpret/CognitInterpret';

function CognitiveAnalysis({ vmReport }) {



  const originalNumber = vmReport?.cognitionInsight?.dataConfidience;


  const formattedNumber = (originalNumber ?? 0).toFixed(2);



  const recommendedData = vmReport?.cognitionInsight?.recommended;
  const achievedData = vmReport?.cognitionInsight?.achieved;

  const labels = recommendedData?.map(item => item.trait);

  // Mapping the recommended and achieved scores to the respective traits
  const recommendedScores = recommendedData?.map(item => item.score);

  // Filtering achieved data based on recommended labels
  const achievedScores = achievedData
    ?.filter(item => labels.includes(item.trait))
    .map(item => item.score);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Recommended',
        data: recommendedScores,
        backgroundColor: 'rgba(75,192,192,0.4)',
        fill: false,
        borderColor: '#228276 ',
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: 'Achieved',
        data: achievedScores,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: ' #D99442',
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };
  const options = {
    scales: {
      r: {
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },

    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className={styles.Wrapper}>
      <div className='flex justify-between items-center'>

        <h2 className={styles.Heading}>Cognitive Analysis</h2>
        <div className="flex items-center  border b-2 text-[14px] text-black font-[400] py-2 px-3 rounded-2xl"

        >
          <div className="w-3 h-3 bg-[#228276] rounded-full mr-2"></div>
          Data confidence: {formattedNumber}%
        </div>
      </div>
      <div className={styles.RadarWrapper}>
        <Radar data={data} options={options} />
      </div>
      <AdditionalTraits vmReport={vmReport} />
      <CognitInterpret narrat={vmReport?.cognitionInsight} />
    </div>
  )
}

export default CognitiveAnalysis