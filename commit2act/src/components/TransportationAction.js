import React from 'react';
import { Box, TextField } from '@mui/material';

const TransportationAction = () => {
  return (
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
    </Box>
  );
};

export default TransportationAction;
