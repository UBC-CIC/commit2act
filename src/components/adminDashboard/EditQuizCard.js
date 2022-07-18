import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  FormGroup,
  Alert,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {
  deleteQuiz,
  updateQuiz,
  remakeQuizAnswers,
} from '../../graphql/mutations';
import { API } from 'aws-amplify';

const EditQuizCard = ({ quiz, getQuizzes }) => {
  const { fact_text, question_text, answers, correct_answers } = quiz;
  const [quizForm, setQuizForm] = useState();
  const [updateQuizSuccess, setUpdateQuizSuccess] = useState(false);
  const [deleteQuizSuccess, setDeleteQuizSuccess] = useState(false);
  //error states
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);
  const [noCorrectAnswerError, setNoCorrectAnswerError] = useState(false);
  const [duplicateAnswerError, setDuplicateAnswerError] = useState(false);

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
    //check to see if any of the answers are duplicates
    const answerValues = quiz_answers.map((answerObj) => answerObj.answer);
    const hasDuplicates = answerValues.length !== new Set(answerValues).size;
    if (fact_text === '' || question_text === '') {
      throw new Error('Empty field');
    } else if (quiz_answers.length === 0) {
      throw new Error('No answers');
    } else if (!isAnswerCorrectValues.includes(true)) {
      throw new Error('No correct answer');
    } else if (hasDuplicates) {
      throw new Error('Duplicate answer');
    }
  };

  const saveQuiz = async () => {
    try {
      checkRequiredFields();
      const { fact_text, question_text, quiz_answers } = quizForm;

      await API.graphql({
        query: updateQuiz,
        variables: {
          quiz_id: quiz.quiz_id,
          fact_text: fact_text,
          question_text: question_text,
        },
      });
      await API.graphql({
        query: remakeQuizAnswers,
        variables: {
          quiz_id: quiz.quiz_id,
          answers: quiz_answers,
        },
      });
      setUpdateQuizSuccess(true);
      //show success message and clear related states
      setEmptyFieldError(false);
      setEmptyAnswerError(false);
      setNoCorrectAnswerError(false);
      setDuplicateAnswerError(false);
      getQuizzes();
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Empty field')) {
        setEmptyFieldError(true);
      } else if (errorMsg.includes('No answers')) {
        setEmptyAnswerError(true);
      } else if (errorMsg.includes('No correct answer')) {
        setNoCorrectAnswerError(true);
      } else if (errorMsg.includes('Duplicate answer')) {
        setDuplicateAnswerError(true);
      }
    }
  };

  const deleteCurrentQuiz = async () => {
    await API.graphql({
      query: deleteQuiz,
      variables: { quiz_id: quiz.quiz_id },
    });
    setDeleteQuizSuccess(true);
    getQuizzes();
  };

  return quizForm ? (
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
            error={
              emptyAnswerError || noCorrectAnswerError || duplicateAnswerError
            }
            helperText={
              (emptyAnswerError && 'At least 1 possible answer is required') ||
              (noCorrectAnswerError && 'Please mark an answer as correct') ||
              (duplicateAnswerError && 'No duplicate answers are allowed')
            }
            onChange={updateForm}
          />
          <Button
            variant="outlined"
            onClick={addAnswer}
            disabled={quizForm.curr_answer === ''}
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
        <Button onClick={deleteCurrentQuiz}>Delete</Button>
        <Button onClick={saveQuiz}>Save</Button>
      </Box>
      <Snackbar
        open={updateQuizSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => setUpdateQuizSuccess(false)}
      >
        <Alert
          onClose={() => setUpdateQuizSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Quiz has been updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteQuizSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => setDeleteQuizSuccess(false)}
      >
        <Alert
          onClose={() => setDeleteQuizSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Quiz has been deleted!
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <LinearProgress
      sx={{ width: '100%', mt: '1.5em' }}
      color="primary"
      variant="indeterminate"
    />
  );
};

export default EditQuizCard;
