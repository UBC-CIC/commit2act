import * as React from 'react';
import { useUserStats } from '../hooks/use-user-stats';
import { Box, Typography } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import useTranslation from './customHooks/translations';

const chartHeight = '6.25rem';
const chartWidth = '8.5rem';
const chartFullWidth = '12.5rem';

const chartOuterStyles = {
  flex: `0 0 ${chartWidth}`,
  position: 'relative',
  overflow: 'visible',
  height: chartHeight,
  width: chartWidth,
};

const chartInnerStyles = {
  height: chartHeight,
  width: chartFullWidth,
  position: 'absolute',
  top: '-0.5rem',
  left: '0',
};

const getDoughnutOptions = (title, displayTitle) => ({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: displayTitle,
      text: title,
      position: 'top',
      color: '#eee',
      font: {
        size: 12,
        weight: 'normal',
      },
    },
  },
});

export const UserStatsCharts = ({ group }) => {
  const { statsArray } = useUserStats(group);
  const translation = useTranslation();

  if (!statsArray) {
    return (
      <Typography variant="h3" component="p">
        Log actions to see where you rank amongst your group!
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      }}
    >
      {statsArray.map(({ groupTotal, contribution, title }) => (
        <Box key={title} sx={chartOuterStyles}>
          <Box sx={chartInnerStyles}>
            <Doughnut
              data={{
                labels: [
                  translation.allOtherMembers,
                  translation.myContribution,
                ],
                datasets: [
                  {
                    data: [groupTotal, contribution],
                    backgroundColor: ['#808080', '#91C788'],
                  },
                ],
              }}
              options={getDoughnutOptions(
                translation[title],
                !(contribution === 0 && groupTotal === 0)
              )}
              height={300}
              width={600}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};
