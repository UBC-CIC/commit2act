import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const PlasticWasteAction = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      sx={{
        width: 400,
        minHeight: '32vw',
        backgroundColor: '#F5EEF8',
        padding: '50px',
      }}
    >
      <Typography variant="h5">Reducing Plastic Waste</Typography>
      <TextField id="outlined-basic" label="mL of water" variant="outlined" />
      <TextField id="outlined-basic" label="L of water" variant="outlined" />
    </Grid>
  );
};

export default PlasticWasteAction;
