import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ActionButtons from './ActionButtons';

import useTranslation from '../customHooks/translations';

const CO2SavedScreen = ({
  actionId,
  actionDate,
  actionStyle,
  totalCO2Saved,
  setActiveStep,
  activeStep,
  skipBonusQuestion,
  validationSuccess,
}) => {
  const translation = useTranslation();

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
              variant="h2"
              sx={{ fontWeight: '700', fontSize: '1em' }}
            >
              Thank you!
            </Typography>
            {validationSuccess ? (
              <Box>
                <Typography variant="h3">
                  {translation.co2SavedScreenValidated}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: '1.5em' }}>
                  {translation.formatString(
                    translation.co2SavedScreenSaved,
                    totalCO2Saved
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
                    translation.co2SavedScreenImpact,
                    totalCO2Saved
                  )}
                </Typography>
              </Box>
            )}
          </>
        }
      </Box>
      {skipBonusQuestion ? (
        <Box
          component="div"
          sx={{
            m: 'auto 1.25em',
          }}
        >
          <Button
            onClick={() => {
              setActiveStep(activeStep + 2);
            }}
            variant="contained"
            sx={{
              width: '50%',
              padding: '.5em 1em',
              fontSize: '1.2rem',
              borderRadius: '35px',
              color: 'white',
            }}
          >
            {translation.continue}
          </Button>
        </Box>
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
