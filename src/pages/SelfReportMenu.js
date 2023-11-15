import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { getAllUngraveyardedActions } from '../graphql/queries';
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
  CircularProgress,
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
import { useNavigate } from 'react-router-dom';

import useTranslation from '../components/customHooks/translations';

const SelfReportMenu = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
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
  const translation = useTranslation();
  const nav = useNavigate();

  const steps = [
    translation.logActionStep1,
    translation.logActionStep2,
    translation.logActionStep3,
    translation.logActionStep4,
    translation.logActionStep5,
    translation.logActionStep6,
    translation.logActionStep7,
  ];

  const [actionOptions, setActionOptions] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async function () {
      try {
        // fetch all options
        const res = await API.graphql({ query: getAllUngraveyardedActions });
        const actions = res.data.getAllUngraveyardedActions;
        setActionOptions(() => actions);

        // push path if user enter action in url, ie: /log-action/plant-based-eating
        const a = window.location.pathname.split('/');
        const action = a[a.length - 1]
          .trim()
          .toLowerCase()
          .replaceAll(' ', '-');
        if (action === 'log-action') return;
        const i = validOption(actions, action);
        if (i === -1) {
          nav('/log-action');
          setSelectedAction(undefined);
        } else {
          nav(`/log-action/${action}`);
          setActiveStep(() => 1);
          setSelectedAction(() => actionOptions[i]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(() => false);
      }
    })();
  }, [setActionOptions]);

  // resets the form everytime a new action is selected
  // handles push path
  useEffect(() => {
    if (selectedAction) {
      setActiveStep(1);
      const p = selectedAction.action_name
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-');
      nav(`/log-action/${p}`);
    } else {
      setActiveStep(0);
    }
  }, [selectedAction]);

  const handleDateChange = (newDate) => {
    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

  const renderFormStep = () => {
    return (
      <>
        {loading ? <CircularProgress /> : <></>}
        {activeStep === 0 && (
          <AllActions
            setSelectedAction={setSelectedAction}
            actionOptions={actionOptions}
          />
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
                  label={translation.chooseDate}
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
        {translation.logActionTitle}
      </Typography>
      <Grid
        item
        sx={{
          backgroundColor: '#303839',
          width: { xs: '100%', md: '85%' },
          padding: { xs: '1em', md: '2em 2em 5em' },
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
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            m: '0 0 1.25em',
            flexDirection: { xs: 'row' },
            gap: { xs: '10px', md: '10px' },
          }}
        >
          {![0, 3, 5, 6].includes(activeStep) && (
            <Button
              onClick={() => {
                setActiveStep((s) => {
                  if (s - 1 === 0) {
                    nav('/log-action');
                  }
                  return s - 1;
                });
              }}
              variant="contained"
              sx={{
                padding: '1em 1em 1em',
                fontSize: '1.2rem',
                marginTop: '1em',
                minWidth: '50%',
              }}
            >
              {translation.previous}
            </Button>
          )}
          {![0, 3, 5, 6].includes(activeStep) && (
            <Button
              onClick={() => {
                if (activeStep === 4 && skipBonusQuestion) {
                  setActiveStep(activeStep + 2);
                } else {
                  setActiveStep(activeStep + 1);
                }
              }}
              variant="contained"
              sx={{
                padding: '1em 1em 1em',
                fontSize: '1.2rem',
                marginTop: '1em',
                minWidth: '50%',
              }}
            >
              {translation.next}
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SelfReportMenu;

/**
 * @param {any[]} actionOptions
 * @param {string} action
 * @returns {number} index - action index
 */
function validOption(actionOptions, action) {
  for (let i = 0; i < actionOptions.length; i++) {
    const a = actionOptions[i];
    /** @type {string} */
    let name = a.action_name;
    name = name.toLowerCase().trim().replaceAll(' ', '-');
    if (name === action) {
      return i;
    }
  }
  return -1;
}
