import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Typography,
  Grid,
  Button,
  ImageListItemBar,
} from '@mui/material';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';
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
  const [step, setStep] = useState(0);
  const [actionOptions, setActionOptions] = useState();
  const [actionItemValues, setActionItemValues] = useState([]);
  const [totalCo2Saved, setTotalCo2Saved] = useState(0);
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

  //resets the form everytime a new action is selected
  useEffect(() => {
    if (selectedAction) {
      setStep(1);
    } else {
      setStep(0);
    }
  }, [selectedAction]);

  useEffect(() => {
    if (step === 0) {
      setTotalCo2Saved(0);
    }
  }, [step]);

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
                    backgroundColor: 'white',
                    width: '100px',
                    height: '100px',
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

  const renderFormStep = () => {
    return (
      // selectedAction && (
      // <Grid
      //   container
      //   direction="column"
      //   gap="30px"
      //   justifyContent="center"
      //   sx={{
      //     width: 400,
      //     minHeight: '40vh',
      //     backgroundColor: '#e8f4f8',
      //     padding: '50px',
      //   }}
      // >
      <>
        {step === 0 && (
          <>
            <Typography variant="h2" sx={{ pb: '1.5em' }}>
              Select Action
            </Typography>
            {renderActions()}
          </>
        )}
        {step === 1 && (
          <Grid
            item
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h2" sx={{ pb: '1.5em' }}>
              Select Date
            </Typography>
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
                renderInput={(selectedDate) => <TextField {...selectedDate} />}
              />
            </LocalizationProvider>
            <Button
              onClick={() => {
                setStep(2);
              }}
              variant="contained"
            >
              Next
            </Button>
          </Grid>
        )}
        {selectedAction && step === 2 && (
          <ActionFact fact={fact} setFact={setFact} setStep={setStep} />
        )}
        {step === 3 && (
          <ActionPanel
            selectedAction={selectedAction}
            setTotalCo2Saved={setTotalCo2Saved}
            totalCo2Saved={totalCo2Saved}
            actionItemValues={actionItemValues}
            setActionItemValues={setActionItemValues}
            setStep={setStep}
          />
        )}
        {step === 4 && (
          <BonusPointQuiz
            fact={fact}
            setQuizAnswered={setQuizAnswered}
            setFirstQuizAnswerCorrect={setFirstQuizAnswerCorrect}
            setStep={setStep}
          />
        )}
        {step === 5 && (
          <Co2SavedScreen
            actionId={selectedAction.action_id}
            actionDate={selectedDate}
            totalCo2Saved={totalCo2Saved}
            setTotalCo2Saved={setTotalCo2Saved}
            quizAnswered={quizAnswered}
            firstQuizAnswerCorrect={firstQuizAnswerCorrect}
            user={user}
            actionItemValues={actionItemValues}
            setStep={setStep}
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
          Log Action
        </Typography>
        <Grid
          item
          sx={{
            backgroundColor: '#e8f4f8',
            width: { xs: '100%', md: '70%' },
            minHeight: '50vh',
            padding: '2em',
            borderRadius: '7px',
          }}
        >
          {renderFormStep()}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default SelfReportMenu;
