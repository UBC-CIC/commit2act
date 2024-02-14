import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { Grid, Box } from '@mui/material';

import LanguageHandler from '../LanguageHandler';
import useTranslation from '../customHooks/translations';
// const icon192x192 = require('/public/icon-192x192.png');

const useStyles = makeStyles()((theme) => {
  return {
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      display: 'flex',
      position: 'fixed',
      top: '10px',
      width: '100%',
      justifyContent: 'space-between',
      'label': {
        color: '#fff',
      },
    },
    logo: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      paddingLeft: '15px',
    },
  };
});

function LoginNavbar(props) {
  const { classes } = useStyles();
  const translation = useTranslation();

  return (
    <Grid item xs={12} className={classes.appBar}>
      <Box
        component="img"
        sx={{
          height: 56,
          width: 56,
          marginRight: 1,
        }}
        alt=""
        src={`${process.env.PUBLIC_URL}/icon-192x192.png`}
      />
      <div>
        <LanguageHandler />
      </div>
    </Grid>
  );
}

export default LoginNavbar;
