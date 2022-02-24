import React from 'react';
import { Box, TextField } from '@mui/material';

const PlasticWasteAction = () => {
  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        backgroundColor: '#F5EEF8',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
      }}
    >
      <p>Reducing Plastic Waste</p>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <TextField id="outlined-basic" label="mL of water" variant="outlined" />
        <TextField id="outlined-basic" label="L of water" variant="outlined" />
      </Box>
    </Box>
  );
};

export default PlasticWasteAction;
