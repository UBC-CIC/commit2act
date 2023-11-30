import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { API, Storage } from 'aws-amplify';
import {
  createSubmittedAction,
  createSubmittedActionItems,
} from '../../graphql/mutations';
import { getSingleSubmittedAction } from '../../graphql/queries';

import useTranslation from '../customHooks/translations';

const CO2SavedScreen = ({
  actionId,
  actionDate,
  actionStyle,
  totalCO2Saved,
  setActiveStep,
  quizAnswered,
  quiz,
  firstQuizAnswerCorrect,
  user,
  actionItemValues,
  setActionItemValues,
  setSelectedAction,
  selectedImage,
  setSelectedImage,
}) => {
  const [loading, setLoading] = useState(true);
  const [actionSubmitting, setActionSubmitting] = useState(true);
  const [validationSuccess, setValidationSuccess] = useState(false);

  const translation = useTranslation();

  useEffect(() => {
    submitAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAction = async () => {
    //creates and submits the action, returns the submitted action id that is stored in database
    const points = firstQuizAnswerCorrect
      ? Math.ceil(totalCO2Saved) + 10
      : Math.ceil(totalCO2Saved);
    const res = await API.graphql({
      query: createSubmittedAction,
      variables: {
        action_id: actionId,
        date_of_action: actionDate,
        first_quiz_answer_correct: firstQuizAnswerCorrect,
        g_co2_saved: totalCO2Saved,
        is_validated: false,
        points_earned: points,
        quiz_answered: quizAnswered,
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: '20vh',
        alignItems: 'center',
      }}
    >
      {/* display while image validation and action submission are occuring */}
      {loading && (
        <>
          <Typography variant="h3">
            {translation.co2SavedScreenState}{' '}
            {actionSubmitting ? translation.submitted : translation.validated}
          </Typography>
          {!actionSubmitting && (
            <Typography variant="subtitle2">
              {translation.skip}
            </Typography>
          )}
          <CircularProgress sx={{ mt: '1em', color: actionStyle.color }} />
        </>
      )}
      {/* display after image validation and action submission have completed */}
      {!loading && (
        <>
          <Typography variant="h2" sx={{fontWeight: '700', fontSize: '1em'}}>Thank you!</Typography>
          {validationSuccess ? (
            <Box>
              <Typography variant="h3">
                {translation.co2SavedScreenValidated}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: '1.5em' }}>
			  {translation.formatString(translation.co2SavedScreenSaved, totalCO2Saved)}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h3" component="p">
                {translation.co2SavedScreenApproval}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: '1.5em', fontSize: '1em', marginBottom: '1.3em', color: actionStyle.color }}>
                {translation.formatString(translation.co2SavedScreenImpact, totalCO2Saved)}
              </Typography>
            </Box>
          )}
        </>
      )}
      {/* display Skip if action has finished submitting but not validating
      display Add Another Action if action submission and validation are complete*/}
      {((loading && !actionSubmitting) || !loading) && (
        <Button
          onClick={() => {
            setActiveStep(0);
            setSelectedAction(null);
            setActionItemValues([]);
            setSelectedImage(null);
          }}
          sx={{
            width: '80%',
            maxWidth: '300px',
            padding: '1em 1em 1.3em',
            fontSize: '1.2rem',
          }}
          variant="contained"
        >
          {!loading ? translation.co2SavedScreenAnother : 'Skip'}
        </Button>
      )}
    </Box>
  );
};

export default CO2SavedScreen;
