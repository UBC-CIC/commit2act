import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { useActiveStepContext } from '../hooks/use-active-step-context';
import useTranslation from './customHooks/translations';
import { StepCounter } from './StepCounter';

const logStepHeadings = [
  'logActionStep1',
  'logActionStep2',
  'logActionStep3',
  'logActionStep4',
  'logActionStep5',
  'logActionStep6',
];

const headingGradientStyles = {
  backgroundColor: '#56C573',
  backgroundImage: 'linear-gradient(45deg, #56C573, #5BC0AC)',
  backgroundSize: '100%',
  WebkitBackgroundClip: 'text',
  MozBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent;',
  MozTextFillColor: 'transparent',
};

export const LogStepHeader = () => {
  const translation = useTranslation();
  const { activeStep, actionStyle, selectedAction } = useActiveStepContext();
  const stepHeadingText = translation[logStepHeadings[activeStep]];
  return (
    <Box m="0.5em 0" textAlign="center">
      <Box component="header">
        {activeStep > 0 && selectedAction && (
          <Typography
            fontSize={{ xs: '1em', sm: '1.125em' }}
            fontWeight="bold"
            mb="0.15em"
            component="p"
          >
            {selectedAction?.action_name}
          </Typography>
        )}
        <Typography
          color={actionStyle?.color ? actionStyle.color : 'inherit'}
          fontSize={{ xs: '2.25em', sm: '2.5em' }}
          fontWeight="bolder"
          lineHeight="1.25"
          textTransform="uppercase"
          component="h1"
          sx={activeStep === 0 ? headingGradientStyles : {}}
        >
          {stepHeadingText}
        </Typography>
      </Box>
      <StepCounter />
    </Box>
  );
};
