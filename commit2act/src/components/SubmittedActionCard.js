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
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'space-between' },
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h3">
                {action.date_of_action.split('T')[0]}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="h1"
            component="h2"
            sx={{ mt: { xs: '0.5em', md: '0' } }}
          >
            {action.action_name}
          </Typography>
          <Typography sx={{ my: 1.5 }} color="text.secondary">
            {action.submitted_action_items}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: { xs: 'center', md: 'space-between' },
              gap: { xs: '0.4em', md: '0' },
            }}
          >
            <Typography variant="h3">
              Bonus Points:
              {action.first_quiz_answer_correct ? '10' : '0'}
            </Typography>
            <Typography variant="h3">
              CO2 Saved: {action.g_co2_saved}g
            </Typography>
            <Typography variant="h3">
              Total Points Earned: {action.points_earned}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default SubmittedActionCard;
