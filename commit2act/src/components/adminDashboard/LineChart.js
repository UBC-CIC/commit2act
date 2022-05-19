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
import { Line } from 'react-chartjs-2';
import { format, eachDayOfInterval, sub } from 'date-fns';
import 'chartjs-adapter-date-fns';
import FilterListIcon from '@mui/icons-material/FilterList';
import 'chartjs-adapter-date-fns';

const LineChart = ({ allSubmittedActions }) => {
  const [lineChartData, setLineChartData] = useState();
  const filters = ['7 Days', '30 Days'];
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
  const getLineChartData = () => {
    let startingDate;
    let endingDate;
    let currentDate = new Date();
    if (selectedFilter === filters[0]) {
      startingDate = sub(currentDate, { days: 7 });
      endingDate = currentDate;
    } else if (selectedFilter === filters[1]) {
      startingDate = sub(currentDate, { days: 30 });
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
    //group all actions with the same date together
    const co2ValuesPerDay = intervalSubmittedActions.reduce((prev, curr) => {
      (prev[curr.date_of_action.split('T')[0]] =
        prev[curr.date_of_action.split('T')[0]] || []).push(curr.g_co2_saved);
      return prev;
    }, {});

    //add up all the co2 values for each date in groupedData
    const totalCO2PerDay = Object.fromEntries(
      Object.entries(co2ValuesPerDay).map(([date, values]) => [
        date,
        values.reduce((partialSum, a) => partialSum + a, 0),
      ])
    );

    setLineChartData(totalCO2PerDay);
  };

  useEffect(() => {
    getLineChartData();
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
          CO2 Saved during the past {selectedFilter}
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
      {lineChartData && (
        <Line
          data={{
            labels: Object.keys(lineChartData),
            datasets: [
              {
                label: 'g CO2 Saved Per Day',
                data: Object.values(lineChartData),
                backgroundColor: ['#91C788'],
              },
            ],
          }}
          options={{
            scales: {
              x: {
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
                  tooltipFormat: 'MMM dd',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'g CO2 Saved',
                  padding: {
                    bottom: 20,
                  },
                },
              },
            },
            plugins: {
              responsive: true,
              maintainAspectRatio: false,
            },
          }}
          height={50}
          width={200}
        />
      )}
    </Paper>
  );
};

export default LineChart;
