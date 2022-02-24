import React from 'react';
import { Box, TextField } from '@mui/material';

const PlantBasedMealAction = () => {
  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        backgroundColor: '#DAF7A6',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
      }}
    >
      <p>Plant Based Meals</p>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <TextField id="outlined-basic" label="# of meals" variant="outlined" />
      </Box>
    </Box>
  );
};

export default PlantBasedMealAction;
