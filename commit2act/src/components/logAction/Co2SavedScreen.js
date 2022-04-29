import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { API, Storage } from 'aws-amplify';
import {
  createSubmittedAction,
  createSubmittedActionItems,
} from '../../graphql/mutations';
import { getSingleSubmittedAction } from '../../graphql/queries';

const CO2SavedScreen = ({
  actionId,
  actionDate,
  totalCO2Saved,
  setActiveStep,
  quizAnswered,
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

  useEffect(() => {
    submitAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAction = async () => {
    //creates and submits the action, returns the submitted action id that is stored in database
    const points = firstQuizAnswerCorrect ? 10 : 0;
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
    //set timeout of 8s so that image has time to be transferred by lambda and processed by rekognition
    setTimeout(() => {
      checkImageValidation(submittedActionId);
    }, 8000);
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
            Your action is currently being{' '}
            {actionSubmitting ? 'submitted' : 'validated'}
          </Typography>
          {!actionSubmitting && (
            <Typography variant="subtitle2">
              Press skip to view validation results at a later time
            </Typography>
          )}
          <CircularProgress />
        </>
      )}
      {/* display after image validation and action submission have completed */}
      {!loading && (
        <>
          <Typography variant="h2">Thank you!</Typography>
          {validationSuccess ? (
            <Typography variant="h3">
              Your action has been validated
              <Typography variant="subtitle2" sx={{ mt: '1.5em' }}>
                You have saved {totalCO2Saved} g of CO2
              </Typography>
            </Typography>
          ) : (
            <Typography variant="h3">
              Your action is awaiting admin approval
            </Typography>
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
          sx={{ mt: '3em', width: '80%' }}
          variant="contained"
        >
          {!loading ? 'Add Another Action' : 'Skip'}
        </Button>
      )}
    </Box>
  );
};

export default CO2SavedScreen;
