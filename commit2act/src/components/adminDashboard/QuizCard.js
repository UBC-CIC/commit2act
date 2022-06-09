import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Chip,
  Button,
  TextField,
  FormGroup,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const QuizCard = ({ question, quizAnswers }) => {
  const initialQuizCardForm = {
    fact_text: question.fact_text,
    question_text: question.question_text,
    quiz_answers: quizAnswers.answers,
    correct_answer: quizAnswers.answer,
    curr_answer: '',
  };
  const [editQuiz, setEditQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState(initialQuizCardForm);
  //error states
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [emptyAnswerError, setEmptyAnswerError] = useState(false);
  const [noCorrectAnswerError, setNoCorrectAnswerError] = useState(false);

  const renderViewQuizCard = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }} component={Paper}>
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
            <Typography sx={{ mt: '1em' }}>{question.fact_text}</Typography>
          </Box>
          <Box>
            <Typography variant="h3">Question Text</Typography>
            <Typography sx={{ mt: '1em' }}>{question.question_text}</Typography>
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
              {quizAnswers.answers.map((answer) =>
                answer === quizAnswers.answer ? (
                  <Chip key={answer} icon={<CheckIcon />} label={answer} />
                ) : (
                  <Chip key={answer} label={answer} variant="outlined" />
                )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const removeAnswerOption = (answer) => {};

  const renderEditQuizCard = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }} component={Paper}>
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
            <TextField
              required
              name="fact_text"
              value={initialQuizCardForm.fact_text}
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
              value={initialQuizCardForm.question_text}
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
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                my: '1.5em',
                gap: '0.5em',
              }}
            >
              {initialQuizCardForm.quiz_answers.map((answer) =>
                answer === quizAnswers.answer ? (
                  <Chip
                    key={answer}
                    icon={<CheckIcon />}
                    label={answer}
                    onDelete={() => removeAnswerOption(answer)}
                  />
                ) : (
                  <Chip
                    key={answer}
                    label={answer}
                    variant="outlined"
                    onDelete={() => removeAnswerOption(answer)}
                  />
                )
              )}
            </Box>
            <FormGroup
              sx={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TextField
                required
                name="curr_answer"
                value={initialQuizCardForm.curr_answer}
                InputProps={{
                  style: { fontSize: 15, fontWeight: 100, color: 'black' },
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ width: { xs: '100%', md: '90%' } }}
              />
              <IconButton variant="outlined">
                <AddIcon />
              </IconButton>
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
      </Box>
    );
  };

  return editQuiz ? renderEditQuizCard() : renderViewQuizCard();
};

export default QuizCard;
