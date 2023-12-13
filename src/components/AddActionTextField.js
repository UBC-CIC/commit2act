import * as React from 'react';
import { TextField } from '@mui/material';
import { useActiveStepContext } from '../hooks/use-active-step-context';
import {
  getContainerStyles,
  helperTextStyles,
  inputStyles,
  labelStyles,
} from '../styles/add-action-text-field';

export const AddActionTextField = ({ actionItem, ...props }) => {
  const { actionStyle } = useActiveStepContext();
  const containerStyles = getContainerStyles(actionStyle.color);
  const { item_name: name, item_description: description } = actionItem;
  return (
    <TextField
      fullWidth
      FormHelperTextProps={{
        sx: helperTextStyles,
      }}
      helperText={description}
      InputProps={{
        fullWidth: true,
        disableUnderline: true,
        sx: inputStyles,
      }}
      InputLabelProps={{
        disableAnimation: true,
        shrink: false,
        sx: labelStyles,
      }}
      label={name}
      sx={containerStyles}
      variant="standard"
      {...props}
    />
  );
};
