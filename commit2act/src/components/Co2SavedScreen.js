import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { API, Storage } from 'aws-amplify';
import {
  createSubmittedAction,
  createSubmittedActionItems,
} from '../graphql/mutations';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: 15,
            color: 'black',
            fontWeight: 100,
          },
        },
      ],
    },
  },
});

const Co2SavedScreen = ({
  actionId,
  actionDate,
  totalCo2Saved,
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
        g_co2_saved: totalCo2Saved,
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
      } catch (error) {
        console.log('Error uploading file', error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: '20vh',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2">Thank you!</Typography>
        <Typography variant="h3">
          You have saved {totalCo2Saved} g of CO2!
        </Typography>
        <Typography variant="subtitle1">
          An admin will now review your entry and your points will be added
          shortly
        </Typography>
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
          Add Another Action
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default Co2SavedScreen;
