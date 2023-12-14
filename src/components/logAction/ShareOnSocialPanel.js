import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { useUpdateSubmittedAction } from '../customHooks/use-update-submitted-action';
import { PAGE_PATHS } from '../../constants/page-paths';
import { formatCo2Saved } from '../../utils/format-co2-saved';

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
  const formattedCo2Saved = formatCo2Saved(props.totalCO2Saved);

  // Update the current action with quiz info on init of this panel
  useUpdateSubmittedAction(filterUpdateDataFromProps(props), true);

  return (
    <Box>
      <Box
        sx={{
          background: 'white',
          padding: '1em 1.5em',
          marginBottom: '2.5rem',
        }}
      >
        <Typography color="black">
          {translation.formatString(
            translation.logActionShareSummarySimple,
            formattedCo2Saved
          )}
        </Typography>
        <Typography
          color="black"
          textTransform="uppercase"
          fontWeight="bold"
          marginTop="0.5em"
        >
          {translation.commit2ActHashtag}
        </Typography>
      </Box>
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
