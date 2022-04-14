import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { AutoGraphOutlined } from '@mui/icons-material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupCard from '../components/GroupCard';
import { API } from 'aws-amplify';
import {
  getTotalGlobalCO2,
  getUsersTotalCO2,
  getUsersWeekCO2,
  getAllGroupsForUser,
} from '../graphql/queries';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: '#112D4E',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 'calc(2vw + 2vh)',
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const Landing = ({ user }) => {
  const navigate = useNavigate();
  const [progressStats, setProgressStats] = useState({
    globalCo2: '',
    totalCo2: '',
    weeklyCo2: '',
  });
  const [userGroups, setUserGroups] = useState([]);

  //gets currently authenticated cognito user for the first time the page loads after sign in
  const getCognitoUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    const id = cognitoUserEntry.attributes['custom:id'];
    getProgressStats(id);
    getGroups(id);
  };

  useEffect(() => {
    getCognitoUser();
  }, []);

  const getProgressStats = async (id) => {
    const userId = user ? user.user_id : id;
    const [globalCo2Res, totalCo2Res, weeklyCo2Res] = await Promise.all([
      API.graphql({ query: getTotalGlobalCO2 }),
      API.graphql({
        query: getUsersTotalCO2,
        variables: { user_id: userId },
      }),
      API.graphql({
        query: getUsersWeekCO2,
        variables: { user_id: userId },
      }),
    ]);
    setProgressStats((prev) => ({
      ...prev,
      globalCo2: globalCo2Res.data.getTotalGlobalCO2,
      totalCo2: totalCo2Res.data.getUsersTotalCO2,
      weeklyCo2: weeklyCo2Res.data.getUsersWeekCO2,
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

  const renderGroupCards = () => {
    if (userGroups) {
      return userGroups.map((group, index) => (
        <GroupCard key={index} group={group} />
      ));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {user && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
              Welcome {user.name}!
            </Typography>
            <Typography variant="h2" sx={{ m: '2.5em 0 1.25em' }}>
              Recent Progress
            </Typography>
          </Box>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 0, md: 1 }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              width: '100%',
              minHeight: '50vh',
              backgroundColor: '#DBE2EF',
              borderRadius: '8px',
              padding: '1.5em',
            }}
          >
            <Grid item xs={4}>
              <Card raised={true} sx={{ p: '1em' }}>
                <CardActionArea sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">CO2 Saved This Week</Typography>
                  <CardContent>
                    <Typography variant="h5">
                      <AutoGraphOutlined fontSize="large" />
                      {progressStats.weeklyCo2}g
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card raised={true} sx={{ p: '1em' }}>
                <CardActionArea sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">Total CO2 Saved</Typography>
                  <CardContent>
                    <Typography variant="h5">
                      {progressStats.totalCo2}g
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={5}>
              <Card raised={true} sx={{ p: '1em' }}>
                <CardActionArea sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">Collective Impact</Typography>
                  <CardContent>
                    <Typography variant="h5">
                      {progressStats.globalCo2}g
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
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
          {renderGroupCards()}
        </>
      )}
    </ThemeProvider>
  );
};

export default Landing;
