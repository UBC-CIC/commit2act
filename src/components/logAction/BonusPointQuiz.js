import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import ActionButtons from './ActionButtons';
import useTranslation from '../customHooks/translations';
import { useActiveStepContext } from '../../hooks/use-active-step-context';
import { useActionDetailsContext } from '../../hooks/use-action-details-context';
import { PropTypes } from 'prop-types';

const BonusPointQuiz = ({ setQuizAnswered }) => {
  const { activeStep, setActiveStep } = useActiveStepContext();
  const { quiz } = useActionDetailsContext();
  const answers = quiz?.answers;
  const correctAnswers = quiz?.correct_answers;
  const answersArray = answers ? answers.split('\n') : [];
  const correctAnswersArray = correctAnswers ? correctAnswers.split('\n') : [];

  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [numTries, setNumTries] = useState(1);

  const translation = useTranslation();
  const answeredCorrectly = correctAnswersArray.includes(userAnswer);

  const displayQuiz = () => {
    return (
      <>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '1em',
            color: '#34b198',
            fontWeight: 'bold',
          }}
        >
          {translation.extraPoints}
        </Typography>
        <Typography variant="h3">{quiz?.question_text}</Typography>
        <FormControl>
          <>
            <RadioGroup
              aria-labelledby="bonus-quiz-answer-choices"
              name="quiz-answer-choices-group"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setIsAnswerSelected(true);
              }}
              sx={{
                mt: '0.5em',
                alignSelf: 'center',
              }}
            >
              {answersArray.map((answer, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={answer}
                    label={answer}
                    disabled={isAnswerSelected}
                    sx={{
                      '& .Mui-checked': {
                        color: `${
                          answeredCorrectly ? '#34b198' : 'red'
                        } !important`,
                      },
                    }}
                    control={
                      <Radio
                        inputProps={{
                          'aria-label': { answer },
                        }}
                      />
                    }
                  />
                );
              })}
            </RadioGroup>
          </>
        </FormControl>
        {userAnswer ? displayAnswer() : null}
      </>
    );
  };

  const displayAnswer = () => {
    return (
      <>
        {answeredCorrectly ? (
          <>
            <Typography>
              <span style={{ color: '#34b198', fontWeight: 'bold' }}>
                {translation.correct}{' '}
              </span>
              {numTries > 1
                ? '0 bonus points will be added to your entry.'
                : '10 bonus points will be added to your entry.'}
            </Typography>
          </>
        ) : (
          <>
            <Typography>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                {translation.incorrect}{' '}
              </span>
              Try again to still earn some more points.
            </Typography>
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
        alignItems: 'start',
        textAlign: 'start',
      }}
    >
      {displayQuiz()}
      <ActionButtons
        forwardOnClick={() => {
          if (answeredCorrectly || numTries > 1) {
            setActiveStep(activeStep + 1);
          } else {
            setIsAnswerSelected(false);
            setQuizAnswered(true);
            setNumTries(numTries + 1);
          }
        }}
        backOnClick={() => setActiveStep(activeStep + 1)}
        backText={translation.continue}
        forwardText={
          translation[
            answeredCorrectly || !userAnswer || numTries > 1
              ? 'bonusQuizSubmit'
              : 'tryAgain'
          ]
        }
      />
    </Box>
  );
};

BonusPointQuiz.propTypes = {
  setQuizAnswered: PropTypes.func,
};

export default BonusPointQuiz;
