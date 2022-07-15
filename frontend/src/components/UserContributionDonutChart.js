import React from 'react';
import { Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

const UserContributionDonutChart = ({ data, displayTitles }) => {
  const { groupTotal, contribution, title } = data;

  return (
    <Box
      sx={{
        height: displayTitles ? '100px' : '50px',
        width: '200px',
      }}
    >
      <Doughnut
        data={{
          labels: ['All Other Members', 'My Contribution'],
          datasets: [
            {
              data: [groupTotal, contribution],
              backgroundColor: ['#808080', '#91C788'],
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display:
                contribution === 0 && groupTotal === 0 ? false : displayTitles,
              text: title,
              position: 'top',
              font: {
                size: 12,
                weight: 'normal',
              },
            },
          },
        }}
        height={300}
        width={600}
      />
    </Box>
  );
};

export default UserContributionDonutChart;
