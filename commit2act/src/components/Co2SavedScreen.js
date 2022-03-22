import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
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
            variant: 'subtitle1',
          },
          style: {
            fontSize: 15,
            color: 'black',
            fontWeight: 100,
          },
        },
      ],
    },
  },
});

const Co2SavedScreen = ({ totalCo2Saved, changeStep }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: '20vh',
        }}
      >
        <Typography variant="h2">Thank you!</Typography>
        <Typography variant="h3">
          You have saved {totalCo2Saved} g of CO2!
        </Typography>
        <Typography variant="subtitle1">
          An admin will now review your entry and your points will be added
          shortly
        </Typography>
        <Button
          onClick={() => {
            changeStep(1);
          }}
          variant="contained"
        >
          Add Another Action
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Co2SavedScreen;
