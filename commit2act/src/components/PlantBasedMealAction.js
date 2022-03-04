import React from 'react';
import { Box, TextField, Button } from '@mui/material';

const PlantBasedMealAction = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <TextField id="outlined-basic" label="# of meals" variant="outlined" />
      <Button variant="contained">Add Action</Button>
    </Box>
  );
};

export default PlantBasedMealAction;
