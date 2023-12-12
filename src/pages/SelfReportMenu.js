import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { getAllUngraveyardedActions } from '../graphql/queries';
import { Grid, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import ActionFact from '../components/logAction/ActionFact';
import BonusPointQuiz from '../components/logAction/BonusPointQuiz';
import CO2SavedScreen from '../components/logAction/Co2SavedScreen';
import AllActions from '../components/AllActions';
import { useNavigate } from 'react-router-dom';
import AddActionPanel from '../components/logAction/AddActionPanel';
import ShareOnSocialPanel from '../components/logAction/ShareOnSocialPanel';
import { LogStepHeader } from '../components/LogStepHeader';
import { ActiveStepContext } from '../hooks/use-active-step-context';

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

  const [activeStep, setActiveStep] = useState(0);
  const [actionStyle, setActionStyle] = useState(ActionStyles[0]);
  const [selectedAction, setSelectedAction] = useState();

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
          <AddActionPanel
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            selectedAction={selectedAction}
            setTotalCO2Saved={setTotalCO2Saved}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            skipBonusQuestion={skipBonusQuestion}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            actionStyle={actionStyle}
          />
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
            actionDate={selectedDate}
            totalCO2Saved={totalCO2Saved}
            actionItemValues={actionItemValues}
            selectedImage={selectedImage}
            setValidationSuccess={setValidationSuccess}
          />
        )}
        {activeStep === 3 && (
          <CO2SavedScreen
            totalCO2Saved={totalCO2Saved}
            setActiveStep={setActiveStep}
            skipBonusQuestion={skipBonusQuestion}
            validationSuccess={validationSuccess}
            activeStep={activeStep}
            actionStyle={actionStyle}
          />
        )}
        {activeStep === 4 && (
          <BonusPointQuiz
            quiz={quiz}
            setQuizAnswered={setQuizAnswered}
            setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            actionStyle={actionStyle}
          />
        )}

        {/* To Do: Update submitted action with firstQuizAnswerCorrect and quiz_answered */}
        {activeStep === 5 && (
          <ShareOnSocialPanel
            quizAnswered={quizAnswered}
            firstQuizAnswerCorrect={firstQuizAnswerCorrect}
            userId={user?.user_id}
            quizId={quiz ? quiz.quiz_id : null}
            actionDate={selectedDate}
            totalCO2Saved={totalCO2Saved}
            actionId={selectedAction?.action_id}
            addAnotherAction={resetLogAction}
          />
        )}
      </>
    );
  };

  return (
    <ActiveStepContext.Provider
      value={{ activeStep, actionStyle, selectedAction }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
      >
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
          {renderFormStep()}
        </Grid>
      </Grid>
    </ActiveStepContext.Provider>
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
