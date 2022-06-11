import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { API } from 'aws-amplify';
import { getQuizPoolForUser } from '../../graphql/queries';

const ActionFact = ({
  selectedAction,
  setQuiz,
  quiz,
  user,
  setSkipBonusQuestion,
}) => {
  const [noPossibleQuizzes, setNoPossibleQuizzes] = useState(false);

  useEffect(() => {
    const getFact = async () => {
      const quizPoolForUserRes = await API.graphql({
        query: getQuizPoolForUser,
        variables: {
          user_id: user.user_id,
          action_id: selectedAction.action_id,
        },
      });
      //select random fact from quiz pool that has not been answered by the user yet
      const possibleQuizzes = quizPoolForUserRes.data.getQuizPoolForUser;
      if (possibleQuizzes.length !== 0) {
        setQuiz(
          possibleQuizzes[Math.floor(Math.random() * possibleQuizzes.length)]
        );
      } else {
        setNoPossibleQuizzes(true);
        //skipBonusQuestion be updated in SelfReportMenu to skip the BonusPointQuiz step
        setSkipBonusQuestion(true);
      }
    };
    getFact();
  }, [selectedAction, setQuiz, setSkipBonusQuestion, user.user_id]);

  //if there are no possible quizzes, display fallback text. If there is no fallback text, display default message
  const renderFact = () => {
    if (quiz) {
      return <Typography variant="body1">{quiz.fact_text}</Typography>;
    } else if (noPossibleQuizzes) {
      return selectedAction.fallback_quiz_media ? (
        <Typography variant="body1">
          {selectedAction.fallback_quiz_media}
        </Typography>
      ) : (
        <Typography variant="h3">
          Thank you for submitting an action!
          <Typography variant="body1" sx={{ mt: '2em' }}>
            You have viewed all the facts for this action
          </Typography>
        </Typography>
      );
    } else {
      return <CircularProgress />;
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2em',
          backgroundColor: '#FFFFFF',
          width: '80%',
          height: '20vh',
          overflow: 'auto',
        }}
      >
        {renderFact()}
      </Box>
    </Grid>
  );
};

export default ActionFact;
