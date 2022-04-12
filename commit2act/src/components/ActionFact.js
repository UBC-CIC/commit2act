import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
// import { API, graphqlOperation } from 'aws-amplify';
// import { listQuizID, getFactBonusPointQuiz } from '../graphql/queries';

const ActionFact = ({ setStep, setFact, fact }) => {
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* {factLoaded ? (
          <Typography variant="body1">{factText}</Typography>
        ) : (
          <CircularProgress />
        )} */}
        <Typography variant="body1">{factText}</Typography>
      </Box>
      <Button
        onClick={() => {
          setStep(3);
        }}
        variant="contained"
      >
        Get Started
      </Button>
    </Box>
  );
};

export default ActionFact;
