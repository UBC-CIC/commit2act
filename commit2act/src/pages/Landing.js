import {
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  AlertTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  AutoGraphOutlined,
  CircleNotificationsOutlined,
} from '@mui/icons-material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import { API } from 'aws-amplify';
import {
  getTotalGlobalCO2,
  getUsersTotalCO2,
  getUsersWeekCO2,
  getAllGroupsForUser,
  getAllSubmittedActionsToValidate,
  getSingleUser,
} from '../graphql/queries';

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

  //gets currently authenticated cognito user for the first time the page loads after sign in
  const getCognitoUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    const id = cognitoUserEntry.attributes['custom:id'];
    getProgressStats(id);
    getGroups(id);
    getNumActionsToValidate(id);
  };

  useEffect(() => {
    getCognitoUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (userGroups) {
      return userGroups.map((group, index) => (
        <GroupCard key={index} group={group} />
      ));
    }
  };

  return (
    <>
      {user && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
              Welcome {user.name}!
            </Typography>
            {numActionsToValidate && (
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
            <Typography variant="h2" sx={{ m: '2.5em 0 1.25em' }}>
              Recent Progress
            </Typography>
          </Box>
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
          <Box
            component="div"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              m: '5em 0 1.25em',
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderGroupCards()}
          </Box>
        </>
      )}
    </>
  );
};

export default Landing;
