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
  getSingleUser,
} from '../graphql/queries';
import GlobalLeaderboard from '../components/GlobalLeaderboard';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  .statValue {
    margin-top: 0.5em;
  }
`;

const Landing = ({ user }) => {
  const navigate = useNavigate();
  const [progressStats, setProgressStats] = useState({
    globalCO2: '',
    totalCO2: '',
    weekCO2: '',
  });
  const [userGroups, setUserGroups] = useState([]);
  const [numActionsToValidate, setNumActionsToValidate] = useState();

  useEffect(() => {
    if (user) {
      getProgressStats();
      getGroups();
      getNumActionsToValidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getProgressStats = async (id) => {
    const userId = user ? user.user_id : id;
    const [userRes, globalCO2Res] = await Promise.all([
      API.graphql({ query: getSingleUser, variables: { user_id: userId } }),
      API.graphql({ query: getTotalGlobalCO2 }),
    ]);
    setProgressStats((prev) => ({
      ...prev,
      globalCO2: globalCO2Res.data.getTotalGlobalCO2,
      totalCO2: userRes.data.getSingleUser.total_co2,
      weekCO2: userRes.data.getSingleUser.weekly_co2,
    }));
  };

  const getGroups = async (id) => {
    const userId = user ? user.user_id : id;
    const res = await API.graphql({
      query: getAllGroupsForUser,
      variables: { user_id: userId },
    });
    setUserGroups(res.data.getAllGroupsForUser);
  };

  const getNumActionsToValidate = async (id) => {
    const userId = user ? user.user_id : id;
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: userId },
    });
    setNumActionsToValidate(res.data.getAllSubmittedActionsToValidate.length);
  };

  const renderGroupCards = () => {
    if (userGroups.length > 0) {
      return userGroups.map((group, index) => (
        <GroupCard key={index} group={group} />
      ));
    } else {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2em' }}>
          <Typography variant="subtitle2">
            No groups to display. Create or join a group to get started!
          </Typography>
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
          <Grid item xs={12}>
            <Typography variant="h1" sx={{ mt: { xs: '1.5em', lg: '0' } }}>
              Welcome {user.name}!
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
                }}
                color="info"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    sx={{ alignSelf: 'center' }}
                    onClick={() => navigate('/validate-actions')}
                  >
                    Start Validating
                  </Button>
                }
              >
                <AlertTitle>New Actions In Need of Validation</AlertTitle>
                You have <strong>{numActionsToValidate}</strong> actions to
                validate!
              </Alert>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            justifyContent="center"
            sx={{ width: { xs: '70%', sm: '100%' } }}
          >
            <Typography variant="h2" sx={{ m: '1.5em 0 1.25em' }}>
              Recent Progress
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-evenly',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
                gap: { xs: '0.5em', lg: '0' },
              }}
            >
              <StyledPaper elevation={6}>
                <Typography variant="h4">CO2 Saved This Week</Typography>
                <Typography variant="h5" className="statValue">
                  <AutoGraphOutlined fontSize="large" />
                  {progressStats.weekCO2}g
                </Typography>
              </StyledPaper>
              <StyledPaper elevation={6}>
                <Typography variant="h4">Total CO2 Saved</Typography>
                <Typography variant="h5" className="statValue">
                  {progressStats.totalCO2}g
                </Typography>
              </StyledPaper>
              <StyledPaper elevation={6}>
                <Typography variant="h4">Collective Impact</Typography>
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
              width: { xs: '70%', sm: '100%' },
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
                <Typography variant="h2">My Groups</Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate('/create-group');
                  }}
                >
                  Create New Group
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
    </>
  );
};

export default Landing;
