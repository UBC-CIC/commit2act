import React from 'react';
import { Box, Button } from '@mui/material';

const buttonStyles = {
  padding: '0.5em 1.5em',
  borderRadius: '2rem',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  flex: '1 0 max-content',
  maxWidth: '14em',
};

const ActionButtons = ({
  backOnClick = () => {},
  backText = null,
  forwardDisabled = false,
  forwardOnClick,
  forwardText,
}) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        justifyContent: 'center',
        marginBottom: '1.25rem',
      }}
    >
      {backText && (
        <Button
          onClick={backOnClick}
          sx={{
            ...buttonStyles,
            color: 'white',
            borderColor: 'white',
          }}
          variant="outlined"
        >
          {backText}
        </Button>
      )}
      <Button
        disabled={forwardDisabled}
        onClick={forwardOnClick}
        sx={buttonStyles}
        variant="contained"
      >
        {forwardText}
      </Button>
    </Box>
  );
};

export default ActionButtons;
