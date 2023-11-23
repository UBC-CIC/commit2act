import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, TextField, Button } from '@mui/material';

import useTranslation from '../customHooks/translations';

const ValidationPanel = ({ activeStep, setActiveStep }) => {
  const translation = useTranslation();

  console.log(activeStep);

  return (
    <Grid
      item
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      Amazing! You are saving the planet!
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          alignContent: 'center',
          width: '80%',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            m: '0 0 1.25em',
            flexDirection: { xs: 'row' },
            gap: { xs: '10px', md: '10px' },
          }}
        >
          <Button
            onClick={() => {
              setActiveStep(activeStep - 1);
            }}
            variant="contained"
            sx={{
              width: '50%',
              padding: '1em 1em 1em',
              fontSize: '1.2rem',
            }}
          >
            {translation.previous}
          </Button>
          <Button
            onClick={setActiveStep(activeStep + 1)}
            variant="contained"
            sx={{
              width: '50%',
              padding: '1em 1em 1em',
              fontSize: '1.2rem',
            }}
          >
            {translation.bonusQuiz}
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default ValidationPanel;
