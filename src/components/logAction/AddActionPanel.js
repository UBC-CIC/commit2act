import React from 'react';
import { TextField, Box, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { parseISO } from 'date-fns';
import ActionPanel from './ActionPanel';
import ActionButtons from './ActionButtons';
import ImageValidationPanel from './ImageValidationPanel';

import useTranslation from '../customHooks/translations';

const AddActionPanel = ({
  selectedDate,
  handleDateChange,
  selectedAction,
  setTotalCO2Saved,
  actionItemValues,
  setActionItemValues,
  activeStep,
  setActiveStep,
  skipBonusQuestion,
  selectedImage,
  setSelectedImage,
  calculateCO2,
}) => {
  const translation = useTranslation();

  return (
    <>
      <Grid
        item
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            width: '80%',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={translation.chooseDate}
              value={parseISO(selectedDate)}
              onChange={handleDateChange}
              renderInput={(selectedDate) => <TextField {...selectedDate} />}
            />
          </LocalizationProvider>
          <ActionPanel
            selectedAction={selectedAction}
            setTotalCO2Saved={setTotalCO2Saved}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </Box>

        <ImageValidationPanel
          skipBonusQuestion={skipBonusQuestion}
          setActiveStep={setActiveStep}
          activeStep={activeStep}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      </Grid>
      <ActionButtons
        forwardOnClick={calculateCO2}
        backOnclick={() => setActiveStep(activeStep - 1)}
        forwardText={translation.next}
        backText={translation.previous}
      />
    </>
  );
};

export default AddActionPanel;
