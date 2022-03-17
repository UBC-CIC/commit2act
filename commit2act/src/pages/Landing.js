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

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 36,
            color: 'black',
            fontWeight: 200,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 25,
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
            fontSize: 50,
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const Landing = () => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  //filler content for groups(will replace once database is set up)
  let group1 = {
    name: 'UBC CIC',
    description:
      'UBC’s CIC is a public-private collaboration between UBC and Amazon. A CIC identifies digital transformation challenges, the problems or opportunities that matter to the community, and provides subject matter expertise and CIC leadership.',
    is_public: true,
  };
  let group2 = {
    name: 'AWS',
    description:
      'AWS brings Amazon’s innovation process, skilled cloud expertise, and global solution reach-back to assist UBC in identifying their best solutions for the challenges presented by their end user community.',
  };
  let groups = [group1, group2];

  const renderGroupCards = () => {
    if (groups) {
      return groups.map((group, index) => (
        <GroupCard key={index} group={group} />
      ));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {user && (
        <>
          <Typography variant="h1">Welcome {user.attributes.name}!</Typography>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" sx={{ m: '3.125em 0 1.25em' }}>
              Recent Progress
            </Typography>
          </Box>
          <Grid
            container
            spacing={1}
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
              <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                <CardActionArea>
                  <Typography variant="h4">CO2 Saved This Week</Typography>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">
                      <AutoGraphOutlined fontSize="large" />
                      150g
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                <CardActionArea>
                  <Typography variant="h4">Total CO2 Saved</Typography>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">800g</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs>
              <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                <CardActionArea>
                  <Typography variant="h4">Recent Actions</Typography>
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
