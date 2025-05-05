import React from 'react'
import styles from "../CognitiveAnalysis/CognitiveAnalysis.module.css";
import { Bar } from 'react-chartjs-2';

function AdditionalTraits({ vmReport }) {


    // Extract achieved traits from the API response
    const achievedLabels = vmReport?.cognitionInsight?.achieved.map(item => item.trait);
    const recommendedLabels = vmReport?.cognitionInsight?.recommended.map(item => item.trait);

    // Filter labels present only in achieved (not in recommended)
    const uniqueAchievedLabels = achievedLabels?.filter(label => !recommendedLabels.includes(label));

    // Filter the achieved data for the unique labels
    const uniqueAchievedData = vmReport?.cognitionInsight?.achieved.filter(item => uniqueAchievedLabels.includes(item.trait));
    
    const data = {
        labels: uniqueAchievedLabels,
        datasets: [
            {
                data: uniqueAchievedData?.map(item => item.score),
                backgroundColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value > 7 ? 'rgba(255, 99, 132, 0.6)' : 'var(--primary-green)';
                },
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                borderRadius: 15,
            },
        ],
    };

    const options = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                stacked: true,
                max: 10,
                stepSize: 2,
                ticks: {
                    display: true, // Set display to true to show x-axis labels
                    callback: function (value, index, values) {
                        // Your logic to rotate or stagger labels
                        return value;
                    },
                },
            },
            y: {
                beginAtZero: true,
                stacked: true,
                grid: {
                    display: false, // Set to false to hide y-axis grid lines
                },
                
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className={styles.ADwrapper}>
            <h2 className={styles.Heading}>Additional Traits</h2>
            <div className={styles.RadarWrapper}>
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

export default AdditionalTraits