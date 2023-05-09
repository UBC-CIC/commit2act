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
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { styled } from '@mui/material/styles';

import useTranslation from '../customHooks/translations';

const StyledButton = styled(Button)`
  margin-top: 5em;
  width: 80%;
`;

const BonusPointQuiz = ({
  quiz,
  setActiveStep,
  setQuizAnswered,
  setFirstQuizAnswerCorrect,
  activeStep,
}) => {
  const { question_text, answers, correct_answers } = quiz;
  const answersArray = answers.split('\n');
  const correctAnswersArray = correct_answers.split('\n');

  const [userAnswer, setUserAnswer] = useState();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [numTries, setNumTries] = useState(1);

  const translation = useTranslation();

  const displayQuiz = () => {
    return (
      <>
        <Typography variant="subtitle2">{question_text}</Typography>
        <FormControl>
          <FormLabel id="bonus-quiz-answer-choices">{translation.bonusQuizChoicesLabel}</FormLabel>
          <RadioGroup
            aria-labelledby="bonus-quiz-answer-choices"
            name="quiz-answer-choices-group"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            sx={{ mt: '0.5em', alignSelf: 'center' }}
          >
            {answersArray.map((answer, index) => {
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
        </FormControl>
        {userAnswer ? (
          <StyledButton
            onClick={() => {
              setIsAnswerSelected(true);
              setQuizAnswered(true);
            }}
            variant="contained"
          >
            {translation.bonusQuizSubmit}
          </StyledButton>
        ) : (
          <StyledButton
            onClick={() => {
              setActiveStep(activeStep + 1);
            }}
            variant="outlined"
            color="error"
            sx={{
              width: '80%',
              maxWidth: '300px',
              padding: '1em 1em 1.3em',
              fontSize: '1.2rem',
            }}
          >
            {translation.bonusQuizSkip}
          </StyledButton>
        )}
      </>
    );
  };

  const displayAnswer = () => {
    return (
      <>
        {correctAnswersArray.includes(userAnswer) ? (
          <>
            <Typography variant="h2">{translation.correct}</Typography>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 80, color: '#BCF10C' }} />
            <Typography variant="subtitle1" sx={{ mt: '1.5em' }}>
              {numTries > 1
                ? '0 bonus points will be added to your entry'
                : '10 bonus points will be added to your entry'}
            </Typography>
            <StyledButton
              onClick={() => {
                setFirstQuizAnswerCorrect(true);
                setActiveStep(activeStep + 1);
              }}
              variant="contained"
            >
              {translation.finish}
            </StyledButton>
          </>
        ) : (
          <>
            <Typography variant="h2">{translation.incorrect}</Typography>
            <CancelOutlinedIcon sx={{ fontSize: 80, color: '#BCF10C' }} />
            <StyledButton
              onClick={() => {
                setNumTries(numTries + 1);
                setIsAnswerSelected(false);
              }}
              variant="contained"
            >
              {translation.tryAgain}
            </StyledButton>
          </>
        )}
      </>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {isAnswerSelected ? displayAnswer() : displayQuiz()}
    </Box>
  );
};

export default BonusPointQuiz;
