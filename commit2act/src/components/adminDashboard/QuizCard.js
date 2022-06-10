import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Chip,
  Button,
  TextField,
  FormGroup,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

const QuizCard = ({ quiz }) => {
  const { fact_text, question_text, answers, correct_answers } = quiz;

  // const initialQuizCardForm = {
  //   fact_text: fact_text,
  //   question_text: question_text,
  //   quiz_answers: answerObjArray,
  //   curr_answer: '',
  // };
  const [editQuiz, setEditQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [updateQuizSuccess, setUpdateQuizSuccess] = useState(false);
  //error states
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);
  const [noCorrectAnswerError, setNoCorrectAnswerError] = useState(false);

  useEffect(() => {
    const answerArray = answers.split('\n');
    const correctAnswerArray = correct_answers.split('\n');
    let answerObjArray = [];
    answerArray.map((answer) =>
      answerObjArray.push({
        answer: answer,
        is_correct_answer: correctAnswerArray.includes(answer),
      })
    );
    setQuizForm({
      fact_text: fact_text,
      question_text: question_text,
      quiz_answers: answerObjArray,
      curr_answer: '',
    });
  }, [quiz]);

  const renderViewQuizCard = () => {
    return (
      quiz && (
        <Box
          sx={{ display: 'flex', flexDirection: 'column' }}
          component={Paper}
        >
          <IconButton
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setEditQuiz(true)}
          >
            <EditIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1em',
              p: '2em',
            }}
          >
            <Box>
              <Typography variant="h3">Fact Text</Typography>
              <Typography sx={{ mt: '1em' }}>{fact_text}</Typography>
            </Box>
            <Box>
              <Typography variant="h3">Question Text</Typography>
              <Typography sx={{ mt: '1em' }}>{question_text}</Typography>
            </Box>
            <Box>
              <Typography variant="h3">Possible Answers</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  my: '1.5em',
                  gap: '0.5em',
                }}
              >
                {answers
                  .split('\n')
                  .map((answer) =>
                    correct_answers.split('\n').includes(answer) ? (
                      <Chip key={answer} icon={<CheckIcon />} label={answer} />
                    ) : (
                      <Chip key={answer} label={answer} variant="outlined" />
                    )
                  )}
              </Box>
            </Box>
          </Box>
        </Box>
      )
    );
  };

  /** functions for rendering the editable quiz card */

  const updateForm = (e) => {
    setQuizForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addAnswer = () => {
    let answersCopy = quizForm.quiz_answers;
    const answerObj = {
      answer: quizForm.curr_answer,
      is_correct_answer: false,
    };
    answersCopy.push(answerObj);
    setQuizForm((prev) => ({ ...prev, quiz_answers: answersCopy }));
    if (answersCopy.length > 0) {
      setEmptyAnswerError(false);
    }
    setQuizForm((prev) => ({ ...prev, curr_answer: '' }));
  };

  const removeAnswer = (label) => {
    let answersCopy = quizForm.quiz_answers;
    const index = answersCopy.indexOf(label);
    answersCopy.splice(index, 1);
    setQuizForm((prev) => ({ ...prev, quiz_answers: answersCopy }));
  };

  const handleMarkCorrectAnswer = (answerObj) => {
    let updatedAnswers = quizForm.quiz_answers.map((obj) =>
      answerObj === obj
        ? {
            ...obj,
            is_correct_answer: !obj.is_correct_answer,
          }
        : obj
    );
    setQuizForm((prev) => ({ ...prev, quiz_answers: updatedAnswers }));
    setNoCorrectAnswerError(false);
  };

  const renderAddedAnswers = () => {
    return quizForm.quiz_answers.map((answerObj, index) => (
      <Chip
        label={answerObj.answer}
        variant={answerObj.is_correct_answer ? 'filled' : 'outlined'}
        key={index}
        icon={
          <CheckIcon
            onClick={() => handleMarkCorrectAnswer(answerObj)}
            sx={{
              '&:hover': {
                cursor: 'pointer',
                opacity: 0.5,
              },
            }}
          />
        }
        onDelete={() => removeAnswer(answerObj)}
        sx={{ mr: '0.5em', mt: { xs: '0.5em', sm: '0em' } }}
      />
    ));
  };

  const checkRequiredFields = () => {
    const { fact_text, question_text, quiz_answers } = quizForm;
    const isAnswerCorrectValues = quiz_answers.map(
      (answerObj) => answerObj.is_correct_answer
    );
    if (fact_text === '' || question_text === '') {
      throw new Error('Empty field');
    } else if (quiz_answers.length === 0) {
      throw new Error('No answers');
    } else if (!isAnswerCorrectValues.includes(true)) {
      throw new Error('No correct answer');
    }
  };

  const updateQuiz = async () => {
    try {
      checkRequiredFields();
      setIsLoading(true);
      const { fact_text, question_text, quiz_answers } = quizForm;

      setUpdateQuizSuccess(true);
      //show success message and clear related states
      setIsLoading(false);
      setEmptyFieldError(false);
      setEmptyAnswerError(false);
      setNoCorrectAnswerError(false);
    } catch (e) {
      const errorMsg = e.message;
      console.log(e);
      if (errorMsg.includes('Empty field')) {
        setEmptyFieldError(true);
      } else if (errorMsg.includes('No answers')) {
        setEmptyAnswerError(true);
      } else if (errorMsg.includes('No correct answer')) {
        setNoCorrectAnswerError(true);
      }
    }
  };

  const renderEditQuizCard = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }} component={Paper}>
        <IconButton
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => setEditQuiz(false)}
        >
          <EditIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            p: '2em',
          }}
        >
          <Box>
            {emptyFieldError && (
              <Alert severity="error" sx={{ my: '2em' }}>
                Please fill out all required fields
              </Alert>
            )}
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
              onChange={updateForm}
              error={emptyFieldError}
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
              onChange={updateForm}
              error={emptyFieldError}
            />
          </Box>
          <Box>
            <Typography variant="h3">Possible Answers</Typography>
            {quizForm.quiz_answers.length > 0 && (
              <Typography variant="subtitle1" sx={{ mt: '1em' }}>
                Select the correct answers by clicking the checkmark icon
              </Typography>
            )}
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
                sx={{ width: { xs: '100%', md: '75%' } }}
                error={emptyAnswerError || noCorrectAnswerError}
                helperText={
                  (emptyAnswerError &&
                    'At least 1 possible answer is required') ||
                  (noCorrectAnswerError && 'Please mark an answer as correct')
                }
                onChange={updateForm}
              />
              <Button
                variant="outlined"
                onClick={addAnswer}
                sx={{
                  width: { xs: '100%', md: '20%' },
                  mt: { xs: '1.5em', md: '0em' },
                  height: 'min-content',
                }}
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
            <Button>Delete</Button>
            <Button onClick={updateQuiz}>Save</Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return editQuiz ? renderEditQuizCard() : renderViewQuizCard();
};

export default QuizCard;
