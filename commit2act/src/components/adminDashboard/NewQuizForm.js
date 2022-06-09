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
  //error states
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);
  const [noCorrectAnswerError, setNoCorrectAnswerError] = useState(false);

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

  const checkRequiredFields = () => {
    const { fact_text, question_text, quiz_answers, correct_answer } = quizForm;
    if (fact_text || question_text === '') {
      throw new Error('Empty field');
    } else if (quiz_answers.length === 0) {
      throw new Error('No answers');
    } else if (!correct_answer) {
      throw new Error('No correct answer');
    }
  };

  const submitQuiz = async () => {
    try {
      checkRequiredFields();
      const {
        fact_text,
        question_text,
        quiz_answers,
        correct_answer,
        curr_answer,
      } = quizForm;
      //mutation goes here

      //show success message and clear related states
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Empty field')) {
        setEmptyFieldError(true);
      } else if (errorMsg.includes('No answers')) {
        setEmptyAnswerError(true);
      } else if (errorMsg.includes('No correct answer')) {
        setNoCorrectAnswerError(true);
      }
    }
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
        <Typography variant="h3">Fact Text</Typography>
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
        <Typography variant="h3">Question Text</Typography>
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
        <Typography variant="h3">Possible Answers</Typography>

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
        <Button onClick={submitQuiz}>Save</Button>
      </Box>
    </Box>
  );
};

export default NewQuizForm;
