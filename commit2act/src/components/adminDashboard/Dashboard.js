import { Box, Paper, Typography, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut, Bar } from 'react-chartjs-2';
import { getAllUsers, getAllSubmittedActions } from '../../graphql/queries';
import { API } from 'aws-amplify';
import {
  startOfWeek,
  endOfWeek,
  format,
  eachDayOfInterval,
  sub,
} from 'date-fns';

const Dashboard = () => {
  const [numUsers, setNumUsers] = useState();
  const [barChartData, setBarChartData] = useState();

  //get all dates in the current week
  const startingDate = sub(new Date(), { days: 30 });
  const endingDate = new Date();
  const datesInInterval = eachDayOfInterval({
    start: startingDate,
    end: endingDate,
  });
  const formattedDatesInInterval = datesInInterval.map((date) =>
    format(date, 'yyyy-MM-dd')
  );

  const getStats = async () => {
    const [totalUserRes, submittedActionRes] = await Promise.all([
      API.graphql({ query: getAllUsers }),
      API.graphql({ query: getAllSubmittedActions }),
    ]);
    setNumUsers(totalUserRes.data.getAllUsers.length);

    /** getting bar chart data */
    const allSubmittedActions = submittedActionRes.data.getAllSubmittedActions;
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
    getStats();
  }, []);

  return (
    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
      <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' }, mb: '2em' }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          {numUsers && (
            <Paper>
              Total Users
              <Typography variant="h2">{numUsers}</Typography>
            </Paper>
          )}
          <Paper>
            <Doughnut
              data={{
                labels: [
                  'Actions Submitted With Image',
                  'Actions Submitted Without Image',
                ],
                datasets: [
                  { data: [1, 2], backgroundColor: ['#72b4eb', '#91C788'] },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
              height={200}
              width={200}
            />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper>
            <Typography variant="subtitle2" sx={{ mb: '1.5em' }}>
              Actions submitted during the past 30 days
            </Typography>
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
                    },
                    y: {
                      stacked: true,
                    },
                  },
                }}
                height={300}
                width={600}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
