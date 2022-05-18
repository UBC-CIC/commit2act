import { Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
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
import GlobalLeaderboard from '../GlobalLeaderboard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

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

  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    const renderDonutChartData = () => {
      /** getting total actions with/without image for donut chart data */
      const totalActionsWithImage = allSubmittedActions.filter(
        (action) => action.submitted_image
      ).length;
      const totalActionsWithoutImage = allSubmittedActions.filter(
        (action) => !action.submitted_image
      ).length;

      setDonutActionImageData([
        totalActionsWithImage,
        totalActionsWithoutImage,
      ]);

      /** getting total actions with/without quiz question answered correctly on first attempt iamge for donut chart data */
      const totalActionsQuizCorrect = allSubmittedActions.filter(
        (action) => action.first_quiz_answer_correct
      ).length;
      const totalActionsQuizIncorrect = allSubmittedActions.filter(
        (action) => !action.first_quiz_answer_correct
      ).length;
      setDonutQuizData([totalActionsQuizCorrect, totalActionsQuizIncorrect]);
    };

    allSubmittedActions && renderDonutChartData();
  }, [allSubmittedActions]);

  return !allSubmittedActions ? (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Grid
      container
      alignItems={{ xs: 'center', md: 'flex-start' }}
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ mt: '1em' }}
      gap={{ xs: '2em', md: '0' }}
      textAlign={{ xs: 'center', md: 'left' }}
    >
      <Grid item xs={12}>
        <Typography variant="h1">Admin Dashboard</Typography>
      </Grid>
      <Grid
        container
        item
        spacing={4}
        sx={{
          mt: { xs: '0.5em', md: '2em' },
          width: { xs: '70%', md: '100%' },
        }}
      >
        <Grid item xs={12} md={3}>
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
          {numGroups && (
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

        <Grid item xs={12} md={9}>
          {allSubmittedActions && (
            <Box
              sx={
                mobileView && {
                  position: 'relative',
                  height: '40vh',
                  width: '100%',
                }
              }
            >
              <BarChart allSubmittedActions={allSubmittedActions} />
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ width: { xs: '70%', sm: '100%' }, mt: '2.5em' }}>
        <GlobalLeaderboard />
      </Grid>
      <Grid item xs={12} sx={{ width: { xs: '70%', md: '100%' } }}>
        <Typography variant="h2" sx={{ my: '2em' }}>
          All Time Stats
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: { xs: 'center', md: 'space-between' },
            gap: { xs: '0.5em' },
            width: { xs: '100%' },
          }}
        >
          {allSubmittedActions && (
            <StyledPaper
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5em',
              }}
            >
              <Typography variant="h7">
                {' '}
                Total Number of Actions Submitted
              </Typography>
              <Typography variant="h2">{allSubmittedActions.length}</Typography>
            </StyledPaper>
          )}

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
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
