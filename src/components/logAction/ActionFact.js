import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress, Button } from '@mui/material';
import { API } from 'aws-amplify';
import { getQuizPoolForUser } from '../../graphql/queries';
import Modal from 'react-modal';

import useTranslation from '../customHooks/translations';
import { useContentTranslationsContext } from '../contexts/ContentTranslationsContext';
import {
  createSubmittedAction,
  createSubmittedActionItems,
} from '../../graphql/mutations';
import { getSingleSubmittedAction } from '../../graphql/queries';

Modal.setAppElement('#root');

const ActionFact = ({
  selectedAction,
  actionStyle,
  setQuiz,
  quiz,
  user,
  setSkipBonusQuestion,
  activeStep,
  setActiveStep,
  actionDate,
  totalCO2Saved,
  actionItemValues,
  selectedImage,
  setValidationSuccess,
}) => {
  const [noPossibleQuizzes, setNoPossibleQuizzes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(true);
  // Modal.setAppElement('#yourAppElement');

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const translation = useTranslation();
  const { contentTranslations } = useContentTranslationsContext();

  useEffect(() => {
    const getFact = async () => {
      let possibleQuizzes = [];

      if (translation.getLanguage() !== 'en') {
        const relevantTranslationObject = contentTranslations.find(
          (contentTranslation) =>
            contentTranslation.langCode.toLowerCase() ===
            translation.getLanguage().toLowerCase()
        );
        const relevantAction =
          relevantTranslationObject?.translationJSON?.actions?.find(
            (action) => action.action_id === selectedAction.action_id
          );

        // disassemble into answers and correct answers
        relevantAction?.quizzes?.map((quiz) => {
          quiz.answers =
            quiz.quiz_answers
              .map((quiz_answer) => quiz_answer.answer)
              .join('\n') || '';
          quiz.correct_answers =
            quiz.quiz_answers.find(
              (quiz_answer) => quiz_answer.is_correct_answer === true
            )?.answer || '';
        });

        possibleQuizzes = relevantAction?.quizzes || [];
      } else {
        const quizPoolForUserRes = await API.graphql({
          query: getQuizPoolForUser,
          variables: {
            user_id: user.user_id,
            action_id: selectedAction.action_id,
          },
        });
        //select random fact from quiz pool that has not been answered by the user yet
        possibleQuizzes = quizPoolForUserRes.data.getQuizPoolForUser;
      }
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

  useEffect(() => {
    submitAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAction = async () => {
    //creates and submits the action, returns the submitted action id that is stored in database
    const res = await API.graphql({
      query: createSubmittedAction,
      variables: {
        action_id: selectedAction?.action_id,
        date_of_action: actionDate,
        first_quiz_answer_correct: false,
        g_co2_saved: totalCO2Saved,
        is_validated: false,
        points_earned: Math.ceil(totalCO2Saved),
        quiz_answered: false,
        user_id: user.user_id,
        quiz_id: quiz ? quiz.quiz_id : null,
      },
    });

    const submittedActionId = res.data.createSubmittedAction.sa_id;
    //creates the submitted action items for the action
    await API.graphql({
      query: createSubmittedActionItems,
      variables: {
        sa_id: submittedActionId,
        submitted_action_items: actionItemValues,
      },
    });

    if (selectedImage) {
      let imageKey = 'validation/input/'.concat(submittedActionId, '.png');
      let imageType = selectedImage.type;
      try {
        await Storage.put(imageKey, selectedImage, {
          contentType: imageType,
        });
        //update state when action and action items have finished submitting
        setActionSubmitting(false);
      } catch (error) {
        console.log('Error uploading file', error);
      }
    }
    //set timeout of 5s so that image has time to be transferred by lambda and processed by rekognition
    setTimeout(() => {
      checkImageValidation(submittedActionId);
    }, 5000);
  };

  const checkImageValidation = async (submittedActionId) => {
    const res = await API.graphql({
      query: getSingleSubmittedAction,
      variables: { sa_id: submittedActionId },
    });
    const passedValidation = res.data.getSingleSubmittedAction.is_validated;
    if (passedValidation) {
      setValidationSuccess(true);
    }
    setLoading(false);
  };

  //if there are no possible quizzes, display fallback text. If there is no fallback text, display default message
  const renderFact = () => {
    if (quiz) {
      return (
        <Typography
          variant="p"
          sx={{ color: actionStyle.color, fontSize: '.5em', lineHeight: '1.5' }}
        >
          {quiz.fact_text}
        </Typography>
      );
    } else if (noPossibleQuizzes) {
      return selectedAction.fallback_quiz_media ? (
        <Typography
          variant="p"
          sx={{ color: actionStyle.color, fontSize: '.5em', lineHeight: '1.5' }}
        >
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

  console.log();

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
      <Box>
        <Typography>
          Your {selectedAction.action_name} action is being submitted.
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          overflow: 'auto',
          fontSize: '1.8em',
          paddingTop: '2rem',
        }}
      >
        <Typography variant="h2">Did you know? </Typography>
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
      <Box
        component="div"
        sx={{
          m: '0 0 1.25em',
          width: { xs: '50%' },
        }}
      >
        <Button
          onClick={() => setActiveStep(activeStep + 1)}
          variant="contained"
          sx={{
            width: '100%',
            padding: '.5em 1em',
            fontSize: '1.2rem',
            borderRadius: '35px',
            color: 'white',
          }}
          disabled={loading}
        >
          {translation.done}{' '}
          {loading && <CircularProgress sx={{ margin: '0 1em' }} />}
        </Button>
      </Box>
    </Grid>
  );
};

export default ActionFact;
