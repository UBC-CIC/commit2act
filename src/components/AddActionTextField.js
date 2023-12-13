import * as React from 'react';
import { TextField } from '@mui/material';
import { useActiveStepContext } from '../hooks/use-active-step-context';
import {
  getContainerStyles,
  helperTextStyles,
  inputStyles,
  labelStyles,
} from '../styles/add-action-text-field';

export const AddActionTextField = ({
  InputProps = {},
  InputLabelProps = {},
  FormHelperTextProps = {},
  sx = {},
  ...props
}) => {
  const { actionStyle } = useActiveStepContext();
  const containerStyles = { ...sx, ...getContainerStyles(actionStyle.color) };
  return (
    <TextField
      fullWidth
      FormHelperTextProps={{
        ...FormHelperTextProps,
        sx: helperTextStyles,
      }}
      InputProps={{
        ...InputProps,
        fullWidth: true,
        disableUnderline: true,
        sx: inputStyles,
      }}
      InputLabelProps={{
        ...InputLabelProps,
        disableAnimation: true,
        shrink: false,
        sx: labelStyles,
      }}
      sx={containerStyles}
      variant="standard"
      {...props}
    />
  );
};
