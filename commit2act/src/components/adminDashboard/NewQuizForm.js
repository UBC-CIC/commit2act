import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  Chip,
} from '@mui/material';

const NewQuizForm = () => {
  const emptyQuizForm = {
    fact_text: '',
    question_text: '',
    quiz_answers: [],
    correct_answer: '',
    curr_answer: '',
  };
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);

  const updateForm = (e) => {
    setQuizForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addAnswer = () => {
    let answersCopy = quizForm.quiz_answers;
    answersCopy.push(quizForm.curr_answer);
    setQuizForm((prev) => ({ ...prev, quiz_answers: answersCopy }));
    if (answersCopy.length > 0) {
      setEmptyAnswerError(false);
    }
    //clear current label
    setQuizForm((prev) => ({ ...prev, curr_answer: '' }));
  };

  const removeAnswer = (label) => {
    let answersCopy = quizForm.quiz_answers;
    const index = answersCopy.indexOf(label);
    answersCopy.splice(index, 1);
    setQuizForm((prev) => ({ ...prev, quiz_answers: answersCopy }));
  };

  const renderAddedAnswers = () => {
    return quizForm.quiz_answers.map((answer, index) => (
      <Chip
        label={answer}
        variant="outlined"
        key={index}
        onDelete={() => removeAnswer(answer)}
        sx={{ mr: '0.5em' }}
      />
    ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
      }}
    >
      <Box>
        <Typography variant="h8">Fact Text</Typography>
        <TextField
          required
          name="fact_text"
          value={quizForm.fact_text}
          multiline
          InputProps={{
            style: { fontSize: 15, fontWeight: 100, color: 'black' },
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%', mt: '1em' }}
        />
      </Box>
      <Box>
        <Typography variant="h8">Question Text</Typography>
        <TextField
          required
          name="question_text"
          value={quizForm.question_text}
          multiline
          InputProps={{
            style: { fontSize: 15, fontWeight: 100, color: 'black' },
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%', mt: '1em' }}
        />
      </Box>
      <Box>
        <Typography variant="h8">Possible Answers</Typography>

        {quizForm.quiz_answers.length !== 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              my: '1.5em',
              width: { xs: '30%', sm: '80%' },
            }}
          >
            {renderAddedAnswers()}
          </Box>
        )}
        <FormGroup
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            mt: '1em',
          }}
        >
          <TextField
            required
            name="curr_answer"
            value={quizForm.curr_answer}
            InputProps={{
              style: { fontSize: 15, fontWeight: 100, color: 'black' },
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '100%', md: '80%' } }}
            onChange={updateForm}
          />
          <Button
            variant="outlined"
            onClick={addAnswer}
            sx={{ width: { xs: '100%', md: '17%' } }}
          >
            Add Answer{' '}
          </Button>
        </FormGroup>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mt: '1.5em',
        }}
      >
        <Button>Cancel</Button>
        <Button>Save</Button>
      </Box>
    </Box>
  );
};

export default NewQuizForm;
