import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { getStorage } from "../../../../../../service/storageService";
import {
  getInterviewApplication,
  getUserFromId,
  getPsychDetails,
} from "../../../../../../service/api";

const chartSetting = {
  yAxis: [
    {
      label: '',
    },
  ],
  width: 600, // Adjust the width as needed
  height: 300,
  barCategoryGap: 0.5, // Adjust the spacing between bars
  barGap: 2, // Adjust the gap between groups of bars
};

export default function CandidateRatingComponent({ ratingsData }) {
  const roles = Object.keys(ratingsData?.skillsFeedback);

  const transformDataForRole = (ratingsData, role) => {
    const roleData = ratingsData?.skillsFeedback[role];
    if (ratingsData !== undefined && roleData !== undefined) {
      return roleData.map(skill => ({
        evaluated: skill?.rating,
        jdSkills: skill?.proficiency,
        selfAssessed: 0,
        skills: skill?.skill,
      }));
    } else {
      console.error('ratingsData or roleData is undefined');
      return [];
    }
  };

  return (
    <div>
      {roles.map(role => {
        const dataset = transformDataForRole(ratingsData, role);
        const seriesColors = ['#046458', '#228276', '#72D2C6'];

        return (
          <div key={role}>
            <h2>{role} Ratings</h2>
            <BarChart
              key={role}
              dataset={dataset}
              xAxis={[{ scaleType: 'band', dataKey: 'skills' }]}
              series={[
                {
                  dataKey: 'evaluated',
                  label: 'interviewer rating',
                  valueFormatter: (value) => `${value}mm`,
                  color: seriesColors[0],
                },
                {
                  dataKey: 'jdSkills',
                  label: 'required rating',
                  valueFormatter: (value) => `${value}mm`,
                  color: seriesColors[1],
                },
                {
                  dataKey: 'selfAssessed',
                  label: 'self rating',
                  valueFormatter: (value) => `${value}mm`,
                  color: seriesColors[2],
                },
              ]}
              {...chartSetting}
            />
          </div>
        );
      })}
    </div>
  );
}
