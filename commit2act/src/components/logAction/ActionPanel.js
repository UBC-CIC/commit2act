import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, TextField, Button } from '@mui/material';
import { API } from 'aws-amplify';
import { getActionItemsForAction } from '../../graphql/queries';

const ActionPanel = ({
  selectedAction,
  actionItemValues,
  setActionItemValues,
  setTotalCO2Saved,
  activeStep,
  setActiveStep,
}) => {
  const { action_id, action_name } = selectedAction;
  const [actionItems, setActionItems] = useState();

  useEffect(() => {
    getActionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //gets all action items related to the user selected action
  const getActionItems = async () => {
    const res = await API.graphql({
      query: getActionItemsForAction,
      variables: { action_id: action_id },
    });
    const items = res.data.getActionItemsForAction;
    setActionItems(items);
  };

  //updates total co2 saved value and records what user inputs for each item field on the form
  const handleActionItemInput = (value, item) => {
    //if user input is not an int/float, do not update or set the actionItemValues
    if (isNaN(value)) {
      return;
    }

    //create the input object
    let input = {
      item_name: item.item_name,
      input_value: value,
      co2: value * item.co2_saved_per_unit,
    };

    if (value === '') {
      //if the user inputted value has been cleared, remove the actionItemValue from the array
      let updatedItemValues = actionItemValues.filter(
        (actionItem) => actionItem.item_name !== item.item_name
      );
      setActionItemValues(updatedItemValues);
    } else if (
      //if the action item has already been added, update the input value and the co2 value
      actionItemValues.some((element) => element.item_name === item.item_name)
    ) {
      let updatedItemValues = actionItemValues.map((itemValue) =>
        itemValue.item_name === item.item_name
          ? {
              ...itemValue,
              input_value: value,
              co2: value * item.co2_saved_per_unit,
            }
          : itemValue
      );
      setActionItemValues(updatedItemValues);
    } else {
      //if the action item has not been added, add the item and corresponding value into the array
      setActionItemValues((actionItemValues) => [...actionItemValues, input]);
    }
  };

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
          onChange={(e) => handleActionItemInput(e.target.value, item)}
        />
      ));
    }
  };

  const calculateCO2 = () => {
    //get the total CO2 saved by summing the values for the co2 property of all the items in actionItemValues
    let sumCO2 = actionItemValues.reduce((sum, { co2 }) => sum + co2, 0);
    setTotalCO2Saved(sumCO2);
    //remove the co2 object property from every item in actionItemValues
    //so that actionItemValues will be in proper format to be used in CO2SavedScreen mutation
    let removedCO2 = actionItemValues.map(({ co2, ...value }) => value);
    setActionItemValues(removedCO2);
    //advances menu to next step
    setActiveStep(activeStep + 1);
  };

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          alignContent: 'center',
          width: '80%',
        }}
      >
        <Typography variant="h2">{action_name}</Typography>
        {renderActionForm()}
        <Button onClick={calculateCO2} variant="contained">
          Next
        </Button>
      </Box>
    </Grid>
  );
};

export default ActionPanel;
