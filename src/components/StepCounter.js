import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { LOG_STEPS, TOTAL_LOG_STEPS } from '../constants/log-steps';
import useTranslation from './customHooks/translations';

const getStepStatus = (activeStep, currentStep) => {
  const stepStatus = {
    className: '',
    helperText: null,
  };
  if (currentStep === activeStep) {
    stepStatus.className = 'current';
    stepStatus.helperText = 'logActionStepCurrent';
  }
  if (currentStep < activeStep) {
    stepStatus.className = 'completed';
    stepStatus.helperText = 'logActionStepCompleted';
  }
  return stepStatus;
};

const getStepCounterStyles = (currentColor) => ({
  width: 'max-content',
  margin: '1em',
  textAlign: 'center',
  fontSize: {
    xs: '0.725rem',
  },
  ol: {
    display: 'flex',
    justifyItems: 'space-between',
    gap: '0.75em',
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  li: {
    color: 'white',
    '&:before': {
      content: '""',
      display: 'block',
      width: {
        xs: '3em',
        md: '1em',
      },
      height: {
        xs: '0.75em',
        md: '1em',
      },
      background: 'white',
      borderRadius: '1em',
      outline: 'solid 0.15em transparent',
      outlineOffset: '0.2em',
    },
    '&.current:before, &.completed:before': {
      background: currentColor,
    },
    '&.current:before': {
      outlineColor: currentColor,
    },
  },
  '.title': {
    display: {
      xs: 'none',
      md: 'block',
    },
  },
});

export const StepCounter = ({ activeStep, currentColor }) => {
  const translation = useTranslation();
  const stepCounterStyles = getStepCounterStyles(currentColor);

  if (activeStep === 0) return null;

  return (
    <Box sx={stepCounterStyles}>
      <Box aria-live="polite" sx={visuallyHidden}>
        {translation.formatString(
          translation.logActionStepOfTotal,
          activeStep,
          TOTAL_LOG_STEPS
        )}
      </Box>
      <ol>
        {LOG_STEPS.map((step) => {
          const { className, helperText } = getStepStatus(
            activeStep,
            step.number
          );

          return (
            <li key={step.name} className={className}>
              <Typography variant="span" sx={visuallyHidden}>
                {step.number}
                {' ' + helperText ? translation[helperText] : ''}
                {' ' + translation[step.title] ? translation[step.title] : ''}
              </Typography>
              <Typography variant="span" className="title">
                {translation[step.title] ? translation[step.title] : ''}
              </Typography>
            </li>
          );
        })}
      </ol>
    </Box>
  );
};
