import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import ActionFact from '../components/logAction/ActionFact';
import ActionPanel from '../components/logAction/ActionPanel';
import ImageValidationPanel from '../components/logAction/ImageValidationPanel';
import BonusPointQuiz from '../components/logAction/BonusPointQuiz';
import CO2SavedScreen from '../components/logAction/Co2SavedScreen';
import AllActions from '../components/AllActions';

const SelfReportMenu = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedAction, setSelectedAction] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [actionItemValues, setActionItemValues] = useState([]);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [skipBonusQuestion, setSkipBonusQuestion] = useState(false);
  const [quiz, setQuiz] = useState();
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [firstQuizAnswerCorrect, setFirstQuizAnswerCorrect] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  const steps = [
    'Select Action',
    'Select Date',
    'Action Fact',
    'Action Items',
    'Validation',
    'Bonus Question',
    'CO2 Saved',
  ];

  //resets the form everytime a new action is selected
  useEffect(() => {
    if (selectedAction) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, [selectedAction]);

  useEffect(() => {
    if (activeStep === 0) {
      setTotalCO2Saved(0);
    }
  }, [activeStep]);

  const handleDateChange = (newDate) => {
    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

  const renderFormStep = () => {
    return (
      <>
        {activeStep === 0 && (
          <AllActions setSelectedAction={setSelectedAction} />
        )}
        {activeStep === 1 && (
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
                  label="Choose Date"
                  value={parseISO(selectedDate)}
                  onChange={handleDateChange}
                  renderInput={(selectedDate) => (
                    <TextField {...selectedDate} />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
        )}
        {selectedAction && activeStep === 2 && (
          <ActionFact
            selectedAction={selectedAction}
            user={user}
            quiz={quiz}
            setQuiz={setQuiz}
            setSkipBonusQuestion={setSkipBonusQuestion}
          />
        )}
        {activeStep === 3 && (
          <ActionPanel
            selectedAction={selectedAction}
            setTotalCO2Saved={setTotalCO2Saved}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 4 && (
          <ImageValidationPanel
            skipBonusQuestion={skipBonusQuestion}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}
        {activeStep === 5 && (
          <BonusPointQuiz
            quiz={quiz}
            setQuizAnswered={setQuizAnswered}
            setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
          />
        )}
        {activeStep === 6 && (
          <CO2SavedScreen
            actionId={selectedAction.action_id}
            actionDate={selectedDate}
            totalCO2Saved={totalCO2Saved}
            setTotalCO2Saved={setTotalCO2Saved}
            quiz={quiz}
            quizAnswered={quizAnswered}
            firstQuizAnswerCorrect={firstQuizAnswerCorrect}
            user={user}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            setActiveStep={setActiveStep}
            setSelectedAction={setSelectedAction}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
        )}
      </>
    );
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      flexDirection="column"
    >
      <Typography
        variant="h1"
        sx={{ mt: { xs: '1.5em', md: '0' }, mb: '1.5em' }}
      >
        Log New Action
      </Typography>
      <Grid
        item
        sx={{
          backgroundColor: '#e8f4f8',
          width: { xs: '100%', md: '85%' },
          padding: '2em 2em 5em',
          borderRadius: '7px',
        }}
      >
        {/* display full stepper on screens larger than 900px, otherwise display mobile stepper */}
        <Stepper
          activeStep={activeStep}
          sx={{ mb: '2em', display: { xs: 'none', md: 'flex' } }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <MobileStepper
          variant="dots"
          steps={7}
          position="static"
          activeStep={activeStep}
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            background: 'none',
          }}
        />{' '}
        <Typography
          variant="h2"
          sx={{ m: { xs: '2em 0 2em 0', md: '3.5em 0 2em 0' } }}
        >
          {steps[activeStep]}
        </Typography>
        {renderFormStep()}
        {![0, 3, 4, 5, 6].includes(activeStep) && (
          <Button
            onClick={() => {
              setActiveStep(activeStep + 1);
            }}
            variant="contained"
            sx={{ mt: '5em', width: '80%' }}
          >
            Next
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default SelfReportMenu;
