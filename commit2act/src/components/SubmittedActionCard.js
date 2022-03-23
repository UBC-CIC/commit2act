import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
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
            fontSize: 30,
            color: '#3F72AF',
            fontWeight: 200,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 18,
            color: 'black',
            fontWeight: 300,
          },
        },
      ],
    },
  },
});
const SubmittedActionCard = () => {
  //hard coded submitted action for now

  let sampleSubmittedAction = {
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

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ minWidth: 275, textAlign: 'center' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h3">
                {sampleSubmittedAction.date_of_action}
              </Typography>
              <Typography variant="h3" sx={{ ml: '2em' }}>
                {sampleSubmittedAction.time_submitted}
              </Typography>
            </Box>
            <Typography variant="h3">Group: UBC CIC</Typography>
          </Box>
          <Typography variant="h1" component="h2">
            {sampleSubmittedAction.action.action_name}
          </Typography>
          <Typography sx={{ my: 1.5 }} color="text.secondary">
            {sampleSubmittedAction.actionItem.item_name}: 7 km
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3">
              Bonus Points:
              {sampleSubmittedAction.first_quiz_answer_correct ? '10' : '0'}
            </Typography>
            <Typography variant="h3">
              CO2 Saved: {sampleSubmittedAction.actionItem.co2_saved_per_unit}g
            </Typography>
            <Typography variant="h3">Total Points: 110</Typography>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default SubmittedActionCard;
