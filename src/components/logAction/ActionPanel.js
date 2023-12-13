import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, CircularProgress } from '@mui/material';
import useTranslation from '../customHooks/translations';
import { AddActionTextField } from '../AddActionTextField';
import { useGetActionItems } from '../../hooks/use-get-action-items';

const ActionPanel = ({ actionItemValues, setActionItemValues }) => {
  const { actionItems, loadingItems } = useGetActionItems();
  const [inputError, setInputError] = useState(false);
  const [disableButton, setDisableButton] = useState(true);

  const translation = useTranslation();

  //updates total co2 saved value and records what user inputs for each item field on the form
  const handleActionItemInput = (value, item) => {
    //if user input is not an int/float and is not empty, do not update or set the actionItemValues
    if (value !== '' && !value.match(new RegExp('^([1-9]\\d*|0)(\\.\\d+)?$'))) {
      setInputError(true);
      return;
    }
    setInputError(false);
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

  //set disable button to true if length of actionItemValues is 0 or if there's an input error
  useEffect(() => {
    setDisableButton(actionItemValues.length === 0 || inputError);
  }, [actionItemValues, inputError]);

  return (
    <Grid item>
      <Box>
        {inputError && (
          <Typography variant="subtitle2">
            {translation.mustBeNumber}
          </Typography>
        )}
        {loadingItems ? <CircularProgress /> : null}
        {actionItems && actionItems.length > 0
          ? actionItems.map((item) => (
              <AddActionTextField
                key={item.item_name}
                label={item.item_name}
                helperText={item.item_description}
                onChange={(e) => handleActionItemInput(e.target.value, item)}
              />
            ))
          : null}
      </Box>
    </Grid>
  );
};

export default ActionPanel;
