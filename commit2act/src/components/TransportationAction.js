import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';

const TransportationAction = () => {
  const [stepNumber, setStepNumber] = useState(1);

  let fact =
    'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production';

  const renderFormStepOne = () => {
    return (
      stepNumber === 1 && (
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
            <Typography variant="body1">{fact}</Typography>
          </Box>
          <Button
            onClick={() => {
              setStepNumber(2);
            }}
            variant="contained"
          >
            Get Started
          </Button>
        </Box>
      )
    );
  };

  const renderFormStepTwo = () => {
    return (
      stepNumber === 2 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Distance Walked (km)"
            variant="outlined"
            helperText="How far you walked"
          />
          <TextField
            id="outlined-basic"
            label="Distance Cycled (km)"
            variant="outlined"
            helperText="How far you cycled"
          />
          <TextField
            id="outlined-basic"
            label="Distance Transited (km)"
            variant="outlined"
            helperText="How far you took public transit"
          />
          <Button variant="contained">Add Action</Button>
        </Box>
      )
    );
  };

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
      <Typography variant="h5">Transportation</Typography>
      {renderFormStepOne()}
      {renderFormStepTwo()}
    </Grid>
  );
};

export default TransportationAction;
