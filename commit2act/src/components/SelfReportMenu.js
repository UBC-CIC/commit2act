import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';
import ActionFact from './ActionFact';
import ActionPanel from './ActionPanel';
import { styled } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import BonusPointQuiz from './BonusPointQuiz';
import Co2SavedScreen from './Co2SavedScreen';
import { API } from 'aws-amplify';
import { getAllActions } from '../graphql/queries';

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

const SelfReportMenu = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedAction, setSelectedAction] = useState();
  const [fact, setFact] = useState();
  const [stepNumber, setStepNumber] = useState(0);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
  const [actionOptions, setActionOptions] = useState();
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [firstQuizAnswerCorrect, setFirstQuizAnswerCorrect] = useState(false);

  useEffect(() => {
    getActions();
  }, []);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllActions });
    const actions = res.data.getAllActions;
    setActionOptions(actions);
  };

  const handleChangeStep = (stepNumber) => {
    setStepNumber(stepNumber);
  };

  //resets the form everytime a new action is selected
  useEffect(() => {
    if (selectedAction) {
      setStepNumber(1);
    } else {
      setStepNumber(0);
    }
  }, [selectedAction]);

  useEffect(() => {
    if (stepNumber === 1) {
      setTotalCo2Saved(0);
    }
  }, [stepNumber]);

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
            minHeight: '40vh',
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
              totalCo2Saved={totalCo2Saved}
            />
          )}
          {stepNumber === 3 && (
            <BonusPointQuiz
              fact={fact}
              changeStep={handleChangeStep}
              setQuizAnswered={setQuizAnswered}
              setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            />
          )}
          {stepNumber === 4 && (
            <Co2SavedScreen
              actionId={selectedAction.action_id}
              actionDate={selectedDate}
              totalCo2Saved={totalCo2Saved}
              setTotalCo2Saved={setTotalCo2Saved}
              quizAnswered={quizAnswered}
              firstQuizAnswerCorrect={firstQuizAnswerCorrect}
              user={user}
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
          Log Action
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
                    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
                  }}
                  renderInput={(selectedDate) => (
                    <TextField {...selectedDate} />
                  )}
                />
              </LocalizationProvider>
              <Autocomplete
                disablePortal
                options={actionOptions}
                getOptionLabel={(option) => option.action_name}
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
