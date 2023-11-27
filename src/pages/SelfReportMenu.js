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
import ActionButtons from '../components/logAction/ActionButtons';
import ImageValidationPanel from '../components/logAction/ImageValidationPanel';
import BonusPointQuiz from '../components/logAction/BonusPointQuiz';
import CO2SavedScreen from '../components/logAction/Co2SavedScreen';
import AllActions from '../components/AllActions';
import { useNavigate } from 'react-router-dom';

import useTranslation from '../components/customHooks/translations';

const ActionStyles = {
  0: { color: '#ffffff' },
  1: { color: '#8EDAAC' },
  2: { color: '#E661AE' },
  5: { color: '#8CBD5B' },
  3: { color: '#6FDDDD' },
  11: { color: '#F1A660' },
  12: { color: '#FFD467' },
};

const SelfReportMenu = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedAction, setSelectedAction] = useState();
  const [actionStyle, setActionStyle] = useState(ActionStyles[0]);

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
  ];

  const [actionOptions, setActionOptions] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async function () {
      try {
        // fetch all action options
        const res = await API.graphql({ query: getAllUngraveyardedActions });
        const actions = res.data.getAllUngraveyardedActions;
        setActionOptions(() => actions);

        // push path if user input action in url, ie: /log-action/plant-based-eating
        const a = window.location.pathname.split('/');
        const action = a[a.length - 1]
          .trim()
          .toLowerCase()
          .replaceAll(' ', '-');
        if (action === 'log-action') return;

        // if the action is invalid, redirect back to /log-action
        const i = validOption(actions, action);
        if (i === -1) {
          nav('/log-action');
          setSelectedAction(undefined);
        } else {
          nav(`/log-action/${action}`);
          setActiveStep(() => 1);
          setSelectedAction(() => actions[i]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(() => false);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // resets the form everytime a new action is selected
  // handles push path if when user manually selects an action
  useEffect(() => {
    if (selectedAction) {
      setActionStyle(ActionStyles[selectedAction.action_id] || ActionStyles[0]);
      setActiveStep(1);
      const p = selectedAction.action_name
        .trim()
        .toLowerCase()
        .replaceAll(' ', '-');
      nav(`/log-action/${p}`);
    } else {
      setActiveStep(0);
    }
  }, [selectedAction]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (newDate) => {
    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

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
          <>
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                color: actionStyle.color,
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
        )}
        {selectedAction && activeStep === 2 && (
          <ActionFact
            selectedAction={selectedAction}
            actionStyle={actionStyle}
            user={user}
            quiz={quiz}
            setQuiz={setQuiz}
            setSkipBonusQuestion={setSkipBonusQuestion}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 3 && (
          <CO2SavedScreen
            actionId={selectedAction.action_id}
            actionStyle={actionStyle}
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
            activeStep={activeStep}
          />
        )}
        {activeStep === 4 && (
          <BonusPointQuiz
            quiz={quiz}
            setQuizAnswered={setQuizAnswered}
            setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
          />
        )}
        {activeStep === 5 && <div>I dare you to match my action by...</div>}
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
      {activeStep > 0 && selectedAction && (
        <Typography
          variant="h1"
          sx={{
            fontSize: '1.5rem',
            color: actionStyle.color,
            mt: { xs: '1.5em', md: '0' },
            mb: '1.5em',
          }}
        >
          {selectedAction.action_name}
        </Typography>
      )}
      {/* display full stepper on screens larger than 900px, otherwise display mobile stepper */}
      <Stepper
        activeStep={activeStep}
        sx={{ mb: '1em', display: { xs: 'none', md: 'flex' } }}
      >
        {steps.map((step, index) => (
          <Step
            key={index}
            sx={{
              '& .MuiStepLabel-root .MuiStepLabel-iconContainer .Mui-active': {
                color: actionStyle.color, // circle color (ACTIVE)
              },
              '& .MuiStepLabel-root .MuiStepLabel-iconContainer .Mui-completed ':
                {
                  color: actionStyle.color, // circle color (COMPLETED)
                },
            }}
          >
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
          mb: '1em',
          '& .MuiMobileStepper-dotActive': {
            backgroundColor: actionStyle.color,
          },
        }}
      />{' '}
      <Grid
        item
        sx={{
          backgroundColor: 'none',
          width: { xs: '100%', md: '85%' },
          padding: { xs: '1em', md: '2em 2em 5em' },
          borderRadius: '7px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: actionStyle.color,
          '& .Mui-focused, & .Mui-focused .MuiOutlinedInput-notchedOutline': {
            color: actionStyle.color,
            borderColor: actionStyle.color,
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{ m: { xs: '2em 0 2em 0', md: '2em 0 2em 0' } }}
        >
          {steps[activeStep]}
        </Typography>
        {renderFormStep()}
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
