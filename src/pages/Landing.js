import {
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  AlertTitle,
  Grid,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AutoGraphOutlined,
  CircleNotificationsOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import { API } from 'aws-amplify';
import {
  getTotalGlobalCO2,
  getAllGroupsForUser,
  getAllSubmittedActionsToValidate,
  getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin,
  getAllUnvalidatedSubmittedActionsForUser,
  getSingleUser,
} from '../graphql/queries';
import GlobalLeaderboard from '../components/GlobalLeaderboard';
import useTranslation from '../components/customHooks/translations';
import UserActions from '../components/UserActions';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  background: #fff;
  .statValue {
    margin-top: 0.5em;
  }
`;

const Landing = ({ user, userType }) => {
  const navigate = useNavigate();
  const [progressStats, setProgressStats] = useState({
    globalCO2: '',
    totalCO2: '',
    weekCO2: '',
  });
  const [userGroups, setUserGroups] = useState([]);
  const [numActionsToValidate, setNumActionsToValidate] = useState();
  const [pendingActions, setPendingActions] = useState([]);
  const [pendingCO2Saved, setPendingCO2Saved] = useState(0);
  const translation = useTranslation();

  useEffect(() => {
    if (user) {
      getProgressStats();
      getGroups();
      getNumActionsToValidate();
      getPendingActions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getProgressStats = async () => {
    const [userRes, globalCO2Res] = await Promise.all([
      API.graphql({
        query: getSingleUser,
        variables: { user_id: user.user_id },
      }),
      API.graphql({ query: getTotalGlobalCO2 }),
    ]);
    setProgressStats((prev) => ({
      ...prev,
      globalCO2: Math.ceil(globalCO2Res.data.getTotalGlobalCO2),
      totalCO2: userRes.data.getSingleUser.total_co2.toFixed(2),
      weekCO2: userRes.data.getSingleUser.weekly_co2.toFixed(2),
    }));
  };

  const getGroups = async () => {
    const res = await API.graphql({
      query: getAllGroupsForUser,
      variables: { user_id: user.user_id },
    });
    setUserGroups(res.data.getAllGroupsForUser);
  };

  const getNumActionsToValidate = async () => {
    const groupSubmittedActionRes = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: user.user_id },
    });
    const numGroupSubmittedActions =
      groupSubmittedActionRes.data.getAllSubmittedActionsToValidate.length;

    if (userType === 'Admin') {
      const userWithoutGroupActionRes = await API.graphql({
        query: getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin,
      });
      const numUserWithoutGroupActions =
        userWithoutGroupActionRes.data
          .getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin?.length;
      setNumActionsToValidate(
        numGroupSubmittedActions + numUserWithoutGroupActions
      );
    } else {
      setNumActionsToValidate(numGroupSubmittedActions);
    }
  };

  const getPendingActions = async () => {
    try {
      const res = await API.graphql({
        query: getAllUnvalidatedSubmittedActionsForUser,
        variables: { user_id: user.user_id },
      });

      const unvalidatedSubmittedActions =
        res.data.getAllUnvalidatedSubmittedActionsForUser;
      if (unvalidatedSubmittedActions.length === 0) return;
      const pendingCO2 = unvalidatedSubmittedActions
        .map((action) => action.g_co2_saved)
        .reduce((prev, next) => prev + next);

      setPendingActions(unvalidatedSubmittedActions);
      setPendingCO2Saved(pendingCO2);
    } catch (e) {
      console.log(e);
    }
  };

  const renderGroupCards = () => {
    if (userGroups.length > 0) {
      return userGroups.map((group, index) => (
        <GroupCard key={index} group={group} user={user} />
      ));
    } else {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2em' }}>
          <Typography variant="subtitle2">{translation.noMyGroups}</Typography>
        </Box>
      );
    }
  };

  return (
    <>
      {user ? (
        <Grid
          container
          alignItems={{ xs: 'center', lg: 'flex-start' }}
          direction={{ xs: 'column', lg: 'row' }}
          gap={{ xs: '2em', lg: '0' }}
          textAlign={{ xs: 'center', lg: 'left' }}
        >
          <Grid
            item
            xs={12}
            justifyContent="center"
            sx={{ width: { xs: '98%' } }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2em', md: '2.5em' },
                mt: { xs: '1em', lg: '0' },
                wordWrap: 'break-word',
                maxWidth: { xs: '400px', sm: '100%' },
              }}
            >
              {translation.formatString(translation.welcomeName, user.name)}
            </Typography>
            {numActionsToValidate > 0 && (
              <Alert
                icon={<CircleNotificationsOutlined />}
                variant="outlined"
                sx={{
                  mt: '3em',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  textAlign: { xs: 'left' }
                }}
                color="info"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => navigate('/validate-actions')}
                  >
                    {translation.startValidating}
                  </Button>
                }
              >
                <AlertTitle>{translation.alertNewActionTitle}</AlertTitle>
                {translation.formatString(
                  translation.alertNewActionText,
                  <strong>{numActionsToValidate}</strong>
                )}
              </Alert>
            )}
            {pendingActions && pendingActions.length > 0 && pendingCO2Saved && (
              <Alert
                icon={<CircleNotificationsOutlined />}
                variant="outlined"
                sx={{
                  mt: numActionsToValidate > 0 ? '1em' : '3em',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  alignItems: { xs: 'center', sm: 'flex-start' },
                  textAlign: { xs: 'left' }
                }}
                color="success"
              >
                <AlertTitle>
                  {translation.formatString(
                    translation.alertActionsPendingTitle,
                    pendingActions.length
                  )}
                </AlertTitle>
                {translation.formatString(
                  translation.alertActionsPendingText,
                  <strong>{pendingCO2Saved}g</strong>
                )}
              </Alert>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            justifyContent="center"
            sx={{ width: { xs: '98%' } }}
          >
            <Box
              component="div"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                m: '0 0 1.25em',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: '1em' },
              }}
            >
              <Typography
                variant="h2"
                sx={{ m: { xs: '0.5em 0 1.25em', md: '1.5em 0 1.25em' } }}
              >
                {translation.recentProgress}
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/log-action');
                }}
                sx={{
                  background:
                    'linear-gradient(274.34deg, #33AF99 6.31%, #56C573 77.35%)',
                  color: '#000',
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: 28,
                    marginRight: '28px',
                    fontSize: 30,
                    color: '#000',
                    filter: 'invert(1)',
                  }}
                  alt=""
                  src="./assets/images/icon-log.png"
                />

                {translation.logANewAction}
              </Button>
            </Box>
            <Box
              component={Paper}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                background:
                  'linear-gradient(91.49deg, #56C573 0.29%, #5BC0AC 100%)',
                borderRadius: '10px',
                padding: '1.5em',
                gap: { xs: '0.5em', lg: '0.5em' },
                '> div': {
                  flex: '1',
                }
              }}
            >
              <StyledPaper elevation={6}>
                <Typography variant="h4">{translation.co2SavedWeek}</Typography>
                <Typography variant="h5" className="statValue">
                  <AutoGraphOutlined fontSize="large" />
                  {progressStats.weekCO2}g
                </Typography>
              </StyledPaper>
              <StyledPaper elevation={6}>
                <Typography variant="h4">
                  {translation.totalCO2Saved}
                </Typography>
                <Typography variant="h5" className="statValue">
                  {progressStats.totalCO2}g
                </Typography>
              </StyledPaper>
              <StyledPaper elevation={6}>
                <Typography variant="h4">
                  {translation.collectiveImpact}
                </Typography>
                <Typography variant="h5" className="statValue">
                  {progressStats.globalCO2}g
                </Typography>
              </StyledPaper>
            </Box>
          </Grid>
          <Grid
            container
            item
            sx={{
              mt: { xs: '2em', md: '3em' },
              width: { xs: '98%' },
            }}
          >
            <GlobalLeaderboard />
            <Grid item xs={12} justifyContent="center" sx={{ width: '70%' }}>
              <Box
                component="div"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  m: '4em 0 1.25em',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: '1em' },
                }}
              >
                <Typography variant="h2">{translation.myGroups}</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate('/create-group');
                  }}
                >
                  {translation.createNewGroup}
                </Button>
              </Box>
              {renderGroupCards()}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LinearProgress />
        </Box>
      )}
      <Grid item xs={12} justifyContent="center">
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            m: '4em 0 1.25em',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: '1em' },
          }}
        >
          <Typography variant="h2">{translation.myActions}</Typography>
        </Box>
      </Grid>
      <UserActions
        databaseUser={user}
      />
    </>
  );
};

export default Landing;
