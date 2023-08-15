import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { green, red } from '@mui/material/colors';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { CheckCircle, Cancel } from '@mui/icons-material';

import useTranslation from '../customHooks/translations';

const PasswordRequirements = ({ requirements }) => {
  const useStyles = makeStyles()((theme) => {
    return{
      valid: {
        color: '#5BD048',
      },
      invalid: {
        color: theme.palette.error.main,
      },
      fontSize: {
        fontSize: '0.9rem',
      },
    }
  });

  const translation = useTranslation();
  const { classes } = useStyles();

  return (
    <List dense={true} className={classes.root}>
      {Object.entries(requirements).map((req) => {
        return (
          <ListItem key={req[0]}>
            <ListItemIcon>
              {req[1].error ? (
                <CheckCircle className={classes.valid} />
              ) : (
                <Cancel className={classes.invalid} />
              )}
            </ListItemIcon>
            <ListItemText
              className={classes.fontSize}
              primary={translation[req[1].description]}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default PasswordRequirements;
