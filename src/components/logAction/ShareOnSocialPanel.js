import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { useUpdateSubmittedAction } from '../customHooks/use-update-submitted-action';
import { PAGE_PATHS } from '../../constants/page-paths';

const filterUpdateDataFromProps = (props) => ({
  actionDate: props.actionDate,
  actionId: props.actionId,
  firstQuizAnswerCorrect: props.firstQuizAnswerCorrect,
  quizAnswered: props.quizAnswered,
  quizId: props.quizId,
  totalCO2Saved: props.totalCO2Saved,
  userId: props.userId,
});

const ShareOnSocialPanel = ({ addAnotherAction, ...props }) => {
  const translation = useTranslation();
  const navigate = useNavigate();

  // Update the current action with quiz info on init of this panel
  useUpdateSubmittedAction(filterUpdateDataFromProps(props), true);

  return (
    <Box>
      <div>I dare you to match my action by...</div>
      <ActionButtons
        backOnClick={addAnotherAction}
        backText={translation.logActionButtonAddAnother}
        forwardOnClick={() => navigate(PAGE_PATHS.DASHBOARD)}
        forwardText={translation.logActionButtonAllDone}
      />
    </Box>
  );
};

export default ShareOnSocialPanel;
