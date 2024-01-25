import { AutoGraph } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import useTranslation from './customHooks/translations';

export const CurrentPlaceNumbers = ({ placeNumber = 0, totalNumber = 0 }) => {
  const translation = useTranslation();

  return (
    <Box
      sx={{
        flexShrink: 0,
      }}
    >
      <Typography variant="h3" component="p">
        {translation.currentPlace}
      </Typography>
      <Typography variant="h3" component="p" mt="0.2em">
        <AutoGraph />
        <Typography
          variant="h1"
          component="span"
        >{`${placeNumber} / ${totalNumber}`}</Typography>
      </Typography>
    </Box>
  );
};
