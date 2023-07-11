import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { API } from 'aws-amplify';
import { getQuizPoolForUser } from '../../graphql/queries';
import Modal from 'react-modal';

import useTranslation from '../customHooks/translations';
Modal.setAppElement('#root');

const ActionFact = ({
  selectedAction,
  setQuiz,
  quiz,
  user,
  setSkipBonusQuestion,
}) => {
  const [noPossibleQuizzes, setNoPossibleQuizzes] = useState(false);

  // Modal.setAppElement('#yourAppElement');

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal () {
    setIsOpen(true);
  }

  function afterOpenModal () {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal () {
    setIsOpen(false);
  }
  const translation = useTranslation();

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
      if (possibleQuizzes && possibleQuizzes?.length !== 0) {
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
      return <Typography variant="p" sx={{ color: '#BCF10C', fontSize: '.5em', lineHeight: '1.5' }}>{quiz.fact_text}</Typography>;
    } else if (noPossibleQuizzes) {
      return selectedAction.fallback_quiz_media ? (
        <Typography variant="p" sx={{ color: '#BCF10C', fontSize: '.5em', lineHeight: '1.5' }}>
          {selectedAction.fallback_quiz_media}
        </Typography>
      ) : (
        <Typography variant="h3">
          {translation.actionFactResponse}
          <Typography variant="p" sx={{ mt: '2em' }}>
            {translation.actionFactAllFacts}
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
          width: '80%',
          overflow: 'auto',
          fontSize: '1.8em',
        }}
      >
        {/* <button onClick={openModal}>Open Modal</button> */}
        {renderFact()}
      </Box>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="sourceModal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
      </Modal>
    </Grid>
  );
};

export default ActionFact;
