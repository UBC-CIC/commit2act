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
const SubmittedActionCard = ({ action }) => {
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ textAlign: 'center' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h3">{action.date_of_action}</Typography>
              <Typography variant="h3" sx={{ ml: '2em' }}>
                {action.time_submitted}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h1" component="h2">
            {action.action.action_name}
          </Typography>
          <Typography sx={{ my: 1.5 }} color="text.secondary">
            {action.actionItem.item_name}: 7 km
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3">
              Bonus Points:
              {action.first_quiz_answer_correct ? '10' : '0'}
            </Typography>
            <Typography variant="h3">
              CO2 Saved: {action.actionItem.co2_saved_per_unit}g
            </Typography>
            <Typography variant="h3">Total Points: 110</Typography>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default SubmittedActionCard;
