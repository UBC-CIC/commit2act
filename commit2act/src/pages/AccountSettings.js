import React, { useState, useEffect } from 'react';
import SubmittedActionCard from '../components/SubmittedActionCard';
import { Box, Button, Stack, Typography, Grid, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { Auth } from 'aws-amplify';

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
            color: 'black',
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
            marginBottom: '0.5em',
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
const AccountSettings = () => {
  const [user, setUser] = useState();
  const [showMore, setShowMore] = useState(false);

  const getUserInfo = async () => {
    const userInfo = await Auth.currentUserInfo();
    setUser(userInfo);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  //hard coded submitted actions for now
  let action1 = {
    g_co2_saved: 300,
    date_of_action: '2/11/2021',
    time_submitted: '3:30 PM',
    first_quiz_answer_correct: true,
    quiz_answered: true,
    action: {
      action_name: 'Transportation',
    },
    actionItem: {
      item_name: 'Distance Walked',
      co2_saved_per_unit: 100.0,
    },
  };

  let action2 = {
    g_co2_saved: 300,
    date_of_action: '2/10/2021',
    time_submitted: '12:30 PM',
    first_quiz_answer_correct: true,
    quiz_answered: true,
    action: {
      action_name: 'Plant Based Meal',
    },
    actionItem: {
      item_name: 'Num Meals',
      co2_saved_per_unit: 200.0,
    },
  };

  let action3 = {
    g_co2_saved: 200,
    date_of_action: '2/08/2021',
    time_submitted: '6:15 PM',
    first_quiz_answer_correct: true,
    quiz_answered: true,
    action: {
      action_name: 'Reducing Plastic Waste',
    },
    actionItem: {
      item_name: 'mL Water',
      co2_saved_per_unit: 200.0,
    },
  };

  let action4 = {
    g_co2_saved: 800,
    date_of_action: '2/05/2021',
    time_submitted: '3:13 PM',
    first_quiz_answer_correct: true,
    quiz_answered: true,
    action: {
      action_name: 'Reducing Plastic Waste',
    },
    actionItem: {
      item_name: 'mL Water',
      co2_saved_per_unit: 200.0,
    },
  };

  let action5 = {
    g_co2_saved: 800,
    date_of_action: '2/04/2021',
    time_submitted: '1:45 PM',
    first_quiz_answer_correct: true,
    quiz_answered: true,
    action: {
      action_name: 'Reducing Plastic Waste',
    },
    actionItem: {
      item_name: 'mL Water',
      co2_saved_per_unit: 200.0,
    },
  };

  let sampleSubmittedActions = [action1, action2, action3, action4, action5];

  const renderSubmittedActionCards = () => {
    if (sampleSubmittedActions) {
      return showMore
        ? sampleSubmittedActions.map((action, index) => (
            <SubmittedActionCard key={index} action={action} />
          ))
        : sampleSubmittedActions
            .slice(0, 3)
            .map((action, index) => (
              <SubmittedActionCard key={index} action={action} />
            ));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {user && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{ mt: { xs: '1.5em', md: '0' }, mb: '1.5em' }}
            >
              My Account
            </Typography>
            <Grid
              container
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Grid item xs={3}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: {
                      xs: '24vw',
                      sm: '22vw',
                      md: '20vw',
                      lg: '15vw',
                      xl: '15vw',
                    },
                    height: {
                      xs: '12vh',
                      md: '22vh',
                      lg: '24vh',
                      xl: '26vh',
                    },
                  }}
                ></Avatar>
                <Button
                  variant="outlined"
                  sx={{ mt: '1em', mb: { xs: '1.5em' } }}
                >
                  Change Photo
                </Button>
              </Grid>
              <Grid
                item
                xs={9}
                sx={{
                  width: '100%',
                  outline: '2px solid #3F72AF',
                  borderRadius: '5px',
                  padding: '1.5em',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'space-between' },
                  flexFlow: { xs: 'none', md: 'row wrap' },
                  flexDirection: { xs: 'column' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                <Box>
                  <Typography variant="h4">
                    Name: {user.attributes.name}
                  </Typography>
                  <Typography variant="h4">
                    Username: {user.attributes.preferred_username}
                  </Typography>
                  <Typography variant="h4">
                    Email: {user.attributes.email}
                  </Typography>
                </Box>
                <Button size="small" sx={{ alignSelf: { md: 'flex-start' } }}>
                  Edit Info
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h2" sx={{ m: '2.5em 0 1.25em' }}>
              My Actions
            </Typography>
            <Box sx={{ height: '110vh', overflow: 'auto', padding: '0.25em' }}>
              <Stack spacing={2}>
                {renderSubmittedActionCards()}
                <Button
                  sx={{ mt: '3em' }}
                  variant="outlined"
                  onClick={() => setShowMore(!showMore)}
                >
                  View {showMore ? 'Less' : 'More'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default AccountSettings;
