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

const BonusPointQuiz = ({ fact, changeStep }) => {
  const { question_text, answers, correct_answer } = fact;

  const [userAnswer, setUserAnswer] = useState();
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5">Bonus Point Quiz</Typography>
      <Typography variant="h6">{question_text}</Typography>
      <FormControl>
        <FormLabel id="bonus-quiz-answer-choices">Answer Choices</FormLabel>
        <RadioGroup
          aria-labelledby="bonus-quiz-answer-choices"
          name="quiz-answer-choices-group"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
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
        <Button
          onClick={() => {
            setIsAnswerSelected(true);
          }}
          variant="contained"
        >
          Submit Answer
        </Button>
      </FormControl>
    </Box>
  );
};

export default BonusPointQuiz;
