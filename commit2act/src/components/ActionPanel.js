import React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import PlantBasedMealAction from './PlantBasedMealAction';
import TransportationAction from './TransportationAction';
import PlasticWasteAction from './PlasticWasteAction';

const ActionPanel = ({ selectedAction, changeStep }) => {
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
    <>
      <Typography variant="h5">{selectedAction}</Typography>
      {renderActionForm()}
      <Button
        onClick={() => {
          changeStep(3);
        }}
        variant="contained"
      >
        Add Action
      </Button>
    </>
  );
};

export default ActionPanel;
