import React from 'react';
import SubmittedActionCard from '../components/SubmittedActionCard';
import { Box, Stack, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

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

  let sampleSubmittedActions = [action1, action2, action3];

  const renderSubmittedActionCards = () => {
    if (sampleSubmittedActions) {
      return sampleSubmittedActions.map((action, index) => (
        <SubmittedActionCard key={index} action={action} />
      ));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          My Account
        </Typography>
        <Typography variant="h2" sx={{ m: '2.5em 0 1.25em' }}>
          My Actions
        </Typography>
        <Stack spacing={2}>{renderSubmittedActionCards()}</Stack>
      </Box>
    </ThemeProvider>
  );
};

export default AccountSettings;
