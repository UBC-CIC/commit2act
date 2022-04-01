import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, TextField } from '@mui/material';

const ActionPanel = ({
  selectedAction,
  changeStep,
  totalCo2Saved,
  setTotalCo2Saved,
}) => {
  const [actionItems, setActionItems] = useState();

  const plantBasedMealActionItems = [
    {
      item_name: '# of meals',
      item_description: '# of plant based meals eaten',
      co2_saved_per_unit: 200,
    },
  ];
  const transportationActionItems = [
    {
      item_name: 'Distance Walked (km)',
      item_description: 'How far you walked',
      co2_saved_per_unit: 180,
    },
    {
      item_name: 'Distance Cycled (km)',
      item_description: 'How far you cycled',
      co2_saved_per_unit: 180,
    },
    {
      item_name: 'Distance Transited (km)',
      item_description: 'How far you took public transit',
      co2_saved_per_unit: 100,
    },
  ];

  const plasticWasteItems = [
    {
      item_name: 'L of tap water',
      item_description: 'L of tap water',
      co2_saved_per_unit: 200,
    },
    {
      item_name: 'mL of tap water',
      item_description: 'mL of tap water',
      co2_saved_per_unit: 200,
    },
  ];

  useEffect(() => {
    if (selectedAction === 'Plant Based Meals') {
      setActionItems(plantBasedMealActionItems);
    } else if (selectedAction === 'Transportation') {
      setActionItems(transportationActionItems);
    } else {
      setActionItems(plasticWasteItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderActionForm = () => {
    if (actionItems) {
      return actionItems.map((item, index) => (
        <TextField
          key={index}
          id="outlined-basic"
          label={item.item_name}
          variant="outlined"
          helperText={item.item_description}
          InputLabelProps={{ shrink: true }}
          onChange={(e) =>
            setTotalCo2Saved(
              totalCo2Saved + e.target.value * item.co2_saved_per_unit
            )
          }
        />
      ));
    }
  };

  return (
    <>
      <Typography variant="h2">{selectedAction}</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
        }}
      >
        {renderActionForm()}
      </Box>
      <Button
        onClick={() => {
          changeStep(3);
        }}
        variant="contained"
      >
        Next
      </Button>
    </>
  );
};

export default ActionPanel;
