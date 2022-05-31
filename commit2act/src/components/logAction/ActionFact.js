import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
// import { API, graphqlOperation } from 'aws-amplify';
// import { listQuizID, getFactBonusPointQuiz } from '../../graphql/queries';

const ActionFact = ({ setFact, fact }) => {
  const [factText, setFactText] = useState(
    'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production'
  );
  // const [factLoaded, setFactLoaded] = useState(false);

  // const getFactIds = async () => {
  //   const res = await API.graphql(graphqlOperation(listQuizID));
  //   let numFacts = res.data.listFactBonusPointQuizs.items.length;
  //   let randomNumber = Math.floor(Math.random() * numFacts);
  //   let id = res.data.listFactBonusPointQuizs.items[randomNumber].id;
  //   getSelectedFact(id);
  // };

  // const getSelectedFact = async (id) => {
  //   const res = await API.graphql(
  //     graphqlOperation(getFactBonusPointQuiz, { id: id })
  //   );
  //   setFactText(res.data.getFactBonusPointQuiz.fact_text);
  //   setFact((fact) => ({ ...res.data.getFactBonusPointQuiz }));
  //   setFactLoaded(true);
  // };

  // useEffect(() => {
  //   getFactIds();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2em',
          backgroundColor: '#FFFFFF',
          width: '80%',
          height: '20vh',
          overflow: 'auto',
        }}
      >
        {/* {factLoaded ? (
          <Typography variant="body1">{factText}</Typography>
        ) : (
          <CircularProgress />
        )} */}
        <Typography variant="body1" sx={{ mt: '1em' }}>
          {factText}
        </Typography>
      </Box>
    </Grid>
  );
};

export default ActionFact;
