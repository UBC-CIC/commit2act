import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import useTranslation from './customHooks/translations';
import { useActiveStepContext } from '../hooks/use-active-step-context';
import { LOG_STEPS, TOTAL_LOG_STEPS } from '../constants/log-steps';
import { getStepCounterStyles } from '../styles/step-counter';

export const StepCounter = () => {
  const translation = useTranslation();
  const { activeStep, actionStyle } = useActiveStepContext();

  // We don't count the final screen as a numbered step, so we'll
  // render nothing if it is not included in the LOG_STEPS array.
  if (!LOG_STEPS.find((step) => step.number === activeStep)) return null;

  // We aren't showing the counter while selecting an action type
  // but it still counts as a numbered step, so we'll conditionally
  // hide the visual counter for the first screen.
  const listDisplayStyle = { display: activeStep === 0 ? 'none' : 'flex' };
  const stepCounterStyles = getStepCounterStyles(actionStyle.color);

  return (
    <Box sx={stepCounterStyles}>
      <Box aria-live="polite" sx={visuallyHidden}>
        {translation.formatString(
          translation.logActionStepOfTotal,
          activeStep + 1,
          TOTAL_LOG_STEPS
        )}
      </Box>
      <Box component="ol" sx={listDisplayStyle}>
        {LOG_STEPS.map(({ number, title, name }) => {
          const isCompleted = number < activeStep;
          const displayNumber = number + 1;

          let className = '',
            dotContent = `"${displayNumber}"`,
            statusText = null;

          if (number === activeStep) {
            className = 'current';
            statusText = 'logActionStepCurrent';
          }
          if (isCompleted) {
            className = 'completed';
            dotContent = '"\\2714"';
            statusText = 'logActionStepCompleted';
          }

          // Concatenate the step number, completed/current status,
          // and step title as the visually-hidden label per step.
          const visuallyHiddenText = [
            displayNumber,
            statusText ? translation[statusText] : '',
            translation[title] ? translation[title] : '',
          ].join(' ');

          return (
            <Box
              component="li"
              key={name}
              className={className}
              sx={{
                '&:before': {
                  content: {
                    xs: '""',
                    md: dotContent,
                  },
                },
              }}
            >
              <Typography variant="span" sx={visuallyHidden}>
                {visuallyHiddenText}
              </Typography>
              <Typography variant="span" className="title" aria-hidden="true">
                {translation[title] ? translation[title] : ''}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
