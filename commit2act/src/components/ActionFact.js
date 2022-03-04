import React, { useEffect } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';

const ActionFact = ({ changeStep, setFact }) => {
  //will be replaced w queried fact
  let selectedFact =
    'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production';

  useEffect(() => {
    setFact(selectedFact);
  }, [selectedFact]);

  return (
    <Grid
      container
      direction="column"
      gap="30px"
      justifyContent="center"
      sx={{
        width: 400,
        minHeight: '32vw',
        backgroundColor: '#e8f4f8',
        padding: '50px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Typography variant="body1">{selectedFact}</Typography>
        </Box>
        <Button
          onClick={() => {
            changeStep(2);
          }}
          variant="contained"
        >
          Get Started
        </Button>
      </Box>
    </Grid>
  );
};

export default ActionFact;
