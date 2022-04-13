import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  ImageListItemBar,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
} from '@mui/material';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import ActionFact from './ActionFact';
import ActionPanel from './ActionPanel';
import { createTheme, ThemeProvider } from '@mui/material';
import BonusPointQuiz from './BonusPointQuiz';
import Co2SavedScreen from './Co2SavedScreen';
import { API } from 'aws-amplify';
import { getAllActions } from '../graphql/queries';
import { styled } from '@mui/material/styles';

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

const StyledImageListItemBar = styled(ImageListItemBar)`
  .MuiImageListItemBar-title {
    overflow: visible;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 0.9rem;
  }
`;

const StyledImageListItem = styled(ImageListItem)`
  .MuiImageListItem-img {
    border-radius: 7px;
    height: 100px;
  }
`;

const SelfReportMenu = ({ user }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedAction, setSelectedAction] = useState();
  const [fact, setFact] = useState();
  // const [step, setStep] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [actionOptions, setActionOptions] = useState();
  const [actionItemValues, setActionItemValues] = useState([]);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [firstQuizAnswerCorrect, setFirstQuizAnswerCorrect] = useState(false);

  const steps = [
    'Select Action',
    'Select Date',
    'Action Fact',
    'Action Items',
    'Bonus Question',
    'CO2 Saved',
  ];

  useEffect(() => {
    getActions();
  }, []);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllActions });
    const actions = res.data.getAllActions;
    setActionOptions(actions);
  };

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
      setTotalCo2Saved(0);
    }
  }, [activeStep]);

  const renderActions = () => {
    return (
      actionOptions && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            rowGap: 2,
            [`& .${imageListItemClasses.root}`]: {
              display: 'flex',
              flexDirection: 'column',
            },
            justifyItems: 'center',
          }}
        >
          {actionOptions.map((action, index) => (
            <StyledImageListItem
              key={index}
              sx={{
                width: '100px',
                height: '100px',
                cursor: 'pointer',
                '&:hover': {
                  opacity: '0.7',
                },
              }}
              onClick={() => setSelectedAction(action)}
            >
              {action.action_icon ? (
                <img
                  src={`${action.action_icon}?w=248&fit=crop&auto=format`}
                  alt={action.action_name}
                  loading="lazy"
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#B4EEB4	',
                    width: '100px',
                    height: '100px',
                    borderRadius: '7px',
                  }}
                ></Box>
              )}
              <StyledImageListItemBar
                title={action.action_name}
                position="below"
              />
            </StyledImageListItem>
          ))}
        </Box>
      )
    );
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(format(new Date(newDate), 'yyyy-MM-dd'));
  };

  const renderFormStep = () => {
    return (
      <>
        {activeStep === 0 && (
          <Grid
            item
            sx={{
              height: '50vh',
              overflow: 'auto',
            }}
          >
            {renderActions()}
          </Grid>
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
            fact={fact}
            setFact={setFact}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 3 && (
          <ActionPanel
            selectedAction={selectedAction}
            setTotalCo2Saved={setTotalCo2Saved}
            totalCo2Saved={totalCo2Saved}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 4 && (
          <BonusPointQuiz
            fact={fact}
            setQuizAnswered={setQuizAnswered}
            setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            setActiveStep={setActiveStep}
          />
        )}
        {activeStep === 5 && (
          <Co2SavedScreen
            actionId={selectedAction.action_id}
            actionDate={selectedDate}
            totalCo2Saved={totalCo2Saved}
            setTotalCo2Saved={setTotalCo2Saved}
            quizAnswered={quizAnswered}
            firstQuizAnswerCorrect={firstQuizAnswerCorrect}
            user={user}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            setActiveStep={setActiveStep}
            setSelectedAction={setSelectedAction}
          />
        )}
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
      >
        <Typography variant="h1" sx={{ py: 5 }}>
          Log New Action
        </Typography>
        <Grid
          item
          sx={{
            backgroundColor: '#e8f4f8',
            width: { xs: '100%', md: '80%' },
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
            steps={6}
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
            sx={{ m: { xs: '2em 0 2em 0', md: '3.5em 0 3em 0' } }}
          >
            {steps[activeStep]}
          </Typography>
          {renderFormStep()}
          {![0, 4, 5].includes(activeStep) && (
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
    </ThemeProvider>
  );
};

export default SelfReportMenu;
