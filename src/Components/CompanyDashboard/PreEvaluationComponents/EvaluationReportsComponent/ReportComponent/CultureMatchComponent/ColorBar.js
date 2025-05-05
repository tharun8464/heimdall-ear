import React from 'react';

const ColorBar = ({ percentages }) => {
  const totalPercentage = percentages.reduce((acc, percent) => acc + percent, 0);

  if (totalPercentage !== 100) {
    console.error('Error: Percentages should add up to 100.');
    return null;
  }

  return (
    <div style={{ display: 'flex', width: '35%', height: '8px' }}>
      <div style={{ flex: percentages[0], backgroundColor: '#D6615A' }}></div>
      <div style={{ flex: percentages[1], backgroundColor: '#D99442' }}></div>
      <div style={{ flex: percentages[2], backgroundColor: '#228276' }}></div>
      <div style={{ flex: percentages[3], backgroundColor: 'yellow' }}></div>
    </div>
  );
};

export default ColorBar;