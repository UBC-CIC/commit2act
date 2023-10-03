import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import NewQuizForm from './NewQuizForm';
import QuizCard from './QuizCard';
import { API } from 'aws-amplify';
import { getAllQuizzesForAction } from '../../graphql/queries';
import { useContentTranslationsContext } from '../contexts/ContentTranslationsContext';

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  font-weight: 300;
  color: #fff;
`;

const QuizDialog = ({ action, open, handleClose, getActions }) => {
  const dialogOptions = [
    'Add New Question',
    'View and Edit Existing Questions',
  ];
  const [selectedOption, setSelectedOption] = useState();
  const [allQuizzes, setAllQuizzes] = useState();

  // translations
  const { contentTranslations, setContentTranslations } = useContentTranslationsContext();

  const getQuizzes = async () => {
    const res = await API.graphql({
      query: getAllQuizzesForAction,
      variables: { action_id: action.action_id },
    }).catch(e => {
      console.log(e);
    });
    if (typeof res !== 'undefined') {
      // remove quizzes that have null id
      res.data.getAllQuizzesForAction = res.data.getAllQuizzesForAction.filter(quiz => quiz.quiz_id !== null);

      const frenchQuizzes = await getFrenchQuizzes();
      if (frenchQuizzes) {
        res.data.getAllQuizzesForAction.forEach(quiz => {
          const frenchQuiz = frenchQuizzes.quizzes?.find(frenchQuiz => frenchQuiz.quiz_id === quiz.quiz_id);
          if (frenchQuiz) {
            const correct_french_answer = frenchQuiz.quiz_answers.find(answer => answer.is_correct_answer)?.answer;
            quiz.question_text_french = frenchQuiz.question_text;
            quiz.fact_text_french = frenchQuiz.fact_text;
            quiz.correct_answers_french = correct_french_answer;
            if (frenchQuiz.quiz_answers.length > 0) {
              quiz.answers_french = frenchQuiz.quiz_answers.map(answer => answer.answer).join('\n');
            } else {
              quiz.answers_french = [];
            }
          } else {
            quiz.question_text_french = '';
            quiz.fact_text_french = '';
            quiz.correct_answers_french = [];
            quiz.answers_french = [];
          }
        });
      } else {
        res.data.getAllQuizzesForAction.forEach(quiz => {
          quiz.question_text_french = '';
          quiz.fact_text_french = '';
          quiz.correct_answers_french = [];
          quiz.answers_french = [];
        });
      }
      setAllQuizzes(res.data.getAllQuizzesForAction);
    }
  };

  const getFrenchQuizzes = async () => {
    const frenchTranslation = contentTranslations.find(translation => translation.langCode === 'fr');
    return frenchTranslation.translationJSON?.actions?.find(frenchAction => frenchAction.action_id === action.action_id);
  }

  useEffect(() => {
    getQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action.action_id]);

  const renderQuizMenu = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          gap: '1em',
        }}
      >
        <Button
          onClick={() => setSelectedOption(dialogOptions[0])}
          variant="contained"
          sx={{ width: { xs: '100%', sm: '50%' } }}
          startIcon={<AddIcon />}
        >
          Add New Question
        </Button>
        <Button
          onClick={() => setSelectedOption(dialogOptions[1])}
          variant="outlined"
          sx={{ width: { xs: '100%', sm: '50%' } }}
          startIcon={<EditIcon />}
        >
          View and Edit Existing Questions
        </Button>
      </Box>
    );
  };

  const renderQuizCards = () => {
    if (typeof allQuizzes !== 'undefined') {
      return allQuizzes.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          {allQuizzes.map((quiz, index) => (
            <QuizCard key={index} quiz={quiz} getQuizzes={getQuizzes} />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1">
            There are currently no quizzes to display.
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1">
            There are currently no quizzes to display.
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Dialog
      aria-labelledby="action-card-dialog"
      PaperProps={{ sx: { minWidth: '70%' } }}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: selectedOption ? 'row' : 'row-reverse',
        }}
      >
        {selectedOption && (
          <IconButton onClick={() => setSelectedOption()}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <StyledDialogTitle sx={{ textAlign: 'center' }}>
        {action.action_name}
      </StyledDialogTitle>
      <DialogContent sx={{ mt: '1em', p: '3em' }}>
        {selectedOption === dialogOptions[0] ? (
          <NewQuizForm action_id={action.action_id} getQuizzes={getQuizzes} />
        ) : selectedOption === dialogOptions[1] ? (
          renderQuizCards()
        ) : (
          renderQuizMenu()
        )}
      </DialogContent>
    </Dialog>
  );
};
export default QuizDialog;
