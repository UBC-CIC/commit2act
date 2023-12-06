import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { LOG_STEPS, TOTAL_LOG_STEPS } from '../constants/log-steps';
import useTranslation from './customHooks/translations';

const getStepCounterStyles = (currentColor) => ({
  margin: '1em auto',
  textAlign: 'center',
  fontSize: {
    xs: '0.725rem',
    md: '0.825rem',
    lg: '1rem',
  },
  ol: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    listStyle: 'none',
    padding: '0',
    margin: '0',
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
        xs: '3em',
        md: '1.75em',
      },
      height: {
        xs: '0.75em',
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
      <Box component="ol">
        {LOG_STEPS.map(({ number, title, name }) => {
          const isCompleted = number < activeStep;
          const displayNumber = number + 1;

          let className = '',
            statusText = null;

          if (number === activeStep) {
            className = 'current';
            statusText = 'logActionStepCurrent';
          }
          if (isCompleted) {
            className = 'completed';
            statusText = 'logActionStepCompleted';
          }

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
                    md: `"${isCompleted ? '\\2714' : displayNumber}"`,
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
