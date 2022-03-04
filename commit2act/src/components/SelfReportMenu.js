import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import ActionFact from './ActionFact';
import ActionPanel from './ActionPanel';
import { styled } from '@mui/material';
import BonusPointQuiz from './BonusPointQuiz';

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    gap: '50px 0px',
  },
}));

const SelfReportMenu = () => {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedAction, setSelectedAction] = useState();
  //this will be used to get the fact answers for the bonus quiz step of the form
  const [fact, setFact] = useState();
  const [stepNumber, setStepNumber] = useState(0);

  const handleChangeStep = (stepNumber) => {
    setStepNumber(stepNumber);
  };

  let actionOptions = [
    'Plant Based Meals',
    'Transportation',
    'Reducing Plastic Waste',
  ];
  let groupOptions = ['Individual', 'UBC CIC'];

  //resets the form everytime a new action is selected
  useEffect(() => {
    if (selectedAction) {
      setStepNumber(1);
    } else {
      setStepNumber(0);
    }
  }, [selectedAction]);

  const renderFormStep = () => {
    return (
      selectedAction && (
        <Grid
          container
          direction="column"
          gap="30px"
          justifyContent="center"
          sx={{
            width: 400,
            minHeight: '32vw',
            backgroundColor: '#e8f4f8',
            padding: '50px',
          }}
        >
          {stepNumber === 1 && (
            <ActionFact setFact={setFact} changeStep={handleChangeStep} />
          )}
          {selectedAction && stepNumber === 2 && (
            <ActionPanel
              selectedAction={selectedAction}
              changeStep={handleChangeStep}
            />
          )}
          {stepNumber === 3 && <BonusPointQuiz fact={fact} />}
        </Grid>
      )
    );
  };

  console.log(selectedDate);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Typography variant="h4" sx={{ py: 5 }}>
        Self Report Actions
      </Typography>
      <StyledGrid
        container
        justifyContent="center"
        columnSpacing={selectedAction ? 6 : 0}
      >
        <Grid item>
          <Grid container direction="column" gap="20px">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              sx={{ minWidth: 300 }}
            >
              <DatePicker
                label="Choose Date"
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(
                    moment(new Date(newDate)).format('MM/DD/YYYY')
                  );
                }}
                renderInput={(selectedDate) => <TextField {...selectedDate} />}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              options={actionOptions}
              sx={{ minWidth: 300 }}
              onChange={(event, newAction) => {
                setSelectedAction(newAction);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Action" />
              )}
            />
            <Autocomplete
              disablePortal
              options={groupOptions}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Self/Group" />
              )}
            />
          </Grid>
        </Grid>
        <Grid item>{renderFormStep()}</Grid>
      </StyledGrid>
    </Grid>
  );
};

export default SelfReportMenu;
