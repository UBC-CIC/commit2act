import { Typography, Box, Button, Avatar, Grid } from '@mui/material';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GroupCard = styled(Grid)(({ theme }) => ({
  backgroundColor: '#DBE2EF',
  width: '100%',
  minHeight: '25vh',
  marginBottom: '1.25em',
  padding: '1.875em',
  alignContent: 'center',
  borderRadius: '8px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 35,
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
            color: 'black',
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
      ],
    },
  },
});

const LandingPage = () => {
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
          <Box
            component="div"
            sx={{
              width: '100%',
              height: '50vh',
              backgroundColor: '#DBE2EF',
              borderRadius: '8px',
            }}
          />
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
              variant="contained"
              onClick={() => {
                navigate('/create-group');
              }}
            >
              Create New Group
            </Button>
          </Box>

          {groups.map((group, index) => {
            return (
              <GroupCard key={index} container>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: {
                      xs: '19vw',
                      sm: '22vw',
                      md: '9vw',
                      xl: '9vw',
                    },
                    height: {
                      xs: '10vh',
                      sm: '12vh',
                      md: '18vh',
                      xl: '18vh',
                    },
                    alignSelf: { xs: 'center' },
                    mb: { xs: '1.25em' },
                  }}
                >
                  {group.name.charAt(0)}
                </Avatar>
                <Box
                  component="div"
                  sx={{
                    width: '60vw',
                    height: '100%',
                    ml: { sm: '0em', md: '2.5em' },
                    overflow: 'auto',
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  <Box
                    component="div"
                    sx={{
                      height: '5vh',
                      borderBottom: '3px solid #3F72AF',
                      mb: '0.625em',
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{ ':hover': { opacity: '0.6', cursor: 'pointer' } }}
                    >
                      {group.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{group.description}</Typography>
                </Box>
              </GroupCard>
            );
          })}
        </>
      )}
    </ThemeProvider>
  );
};

export default LandingPage;
