import React from 'react';
import { Box, Typography } from '@mui/material';

const BonusPointQuiz = ({ fact }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5">Bonus Point Quiz</Typography>
    </Box>
  );
};

export default BonusPointQuiz;
