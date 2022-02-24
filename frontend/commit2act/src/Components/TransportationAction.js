import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

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
            justifyContent: 'center',
            flexDirection: 'column',
            paddingBottom: '10px',
          }}
        >
          <p style={{ fontSize: '17px' }}>{fact}</p>
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
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '10px',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Walking kms "
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            label="Cycling kms"
            variant="outlined"
          />
          <TextField id="outlined-basic" label="Bus kms" variant="outlined" />
        </Box>
      )
    );
  };

  const renderButton = () => {
    if (stepNumber === 1) {
      return (
        <Button
          onClick={() => {
            setStepNumber(2);
          }}
          variant="contained"
        >
          Get Started
        </Button>
      );
    } else if (stepNumber === 2) {
      return <Button variant="contained">Add Action</Button>;
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        height: 350,
        backgroundColor: '#e8f4f8',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
      }}
    >
      <p>Transportation</p>
      {renderFormStepOne()}
      {renderFormStepTwo()}
      {renderButton()}
    </Box>
  );
};

export default TransportationAction;
