import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from '@mui/material';

const BonusPointQuiz = ({ fact }) => {
  const { question_text, answers, correct_answer } = fact;

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
        <FormLabel id="demo-controlled-radio-buttons-group">Choices</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="bonus-quiz-answers"
          //   value={value}
          //   onChange={handleChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default BonusPointQuiz;
