import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import useTranslation from './customHooks/translations';
import { LOG_STEPS, TOTAL_LOG_STEPS } from '../constants/log-steps';

const getStepCounterStyles = (currentColor) => ({
  margin: '0 auto',
  textAlign: 'center',
  fontSize: {
    xs: '0.725rem',
    sm: '0.825rem',
    lg: '1rem',
  },
  ol: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    padding: '0',
    margin: '1em 0',
    gap: {
      xs: '0.75em',
      lg: '1.25em',
    },
  },
  li: {
    color: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    display: {
      xs: 'block',
      md: 'flex',
    },
    '&:before': {
      background: 'rgba(255,255,255,0.75)',
      borderRadius: '1em',
      outline: 'solid 0.15em transparent',
      outlineOffset: '0.15em',
      lineHeight: '1.75',
      display: 'block',
      color: 'black',
      width: {
        xs: '2.25em',
        md: '1.75em',
      },
      height: {
        xs: '0.5em',
        md: '1.75em',
      },
    },
    '&.current:before, &.completed:before': {
      background: currentColor,
    },
    '&.current:before': {
      outlineColor: currentColor,
    },
  },
  '.title': {
    margin: {
      xs: '0',
      md: '0 0.5em',
      lg: '0 0.75em',
    },
    display: {
      xs: 'none',
      md: 'block',
    },
  },
});

export const StepCounter = ({ activeStep, currentColor }) => {
  const translation = useTranslation();

  // We don't count the final screen as a numbered step, so we'll
  // render nothing if it is not included in the LOG_STEPS array.
  if (!LOG_STEPS.find((step) => step.number === activeStep)) return null;

  // We aren't showing the counter while selecting an action type
  // but it still counts as a numbered step, so we'll conditionally
  // hide the visual counter for the first screen.
  const listDisplayStyle = { display: activeStep === 0 ? 'none' : 'flex' };
  const stepCounterStyles = getStepCounterStyles(currentColor);

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
