import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, TextField } from '@mui/material';
import { API } from 'aws-amplify';
import { getActionItemsForAction } from '../graphql/queries';

const ActionPanel = ({
  selectedAction,
  totalCo2Saved,
  setTotalCo2Saved,
  actionItemValues,
  setActionItemValues,
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

  //updates total co2 saved value and recordswq what user inputs for each item field on the form
  const handleActionItemInput = (value, item) => {
    setTotalCo2Saved(totalCo2Saved + value * item.co2_saved_per_unit);
    let input = { item_name: item.item_name, input_value: value };
    //if the action item has already been added, update the value
    if (
      actionItemValues.some((element) => element.item_name === item.item_name)
    ) {
      const updatedItemValues = actionItemValues.map((itemValue) =>
        itemValue.item_name === item.item_name
          ? { ...itemValue, input_value: value }
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
      </Box>
    </Grid>
  );
};

export default ActionPanel;
