import React from 'react';
import { Box, TextField } from '@mui/material';

const PlasticWasteAction = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <TextField id="outlined-basic" label="mL of water" variant="outlined" />
      <TextField id="outlined-basic" label="L of water" variant="outlined" />
    </Box>
  );
};

export default PlasticWasteAction;
