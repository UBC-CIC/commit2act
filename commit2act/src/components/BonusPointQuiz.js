import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h6',
          },
          style: {
            fontSize: 25,
            color: 'black',
          },
        },
      ],
    },
  },
});

const BonusPointQuiz = ({
  fact,
  setStep,
  setQuizAnswered,
  setFirstQuizAnswerCorrect,
}) => {
  // const { question_text, answers, correct_answer } = fact;
  let question_text =
    'What percentage of an average Canadian’s total CO2 production is due to transportation?';
  let answers = ['55%', '20%', '35%', '70%'];
  let correct_answer = '35%';

  const [userAnswer, setUserAnswer] = useState();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [numTries, setNumTries] = useState(1);

  const displayQuiz = () => {
    return (
      <>
        <Typography variant="subtitle1">{question_text}</Typography>
        <FormControl>
          <FormLabel id="bonus-quiz-answer-choices">Answer Choices</FormLabel>
          <RadioGroup
            aria-labelledby="bonus-quiz-answer-choices"
            name="quiz-answer-choices-group"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{ alignItems: 'center' }}
          >
            {answers.map((answer, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={answer}
                  control={<Radio />}
                  label={answer}
                />
              );
            })}
          </RadioGroup>
          {userAnswer ? (
            <Button
              onClick={() => {
                setIsAnswerSelected(true);
                setQuizAnswered(true);
              }}
              variant="contained"
              sx={{ marginY: 5 }}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={() => {
                setStep(5);
              }}
              variant="contained"
              sx={{ marginY: 5 }}
            >
              Skip Quiz
            </Button>
          )}
        </FormControl>
      </>
    );
  };

  const displayAnswer = () => {
    return (
      <>
        {userAnswer === correct_answer ? (
          <>
            <Typography variant="h6">Correct!</Typography>
            <CheckCircle sx={{ fontSize: 80 }} />
            <Typography variant="subtitle1">
              {numTries > 1
                ? '0 bonus points will be added to your entry'
                : '10 bonus points will be added to your entry'}
            </Typography>
            <Button
              onClick={() => {
                setFirstQuizAnswerCorrect(true);
                setStep(5);
              }}
              variant="contained"
            >
              Finish
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">Incorrect!</Typography>
            <Cancel sx={{ fontSize: 80 }} />
            <Button
              onClick={() => {
                setNumTries(numTries + 1);
                setIsAnswerSelected(false);
              }}
              variant="contained"
            >
              Try Again
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2">Bonus Point Question</Typography>
        {isAnswerSelected ? displayAnswer() : displayQuiz()}
      </Box>
    </ThemeProvider>
  );
};

export default BonusPointQuiz;
