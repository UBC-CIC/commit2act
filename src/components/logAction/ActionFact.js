import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
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
import ActionButtons from './ActionButtons';
import { useActiveStepContext } from '../../hooks/use-active-step-context';
import { useUserInfoContext } from '../../hooks/use-user-info-context';
import { useActionDetailsContext } from '../../hooks/use-action-details-context';
import { useActionFactImage } from '../../hooks/use-action-fact-image';

import { useLanguageContext } from '../contexts/LanguageContext';
import PropTypes from 'prop-types';

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
}

const ActionFact = ({
  setQuiz,
  setSkipBonusQuestion,
  setValidationSuccess,
}) => {
  const { activeStep, actionStyle, setActiveStep, selectedAction } =
    useActiveStepContext();
  const { quiz, selectedDate, totalCO2Saved, actionItemValues, selectedImage } =
    useActionDetailsContext();
  const { user } = useUserInfoContext();
  const { randomImage, isLoading } = useActionFactImage();
  const { contentTranslations } = useContentTranslationsContext();
  const translation = useTranslation();
  const [noPossibleQuizzes, setNoPossibleQuizzes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(true);
  const { language } = useLanguageContext();

  useEffect(() => {
    const getFact = async () => {
      let possibleQuizzes = [];

      if (language !== 'en') {
        const relevantTranslationObject = contentTranslations.find(
          (contentTranslation) =>
            contentTranslation.langCode.toLowerCase() === language.toLowerCase()
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
  }, [
    selectedAction,
    setQuiz,
    setSkipBonusQuestion,
    user.user_id,
    contentTranslations,
    language,
  ]);

  const submitAction = async () => {
    let submittedActionId = null;
    try {
      //creates and submits the action, returns the submitted action id that is stored in database
      const res = await API.graphql({
        query: createSubmittedAction,
        variables: {
          action_id: selectedAction?.action_id,
          date_of_action: selectedDate,
          first_quiz_answer_correct: false,
          g_co2_saved: totalCO2Saved,
          is_validated: false,
          points_earned: Math.ceil(totalCO2Saved),
          quiz_answered: false,
          user_id: user.user_id,
          quiz_id: quiz ? quiz.quiz_id : null,
        },
      });
      submittedActionId = await res.data.createSubmittedAction.sa_id;
    } catch (e) {
      console.log('Error creating submitted action:', e);
    }

    try {
      //creates the submitted action items for the action
      await API.graphql({
        query: createSubmittedActionItems,
        variables: {
          sa_id: submittedActionId,
          submitted_action_items: actionItemValues,
        },
      });
    } catch (e) {
      console.log('Error creating submitted action items:', e);
    }

    if (selectedImage) {
      let imageKey = 'validation/input/'.concat(submittedActionId, '.png');
      let imageType = selectedImage.type;
      try {
        await Storage.put(imageKey, selectedImage, {
          contentType: imageType,
        });
      } catch (error) {
        console.log('Error uploading file', error);
      }
      //update state when action and action items have finished submitting
      setActionSubmitting(false);
    }
    //set timeout of 5s so that image has time to be transferred by lambda and processed by rekognition
    setTimeout(() => {
      checkImageValidation(submittedActionId);
    }, 5000);
  };

  const checkImageValidation = async (submittedActionId) => {
    try {
      const res = await API.graphql({
        query: getSingleSubmittedAction,
        variables: { sa_id: submittedActionId },
      });
      const passedValidation = res.data.getSingleSubmittedAction.is_validated;
      if (passedValidation) {
        setValidationSuccess(true);
      }
    } catch (e) {
      console.log('Error validating file:', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    submitAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //if there are no possible quizzes, display fallback text. If there is no fallback text, display default message
  const renderFact = () => {
    if (quiz) {
      return (
        <Typography variant="p" sx={{ lineHeight: '1.5' }}>
          {quiz.fact_text}
        </Typography>
      );
    } else if (noPossibleQuizzes) {
      return selectedAction.fallback_quiz_media ? (
        <Typography variant="p" sx={{ lineHeight: '1.5' }}>
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

  const renderImage = () =>
    !isLoading ? (
      randomImage ? (
        <figure
          style={{
            position: 'relative',
            margin: '1.5rem auto',
          }}
        >
          <img
            height="250px"
            src={randomImage['Thumb228']}
            alt={randomImage?.title}
            style={{ borderRadius: '1.5rem' }}
          />
          <figcaption
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '10px',
              color: 'white',
              fontSize: '14px',
            }}
          >
            Photo by {randomImage['Artist']} from {randomImage['Country']}
          </figcaption>
        </figure>
      ) : null
    ) : (
      <CircularProgress />
    );

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
          {translation.your}
          <Typography
            variant="span"
            sx={{ color: actionStyle.color, display: 'inline' }}
          >
            {` ${selectedAction.action_name} `}
          </Typography>
          {translation.actionIsSubmitted}
        </Typography>
      </Box>
      {renderImage()}
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
        <Typography
          variant="h2"
          sx={{
            color: actionStyle.color,
            fontWeight: 'bold',
            paddingBottom: '1rem',
          }}
        >
          Did you know?{' '}
        </Typography>
        {renderFact()}
      </Box>
      <ActionButtons
        forwardOnClick={() => setActiveStep(activeStep + 1)}
        forwardProps={{
          disabled: loading,
        }}
        forwardText={
          <>
            {translation.done}
            {loading && <CircularProgress />}
          </>
        }
      >
        <Box aria-live="polite" sx={visuallyHidden}>
          {
            translation[
              loading
                ? 'logActionValidationLoading'
                : 'logActionValidationComplete'
            ]
          }
        </Box>
      </ActionButtons>
    </Grid>
  );
};

ActionFact.propTypes = {
  setQuiz: PropTypes.func,
  setSkipBonusQuestion: PropTypes.func,
  setValidationSuccess: PropTypes.func,
};

export default ActionFact;
