import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const PlantBasedMealAction = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      sx={{
        width: 400,
        minHeight: '32vw',
        backgroundColor: '#DAF7A6',
        padding: '50px',
      }}
    >
      <Typography variant="h5">Plant Based Meals</Typography>
      <TextField id="outlined-basic" label="# of meals" variant="outlined" />
    </Grid>
  );
};

export default PlantBasedMealAction;
