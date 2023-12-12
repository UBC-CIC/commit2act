import React from 'react';
import { TextField, Box, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { parseISO } from 'date-fns';
import ActionPanel from './ActionPanel';
import ActionButtons from './ActionButtons';
import ImageValidationPanel from './ImageValidationPanel';

import useTranslation from '../customHooks/translations';
import { useActiveStepContext } from '../../hooks/use-active-step-context';

const AddActionPanel = ({
  selectedDate,
  handleDateChange,
  setTotalCO2Saved,
  actionItemValues,
  setActionItemValues,
  skipBonusQuestion,
  selectedImage,
  setSelectedImage,
}) => {
  const translation = useTranslation();
  const { activeStep, actionStyle, selectedAction, setActiveStep } =
    useActiveStepContext();

  const calculateCO2 = () => {
    //get the total CO2 saved by summing the values for the co2 property of all the items in actionItemValues
    let sumCO2 = actionItemValues.reduce((sum, { co2 }) => sum + co2, 0);
    setTotalCO2Saved(sumCO2);
    //remove the co2 object property from every item in actionItemValues
    //so that actionItemValues will be in proper format to be used in CO2SavedScreen mutation
    let removedCO2 = actionItemValues.map(({ co2, ...value }) => value);
    setActionItemValues(removedCO2);
    //advances log action form to next step
    setActiveStep(activeStep + 1);
  };

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
          actionStyle={actionStyle}
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
