import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import ActionFact from './ActionFact';
import ActionPanel from './ActionPanel';
import { styled } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import BonusPointQuiz from './BonusPointQuiz';
import Co2SavedScreen from './Co2SavedScreen';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: 'black',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 300,
          },
        },
      ],
    },
  },
});

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
  const [totalCo2Saved, setTotalCo2Saved] = useState();

  const handleChangeStep = (stepNumber) => {
    setStepNumber(stepNumber);
  };

  let actionOptions = [
    'Plant Based Meals',
    'Transportation',
    'Reducing Plastic Waste',
  ];

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
            <ActionFact
              fact={fact}
              setFact={setFact}
              changeStep={handleChangeStep}
            />
          )}
          {selectedAction && stepNumber === 2 && (
            <ActionPanel
              selectedAction={selectedAction}
              changeStep={handleChangeStep}
              setTotalCo2Saved={setTotalCo2Saved}
            />
          )}
          {stepNumber === 3 && (
            <BonusPointQuiz fact={fact} changeStep={handleChangeStep} />
          )}
          {stepNumber === 4 && (
            <Co2SavedScreen
              totalCo2Saved={totalCo2Saved}
              changeStep={handleChangeStep}
            />
          )}
        </Grid>
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h1" sx={{ py: 5 }}>
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
                  renderInput={(selectedDate) => (
                    <TextField {...selectedDate} />
                  )}
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
            </Grid>
          </Grid>
          <Grid item>{renderFormStep()}</Grid>
        </StyledGrid>
      </Grid>
    </ThemeProvider>
  );
};

export default SelfReportMenu;
