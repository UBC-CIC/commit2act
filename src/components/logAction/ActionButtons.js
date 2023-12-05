import React from 'react';
import { Box, Button } from '@mui/material';

const ActionButtons = ({
  forwardOnClick,
  backOnClick,
  forwardText,
  backText,
}) => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        m: '0 0 1.25em',
        flexDirection: { xs: 'row' },
        gap: { xs: '10px', md: '10px' },
        width: { xs: '100%' },
      }}
    >
      <Button
        onClick={backOnClick}
        variant="outlined"
        sx={{
          width: '100%',
          padding: '.5em 1em',
          fontSize: '1.2rem',
          borderRadius: '35px',
          color: 'white',
        }}
      >
        {backText}
      </Button>
      <Button
        onClick={forwardOnClick}
        variant="contained"
        // disabled={disableButton}
        sx={{
          width: '100%',
          padding: '.5em 1em',
          fontSize: '1.2rem',
          borderRadius: '35px',
        }}
      >
        {forwardText}
      </Button>
    </Box>
  );
};

export default ActionButtons;
