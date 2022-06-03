import {
  Box,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { format, eachDayOfInterval, sub } from 'date-fns';
import 'chartjs-adapter-date-fns';
import FilterListIcon from '@mui/icons-material/FilterList';
import 'chartjs-adapter-date-fns';

const BarChart = ({ allSubmittedActions }) => {
  const [barChartData, setBarChartData] = useState();
  const filters = ['7 Days', '30 Days', 'Year'];
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  /** functions for filter menu */
  const handleClick = (e) => {
    setFilterMenuAnchor(e.currentTarget);
    setOpenFilterMenu(true);
  };

  const handleClose = () => {
    setFilterMenuAnchor(null);
    setOpenFilterMenu(false);
  };

  /** gets actions within the set date interval for actions with/without image */
  const getBarChartData = () => {
    let startingDate;
    let endingDate;
    let currentDate = new Date();
    if (selectedFilter === filters[0]) {
      startingDate = sub(currentDate, { days: 7 });
      endingDate = currentDate;
    } else if (selectedFilter === filters[1]) {
      startingDate = sub(currentDate, { days: 30 });
      endingDate = currentDate;
    } else if (selectedFilter === filters[2]) {
      startingDate = sub(currentDate, { years: 1 });
      endingDate = currentDate;
    }
    const datesInInterval = eachDayOfInterval({
      start: startingDate,
      end: endingDate,
    });
    const formattedDatesInInterval = datesInInterval.map((date) =>
      format(date, 'yyyy-MM-dd')
    );
    //filter all submitted actions to only get actions for the current time interval
    const intervalSubmittedActions = allSubmittedActions.filter((action) =>
      formattedDatesInInterval.includes(action.date_of_action.split('T')[0])
    );
    //create array of the # of actions submitted with an image each day for the current time interval
    const numActionsWithImagePerDay = formattedDatesInInterval.map(
      (date) =>
        intervalSubmittedActions.filter(
          (action) =>
            action.date_of_action.split('T')[0] === date &&
            action.submitted_image
        ).length
    );
    //create array of the # of actions submitted without an image each day for the current time interval
    const numActionsWithoutImagePerDay = formattedDatesInInterval.map(
      (date) =>
        intervalSubmittedActions.filter(
          (action) =>
            action.date_of_action.split('T')[0] === date &&
            !action.submitted_image
        ).length
    );
    //create object where keys are current time intervals's dates, values are # of actions submitted with an image that day
    let data = {};
    for (let i = 0; i < formattedDatesInInterval.length; i++) {
      data[formattedDatesInInterval[i]] = {
        actionsWithImage: numActionsWithImagePerDay[i],
        actionsWithoutImage: numActionsWithoutImagePerDay[i],
      };
    }
    setBarChartData(data);
  };

  useEffect(() => {
    getBarChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  return (
    <Paper sx={{ p: '1em' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: '1.5em',
        }}
      >
        <Typography variant="subtitle2">
          Actions submitted during the past {selectedFilter}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Tooltip title="Apply Filter">
            <IconButton onClick={handleClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="filter-menu"
            open={openFilterMenu}
            anchorEl={filterMenuAnchor}
            onClose={handleClose}
          >
            {filters.map((filter, index) => (
              <MenuItem key={index} onClick={() => setSelectedFilter(filter)}>
                {filter}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      {barChartData && (
        <Bar
          data={{
            labels: Object.keys(barChartData),
            datasets: [
              {
                label: 'Number of Actions Submitted With Image',
                data: Object.values(barChartData).map(
                  (data) => data.actionsWithImage
                ),
                backgroundColor: ['#72b4eb'],
              },
              {
                label: 'Number of Actions Submitted Without Image',
                data: Object.values(barChartData).map(
                  (data) => data.actionsWithoutImage
                ),
                backgroundColor: ['#91C788'],
              },
            ],
          }}
          options={{
            scales: {
              x: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Date',
                  padding: {
                    top: 20,
                  },
                },
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MM/dd',
                  },
                  tooltipFormat: 'MMM dd yyyy',
                },
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Actions Submitted',
                  padding: {
                    bottom: 20,
                  },
                },
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              responsive: true,
              maintainAspectRatio: false,
            },
          }}
          height={300}
          width={600}
        />
      )}
    </Paper>
  );
};

export default BarChart;
