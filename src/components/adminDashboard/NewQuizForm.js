import React, { useState } from 'react';
import {
  Alert,
  Box,
  Typography,
  Button,
  TextField,
  FormGroup,
  Chip,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import { createQuiz, createQuizAnswers } from '../../graphql/mutations';
import { API } from 'aws-amplify';
import CheckIcon from '@mui/icons-material/Check';
import { useContentTranslationsContext } from '../contexts/ContentTranslationsContext';
import { updateTranslationWithLangCode } from '../../services/translations';

const NewQuizForm = ({ action_id, getQuizzes }) => {
  const emptyQuizForm = {
    fact_text: '',
    question_text: '',
    quiz_answers: [],
    curr_answer: '',
  };
  const [quizForm, setQuizForm] = useState(JSON.parse(JSON.stringify(emptyQuizForm)));
  const [isLoading, setIsLoading] = useState(false);
  const [submitQuizSuccess, setSubmitQuizSuccess] = useState(false);
  //error states
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);
  const [noCorrectAnswerError, setNoCorrectAnswerError] = useState(false);
  const [duplicateAnswerError, setDuplicateAnswerError] = useState(false);

  //translation states
  const [frenchQuizForm, setFrenchQuizForm] = useState(JSON.parse(JSON.stringify(emptyQuizForm)));
  const [hasAllAnswerTranslationsError, setHasAllAnswerTranslationsError] = useState(false);
  const { contentTranslations, setContentTranslations } = useContentTranslationsContext();

  const updateForm = (e) => {
    setQuizForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateFrenchForm = (e) => {
    setFrenchQuizForm((prev) => ({
      ...prev,
      [e.target.name.replace('_french', '')]: e.target.value,
    }));
  };

  const addAnswer = () => {
    let answersCopy = quizForm.quiz_answers;
    if (quizForm.curr_answer) {
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
    }

    //add to french form
    let frenchAnswersCopy = [...frenchQuizForm.quiz_answers];
    if (frenchQuizForm.curr_answer && frenchAnswersCopy.length < answersCopy.length) {
      // check if is_correct_answer in quizForm
      let isCorrectAnswer = answersCopy[frenchAnswersCopy.length].is_correct_answer;
      const frenchAnswerObj = {
        answer: frenchQuizForm.curr_answer,
        is_correct_answer: isCorrectAnswer,
      };
      frenchAnswersCopy.push(frenchAnswerObj);
      setFrenchQuizForm((prev) => ({ ...prev, quiz_answers: frenchAnswersCopy, curr_answer: '' }));
    }
  };

  const removeAnswer = (label) => {
    let answersCopy = quizForm.quiz_answers;
    const index = answersCopy.indexOf(label);
    answersCopy.splice(index, 1);
    setQuizForm((prev) => ({ ...prev, quiz_answers: answersCopy }));

    //remove from french form
    let frenchAnswersCopy = frenchQuizForm.quiz_answers;
    frenchAnswersCopy.splice(index, 1);
    setFrenchQuizForm((prev) => ({ ...prev, quiz_answers: frenchAnswersCopy }));
  };

  const handleMarkCorrectAnswer = (answerObj) => {
    let correctIndex = undefined;
    let updatedAnswers = quizForm.quiz_answers.map((obj, index) => {
      if (answerObj === obj) {
        correctIndex = index;
        return {
          ...obj,
          is_correct_answer: !obj.is_correct_answer,
        }

      }
      return obj;
    }
    );

    // mark correct answer in french form
    let frenchUpdatedAnswers = frenchQuizForm?.quiz_answers?.map((obj, index) => {
      if (correctIndex === index) {
        return {
          ...obj,
          is_correct_answer: !obj.is_correct_answer,
        }
      }
      return obj;
    });

    setQuizForm((prev) => ({ ...prev, quiz_answers: updatedAnswers }));
    setFrenchQuizForm((prev) => ({ ...prev, quiz_answers: frenchUpdatedAnswers }));
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
        sx={{ mr: '0.5em' }}
      />
    ));
  };

  const renderAddedFrenchAnswers = () => {
    return frenchQuizForm.quiz_answers?.map((answerObj, index) => (
      <Chip
        label={answerObj.answer}
        variant={answerObj.is_correct_answer ? 'filled' : 'outlined'}
        key={index}
        sx={{ mr: '0.5em', mt: { xs: '0.5em', sm: '0em' } }}
      />
    ));
  }

  const checkRequiredFields = () => {
    const { fact_text, question_text, quiz_answers } = quizForm;
    const isAnswerCorrectValues = quiz_answers.map(
      (answerObj) => answerObj.is_correct_answer
    );
    //check to see if any of the answers are duplicates
    const answerValues = quiz_answers.map((answerObj) => answerObj.answer);
    const hasDuplicates = answerValues.length !== new Set(answerValues).size;
    const hasAllAnswerTranslations = frenchQuizForm.quiz_answers?.length === quiz_answers.length;
    if (fact_text === '' || question_text === '') {
      throw new Error('Empty field');
    } else if (quiz_answers.length === 0) {
      throw new Error('No answers');
    } else if (!isAnswerCorrectValues.includes(true)) {
      throw new Error('No correct answer');
    } else if (hasDuplicates) {
      throw new Error('Duplicate answer');
    } else if (!hasAllAnswerTranslations) {
      throw new Error('Missing french answer');
    }
  };

  const updateTranslationsInS3 = async (quiz_id) => {
    const updateFrenchQuizTranslationsJson = async (translationObject) => {
      let relevantAction = translationObject.translationJSON?.actions?.find(action => action.action_id === action_id);
      if (!relevantAction) {
        // init empty action 
        const emptyActionForm = {
          action_id: action_id,
          action_name: '',
          page_media: '',
          fallback_quiz_media: '',
          curr_label: '',
          labels: [],
          action_items: [],
          quizzes: [],
        };
        translationObject.translationJSON?.actions?.push({ ...emptyActionForm });
        relevantAction = translationObject.translationJSON?.actions?.find(action => action.action_id === action_id);
      }
      if (!relevantAction.quizzes) {
        relevantAction.quizzes = [];
      } else {
        // remove existing quiz with same id
        relevantAction.quizzes = relevantAction.quizzes.filter(quiz => quiz.quiz_id === !quiz_id);
      }
      relevantAction.quizzes.push({ ...frenchQuizForm, quiz_id: quiz_id });

      await updateTranslationWithLangCode('fr', translationObject.translationJSON);

      setContentTranslations((prev) => {
        return prev.map((translation) => {
          if (translation.langCode === 'fr') {
            return {
              ...translation,
              translationJSON: translationObject.translationJSON,
            };
          }
          return translation;
        });
      });
    }

    for (const translationObject of contentTranslations) {
      if (translationObject.langCode === 'fr') {
        await updateFrenchQuizTranslationsJson(translationObject);
      }
    }
  }

  const submitQuiz = async () => {
    try {
      checkRequiredFields();
      setIsLoading(true);
      const { fact_text, question_text, quiz_answers } = quizForm;

      const createQuizRes = await API.graphql({
        query: createQuiz,
        variables: {
          action_id: action_id,
          fact_text: fact_text.trim(),
          question_text: question_text.trim(),
        },
      });

      const quizId = createQuizRes.data.createQuiz.quiz_id;

      await API.graphql({
        query: createQuizAnswers,
        variables: {
          quiz_id: quizId,
          answers: quiz_answers,
        },
      });

      // update french quiz
      updateTranslationsInS3(quizId);

      setSubmitQuizSuccess(true);
      //show success message and clear related states
      setIsLoading(false);
      setQuizForm(JSON.parse(JSON.stringify(emptyQuizForm)));
      setFrenchQuizForm(JSON.parse(JSON.stringify(emptyQuizForm)));
      setEmptyFieldError(false);
      setEmptyAnswerError(false);
      setNoCorrectAnswerError(false);
      setDuplicateAnswerError(false);
      getQuizzes();
    } catch (e) {
      if (e) {
        const errorMsg = e.message;
        console.log(e);
        if (errorMsg.includes('Empty field')) {
          setEmptyFieldError(true);
        } else if (errorMsg.includes('No answers')) {
          setEmptyAnswerError(true);
        } else if (errorMsg.includes('No correct answer')) {
          setNoCorrectAnswerError(true);
        } else if (errorMsg.includes('Duplicate answer')) {
          setDuplicateAnswerError(true);
        } else if (errorMsg.includes('Missing french answer')) {
          setHasAllAnswerTranslationsError(true);
        }
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
        <TextField
          name="fact_text_french"
          label="French Fact Text"
          value={frenchQuizForm.fact_text}
          multiline
          InputProps={{
            style: { fontSize: 15, fontWeight: 100, color: 'black' },
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%', mt: '1em' }}
          onChange={updateFrenchForm}
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
        <TextField
          name="question_text_french"
          label="French Question Text"
          value={frenchQuizForm.question_text}
          multiline
          InputProps={{
            style: { fontSize: 15, fontWeight: 100, color: 'black' },
          }}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%', mt: '1em' }}
          onChange={updateFrenchForm}
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
        {frenchQuizForm.quiz_answers?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              my: '1.5em',
              width: { xs: '30%', sm: '80%' },
            }}>
            {renderAddedFrenchAnswers()}
          </Box>
        )}
        <FormGroup
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            mt: '1em',
            gap: '1.5em',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5em', flexGrow: '1' }}>
            <TextField
              required
              name="curr_answer"
              value={quizForm.curr_answer}
              InputProps={{
                style: { fontSize: 15, fontWeight: 100, color: 'black' },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '100%' }}
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
            <TextField
              name="curr_answer_french"
              label="French Answer"
              value={frenchQuizForm.curr_answer}
              InputProps={{
                style: { fontSize: 15, fontWeight: 100, color: 'black' },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '100%' }}
              error={
                hasAllAnswerTranslationsError
              }
              helperText={
                (hasAllAnswerTranslationsError && 'Answers must have a french translation')
              }
              onChange={updateFrenchForm}
            />
          </Box>
          <Button
            variant="outlined"
            onClick={addAnswer}
            disabled={quizForm.curr_answer === '' && frenchQuizForm.curr_answer === ''}
            sx={{
              width: { xs: '100%', md: '17%' },
              mt: { xs: '1.5em', md: '0em' },
              height: 'min-content',
            }}
          >
            Add Answer{' '}
          </Button>
        </FormGroup>
      </Box>
      {isLoading && (
        <LinearProgress
          sx={{ width: '100%', mt: '1.5em' }}
          color="primary"
          variant="indeterminate"
        />
      )}
      <Button
        variant="contained"
        sx={{ my: '2em' }}
        onClick={submitQuiz}
      >
        Submit New Quiz
      </Button>
      <Snackbar
        open={submitQuizSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => setSubmitQuizSuccess(false)}
      >
        <Alert
          onClose={() => setSubmitQuizSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Your quiz has been submitted!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewQuizForm;
