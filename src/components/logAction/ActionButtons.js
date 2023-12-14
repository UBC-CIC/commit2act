import React from 'react';
import { Box, Button } from '@mui/material';

const buttonStyles = {
  padding: '0.5em 1.5em',
  borderRadius: '2em',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  borderWidth: 'solid 0.1em transparent',
  fontSize: { xs: '0.925em', sm: '1em', md: '0.875em' },
  margin: '0.5em',
  flexBasis: '50%',
  minWidth: '10em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5em',
  '&:first-of-type': {
    marginLeft: '0',
  },
  '&:last-of-type': {
    marginRight: '0',
  },
};

const ActionButtons = ({
  backOnClick = () => {},
  backText = null,
  forwardOnClick,
  forwardText,
  forwardProps = {},
  backProps = {},
  children,
}) => {
  const backButtonStyles = {
    ...buttonStyles,
    color: 'white',
    borderColor: 'white',
  };
  return (
    <Box maxWidth="50rem" margin="1em auto">
      {children}
      <Box display="flex" alignItems="center" justifyContent="center">
        {backText && (
          <Button
            onClick={backOnClick}
            sx={backButtonStyles}
            variant="outlined"
            size="large"
            {...backProps}
          >
            {backText}
          </Button>
        )}
        <Button
          onClick={forwardOnClick}
          sx={buttonStyles}
          variant="contained"
          size="large"
          {...forwardProps}
        >
          {forwardText}
        </Button>
      </Box>
    </Box>
  );
};

export default ActionButtons;
