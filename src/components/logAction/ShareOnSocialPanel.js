import React from 'react';
import { Box } from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { useUpdateSubmittedAction } from '../customHooks/use-update-submitted-action';

const filterUpdateDataFromProps = (props) => ({
  actionId: props.actionId,
  actionDate: props.actionDate,
  firstQuizAnswerCorrect: props.firstQuizAnswerCorrect,
  totalCO2Saved: props.totalCO2Saved,
  quizAnswered: props.quizAnswered,
  userId: props.userId,
  quizId: props.quizId,
});

const ShareOnSocialPanel = (props) => {
  const translation = useTranslation();

  // Update the current action with quiz info on init of this panel
  useUpdateSubmittedAction(filterUpdateDataFromProps(props), true);

  return (
    <Box>
      <div>I dare you to match my action by...</div>
      <ActionButtons
        forwardOnClick={() => {}}
        backOnClick={() => {}}
        backText={translation.logActionButtonAddAnother}
        forwardText={translation.logActionButtonAllDone}
      />
    </Box>
  );
};

export default ShareOnSocialPanel;
