import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const JobNotificationComp = () => {
    const data = {
        labels: ['Pending', 'Active', 'Closed', 'Expired', 'Not Accepting', 'Archived', 'Draft'],
        datasets: [
            {
                // data: [11, 30, 20, 20, 10, 10, 10], // Values for each section
                data: [11, 30, 20, 20, 10, 10, 10], // Values for each section

                backgroundColor: [
                    '#4ADEDE', //Pending
                    '#7fcdbb', // Active
                    '#a1dab4', // Closed
                    '#8c96c6', // Expired
                    '#e31a1c', // Not Accepting
                    '#66c2a4', // Archived
                    '#a6bddb', // Draft
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        cutout: '70%', // Inner radius for the donut effect
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-72 h-72">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-semibold">100</h2>
                    <p className="text-gray-600">Total Jobs</p>
                </div>
            </div>
            <a href="/details" className="mt-4 text-blue-500 hover:underline">View Details</a>
        </div>
    );
};

export default JobNotificationComp;