import React from 'react';
import { Box, Typography } from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { formatCo2Saved } from '../../utils/format-co2-saved';
import { useActiveStepContext } from '../../hooks/use-active-step-context';
import { useActionDetailsContext } from '../../hooks/use-action-details-context';

const CO2SavedScreen = () => {
  const { activeStep, actionStyle, setActiveStep } = useActiveStepContext();
  const { totalCO2Saved, skipBonusQuestion, validationSuccess } =
    useActionDetailsContext();
  const translation = useTranslation();
  const formattedCo2Saved = formatCo2Saved(totalCO2Saved);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: '20vh',
          alignItems: 'center',
        }}
      >
        {/* display after image validation and action submission have completed */}
        {
          <>
            <Typography
              variant="h1"
              sx={{ fontWeight: '700', color: actionStyle.color }}
            >
              +{formattedCo2Saved}g
            </Typography>
            <Typography sx={{ paddingTop: '1rem' }}>of CO2 saved</Typography>
            <Typography variant="h2" sx={{ color: actionStyle.color }}>
              Amazing! You are saving the planet!
            </Typography>
            {validationSuccess ? (
              <Box>
                <Typography variant="h3">
                  {translation.co2SavedScreenValidated}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: '1.5em' }}>
                  {translation.formatString(
                    translation.co2SavedScreenSaved,
                    formattedCo2Saved
                  )}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="h3" component="p">
                  {translation.co2SavedScreenApproval}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mt: '1.5em',
                    fontSize: '1em',
                    marginBottom: '1.3em',
                    color: '#34b198',
                  }}
                >
                  {translation.formatString(
                    translation.co2SavedScreenSaved,
                    totalCO2Saved
                  )}
                  {translation.takeBonusQuiz}
                </Typography>
              </Box>
            )}
          </>
        }
      </Box>
      {skipBonusQuestion ? (
        <ActionButtons
          forwardOnClick={() => setActiveStep(activeStep + 2)}
          forwardText={translation.continue}
        />
      ) : (
        <ActionButtons
          forwardOnClick={() => setActiveStep(activeStep + 1)}
          backOnClick={() => setActiveStep(activeStep + 2)}
          forwardText="Bonus Quiz"
          backText="Skip"
        />
      )}
    </>
  );
};

export default CO2SavedScreen;
