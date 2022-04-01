import React, { useEffect, useState } from 'react';
import { Typography, Button, Box, TextField } from '@mui/material';
import { API } from 'aws-amplify';
import { getActionItemsForAction } from '../graphql/queries';

const ActionPanel = ({
  selectedAction,
  changeStep,
  totalCo2Saved,
  setTotalCo2Saved,
}) => {
  const { action_id, action_name } = selectedAction;
  const [actionItems, setActionItems] = useState();
  const [actionItemValues, setActionItemValues] = useState([]);

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
    setTotalCo2Saved(totalCo2Saved + value * item.co2_saved_per_unit);
    let input = { value, item };
    // setActionItemValues({ ...item, [item.item_name]: e.target.value });
    // setActionItemValues({ ...actionItemValues, ...input });
    setActionItemValues((actionItemValues) => [...actionItemValues, input]);
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
    <>
      <Typography variant="h2">{action_name}</Typography>
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
