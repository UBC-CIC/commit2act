import { Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import LineChart from './LineChart';
import useTranslation from '../customHooks/translations';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  .statValue {
    margin-top: 0.5em;
  }
`;
const Dashboard = () => {
  const [allUsers, setAllUsers] = useState();
  const [allGroups, setAllGroups] = useState();
  const [donutActionImageData, setDonutActionImageData] = useState([]);
  const [donutQuizData, setDonutQuizData] = useState();
  const [allSubmittedActions, setAllSubmittedActions] = useState();
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const translation = useTranslation();

  const getStats = async () => {
    const [totalUserRes, totalGroupRes, submittedActionRes] = await Promise.all(
      [
        API.graphql({ query: getAllUsers }),
        API.graphql({ query: getAllGroups }),
        API.graphql({ query: getAllSubmittedActions }),
      ]
    );
    setAllUsers(totalUserRes.data.getAllUsers);
    setAllGroups(totalGroupRes.data.getAllGroups);
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
      gap={{ xs: '1em', md: '0' }}
      textAlign={{ xs: 'center', md: 'left' }}
    >
      <Grid item xs={12}>
        <Typography variant="h2" component="h1">
          {translation.adminDashboard}
        </Typography>
      </Grid>
      <Grid
        container
        item
        spacing={2}
        sx={{
          mt: { xs: '0.5em', md: '2em' },
          width: { xs: '70%', md: '100%' },
        }}
      >
        <Grid item xs={12} md={3}>
          {allUsers && (
            <StyledPaper sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography component="p" variant="h7">
                {' '}
                {translation.totalUsers}
              </Typography>
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
                <span>{allUsers.length}</span>
              </Typography>
            </StyledPaper>
          )}
          {allGroups && (
            <StyledPaper
              sx={{ display: 'flex', flexDirection: 'column', mt: '1em' }}
            >
              <Typography component="p" variant="h7">
                {' '}
                {translation.totalGroups}
              </Typography>
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
                {allGroups.length}
              </Typography>
            </StyledPaper>
          )}
        </Grid>

        <Grid item xs={12} md={9}>
          {allSubmittedActions && (
            <Box
              sx={{
                position: mobileView ? 'relative' : 'static',
                height: mobileView ? '40vh' : 'auto',
                width: '100%',
              }}
            >
              <BarChart allSubmittedActions={allSubmittedActions} />
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ width: { xs: '70%', sm: '100%' }, mt: '2.5em' }}>
        <GlobalLeaderboard />
      </Grid>
      <Grid
        container
        item
        sx={{
          mt: { xs: '0.5em', md: '2em' },
          width: { xs: '70%', md: '100%' },
        }}
      >
        <Grid item xs={12}>
          {allSubmittedActions && (
            <Box
              sx={{
                position: mobileView ? 'relative' : 'static',
                height: mobileView ? '40vh' : 'auto',
                width: '100%',
              }}
            >
              <LineChart allSubmittedActions={allSubmittedActions} />
            </Box>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ width: { xs: '70%', md: '100%' } }}>
        <Typography variant="h2" sx={{ my: { sm: '2em' }, mb: { xs: '2em' } }}>
          {translation.allTimeStats}
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
                justifyContent: 'center',
              }}
            >
              <Typography component="p" variant="h7">
                {' '}
                {translation.totalActionsSubmitted}
              </Typography>
              <Typography variant="h2">{allSubmittedActions.length}</Typography>
            </StyledPaper>
          )}

          <Paper>
            <Doughnut
              data={{
                labels: [
                  translation.actionsSubmittedWithImage,
                  translation.actionsSubmittedWithoutImage,
                ],
                datasets: [
                  {
                    data: donutActionImageData,
                    backgroundColor: ['#9cda92', '#da929c'],
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
                  translation.actionsFirstAnswerCorrect,
                  translation.actionsFirstAnswerIncorrect,
                ],
                datasets: [
                  {
                    data: donutQuizData,
                    backgroundColor: ['#9cda92', '#da929c'],
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
