import * as React from 'react';
import { Box, Input, Typography } from '@mui/material';
import { useActiveStepContext } from '../hooks/use-active-step-context';

const getFieldId = (name) => {
  const fieldId = name.toLowerCase().replaceAll(' ', '-');
  const descriptionId = fieldId + '-description';
  return { fieldId, descriptionId };
};

export const AddActionTextField = ({ actionItem, ...props }) => {
  const { actionStyle } = useActiveStepContext();
  const { item_name: name, item_description: description } = actionItem;
  const { fieldId, descriptionId } = getFieldId(name);
  return (
    <Box textAlign="left" margin="1.5em auto" width="100%" maxWidth="32em">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          component="label"
          htmlFor={fieldId}
          flex="1 1 60%"
          fontSize={{
            xs: '1em',
            sm: '1.1em',
            md: '1.15em',
          }}
          fontWeight="bold"
          lineHeight="1.25"
        >
          {name}
        </Typography>
        <Input
          id={fieldId}
          aria-describedby={descriptionId}
          flex="1 1 40%"
          sx={{
            '&:before, &:after': { display: 'none' },
          }}
          inputProps={{
            sx: {
              border: 'solid 0.15em',
              borderColor: actionStyle.color,
              background: 'white',
              color: 'black',
            },
          }}
          {...props}
        />
      </Box>
      <Typography
        id={descriptionId}
        component="p"
        marginTop="0.5em"
        fontSize={{
          xs: '0.825em',
          sm: '0.875em',
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
