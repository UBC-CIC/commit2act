import { Box, Paper, Typography, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import {
  getAllUsers,
  getAllSubmittedActions,
  getAllGroups,
} from '../../graphql/queries';
import { API } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import BarChart from './BarChart';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  .statValue {
    margin-top: 0.5em;
  }
`;
const Dashboard = () => {
  const [numUsers, setNumUsers] = useState();
  const [numGroups, setNumGroups] = useState();
  const [donutActionImageData, setDonutActionImageData] = useState([]);
  const [donutQuizData, setDonutQuizData] = useState();
  const [allSubmittedActions, setAllSubmittedActions] = useState();

  const getStats = async () => {
    const [totalUserRes, totalGroupRes, submittedActionRes] = await Promise.all(
      [
        API.graphql({ query: getAllUsers }),
        API.graphql({ query: getAllGroups }),
        API.graphql({ query: getAllSubmittedActions }),
      ]
    );
    setNumUsers(totalUserRes.data.getAllUsers.length);
    setNumGroups(totalGroupRes.data.getAllGroups.length);
    setAllSubmittedActions(submittedActionRes.data.getAllSubmittedActions);
  };

  const renderDonutChartData = () => {
    /** getting total actions with/without iamge for donut chart data */
    const totalActionsWithImage = allSubmittedActions.filter(
      (action) => action.submitted_image
    ).length;
    const totalActionsWithoutImage = allSubmittedActions.filter(
      (action) => !action.submitted_image
    ).length;

    setDonutActionImageData([totalActionsWithImage, totalActionsWithoutImage]);

    /** getting total actions with/without quiz question answered correctly on first attempt iamge for donut chart data */
    const totalActionsQuizCorrect = allSubmittedActions.filter(
      (action) => action.first_quiz_answer_correct
    ).length;
    const totalActionsQuizIncorrect = allSubmittedActions.filter(
      (action) => !action.first_quiz_answer_correct
    ).length;
    setDonutQuizData([totalActionsQuizCorrect, totalActionsQuizIncorrect]);
  };

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    allSubmittedActions && renderDonutChartData();
  }, [allSubmittedActions]);

  return (
    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
      <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' }, mb: '2em' }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={4} containter>
          {numUsers && (
            <StyledPaper sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h7"> Total Users</Typography>
              <Typography
                variant="h2"
                sx={{
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.2em',
                }}
                className="statValue"
              >
                <PersonIcon fontSize="large" />
                <span>{numUsers}</span>
              </Typography>
            </StyledPaper>
          )}
          {numUsers && (
            <StyledPaper
              sx={{ display: 'flex', flexDirection: 'column', mt: '1em' }}
            >
              <Typography variant="h7"> Total Groups</Typography>
              <Typography
                variant="h2"
                sx={{
                  alignSelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.2em',
                }}
                className="statValue"
              >
                <GroupsIcon fontSize="large" />
                {numGroups}
              </Typography>
            </StyledPaper>
          )}
        </Grid>
        <Grid item xs={8}>
          {allSubmittedActions && (
            <BarChart allSubmittedActions={allSubmittedActions} />
          )}
        </Grid>
      </Grid>
      <Typography variant="h2" sx={{ my: '2em' }}>
        All Time Stats
      </Typography>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={4} containter>
          {numUsers && (
            <StyledPaper
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
            >
              <Typography variant="h7">
                {' '}
                Total Number of Actions Submitted
              </Typography>
              <Typography variant="h2">{allSubmittedActions.length}</Typography>
            </StyledPaper>
          )}
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <Doughnut
              data={{
                labels: [
                  'Actions Submitted With Image',
                  'Actions Submitted Without Image',
                ],
                datasets: [
                  {
                    data: donutActionImageData,
                    backgroundColor: ['#72b4eb', '#91C788'],
                  },
                ],
              }}
              options={{
                //   responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: donutActionImageData.reduce((a, b) => a + b, 0),
                    position: 'bottom',
                  },
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper>
            <Doughnut
              data={{
                labels: [
                  'Actions With First Quiz Answer Correct',
                  'Actions With First Quiz Answer Incorrect',
                ],
                datasets: [
                  {
                    data: donutQuizData,
                    backgroundColor: ['#72b4eb', '#91C788'],
                  },
                ],
              }}
              options={{
                //   responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: donutActionImageData.reduce((a, b) => a + b, 0),
                    position: 'bottom',
                  },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
