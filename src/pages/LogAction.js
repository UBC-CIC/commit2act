import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Box } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import { API } from 'aws-amplify';
import { format } from 'date-fns';
import { getAllUngraveyardedActions } from '../graphql/queries';
import ActionFact from '../components/logAction/ActionFact';
import BonusPointQuiz from '../components/logAction/BonusPointQuiz';
import CO2SavedScreen from '../components/logAction/Co2SavedScreen';
import AllActions from '../components/AllActions';
import AddActionPanel from '../components/logAction/AddActionPanel';
import ShareOnSocialPanel from '../components/logAction/ShareOnSocialPanel';
import { LogStepHeader } from '../components/LogStepHeader';
import { ActiveStepContext } from '../hooks/use-active-step-context';
import useTranslation from '../components/customHooks/translations';
import { ActionDetailsContext } from '../hooks/use-action-details-context';

const ActionStyles = {
  0: { color: '#ffffff' },
  1: { color: '#8EDAAC' },
  2: { color: '#E661AE' },
  5: { color: '#8CBD5B' },
  3: { color: '#6FDDDD' },
  11: { color: '#F1A660' },
  12: { color: '#FFD467' },
};

const LogAction = () => {
  const { actionId } = useParams();
  const t = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [actionStyle, setActionStyle] = useState(ActionStyles[0]);
  const [selectedAction, setSelectedAction] = useState();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [actionItemValues, setActionItemValues] = useState([]);
  const [totalCO2Saved, setTotalCO2Saved] = useState(0);
  const [skipBonusQuestion, setSkipBonusQuestion] = useState(false);
  const [quiz, setQuiz] = useState();
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [firstQuizAnswerCorrect, setFirstQuizAnswerCorrect] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [validationSuccess, setValidationSuccess] = useState(false);

  const nav = useNavigate();

  const resetLogAction = () => {
    setSelectedAction(undefined);
    setActiveStep(0);
  };

  const [actionOptions, setActionOptions] = useState([]);
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
  useEffect(() => {
    (async function () {
      try {
        // fetch all action options
        const res = await API.graphql({ query: getAllUngraveyardedActions });
        const actions = res.data.getAllUngraveyardedActions;
        setActionOptions(actions);

        // push path if user input action in url, ie: /log-action/plant-based-eating
        if (actionId === 'log-action' || actionId === '') return;

        // if the action is invalid, redirect back to /log-action
        const i = validOption(actions, actionId);
        if (i === -1) {
          nav('/log-action');
          setSelectedAction();
        } else {
          nav(`/log-action/${actionId}`);
          setActiveStep(1);
          setSelectedAction(actions[i]);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // resets the form everytime a new action is selected
  // handles push path if when user manually selects an action
  useEffect(() => {
    if (selectedAction) {
      setActionStyle(ActionStyles[selectedAction.action_id] || ActionStyles[0]);
      setActiveStep(1);
      nav(`/log-action/${actionId}`);
    } else {
      setActiveStep(0);
    }
  }, [selectedAction]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (newDate) => {
    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

  useEffect(() => {
    if (!actionId) resetLogAction();
  }, [actionId]);

  return (
    <ActiveStepContext.Provider
      value={{
        activeStep,
        actionStyle,
        selectedAction,
        setActiveStep,
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
        paddingBottom="3rem"
      >
        <Box
          display="flex"
          justifyContent="flex-start"
          margin="-0.75em 0 0.5em"
          width="100%"
        >
          {activeStep === 1 && (
            <Typography
              component={Link}
              to="/log-action"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              fontSize={{ xs: '0.775em' }}
              marginLeft="-0.75em"
              gap="0.25em"
            >
              <ChevronLeft alt="" />
              <Box component="span">{t.back}</Box>
            </Typography>
          )}
        </Box>
        <LogStepHeader />
        <Grid
          item
          sx={{
            backgroundColor: 'none',
            '& .Mui-focused, & .Mui-focused .MuiOutlinedInput-notchedOutline': {
              color: actionStyle.color,
              borderColor: actionStyle.color,
            },
          }}
        >
          <ActionDetailsContext.Provider
            value={{
              selectedDate,
              actionItemValues,
              totalCO2Saved,
              skipBonusQuestion,
              quiz,
              quizAnswered,
              firstQuizAnswerCorrect,
              selectedImage,
              validationSuccess,
            }}
          >
            {activeStep === 0 && (
              <AllActions setSelectedAction={setSelectedAction} />
            )}
            {activeStep === 1 && (
              <AddActionPanel
                handleDateChange={handleDateChange}
                setTotalCO2Saved={setTotalCO2Saved}
                setActionItemValues={setActionItemValues}
                setSelectedImage={setSelectedImage}
              />
            )}
            {selectedAction && activeStep === 2 && (
              <ActionFact
                setQuiz={setQuiz}
                setSkipBonusQuestion={setSkipBonusQuestion}
                setValidationSuccess={setValidationSuccess}
              />
            )}
            {activeStep === 3 && <CO2SavedScreen />}
            {activeStep === 4 && (
              <BonusPointQuiz
                setQuizAnswered={setQuizAnswered}
                setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
              />
            )}
            {activeStep === 5 && (
              <ShareOnSocialPanel addAnotherAction={resetLogAction} />
            )}
          </ActionDetailsContext.Provider>
        </Grid>
      </Grid>
    </ActiveStepContext.Provider>
  );
};

export default LogAction;

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
