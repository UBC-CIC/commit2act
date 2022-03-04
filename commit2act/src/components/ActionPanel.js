import React from 'react';
import { Typography, Grid } from '@mui/material';
import PlantBasedMealAction from './PlantBasedMealAction';
import TransportationAction from './TransportationAction';
import PlasticWasteAction from './PlasticWasteAction';

const ActionPanel = ({ selectedAction }) => {
  const renderActionForm = () => {
    if (selectedAction === 'Plant Based Meals') {
      return <PlantBasedMealAction />;
    } else if (selectedAction === 'Transportation') {
      return <TransportationAction />;
    } else if (selectedAction === 'Reducing Plastic Waste') {
      return <PlasticWasteAction />;
    }
  };

  return (
    <Grid
      container
      direction="column"
      gap="30px"
      justifyContent="center"
      sx={{
        width: 400,
        minHeight: '32vw',
        backgroundColor: '#e8f4f8',
        padding: '50px',
      }}
    >
      <Typography variant="h5">{selectedAction}</Typography>
      {renderActionForm()}
    </Grid>
  );
};

export default ActionPanel;
