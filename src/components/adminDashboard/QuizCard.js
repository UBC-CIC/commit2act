import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Paper, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import EditQuizCard from './EditQuizCard';

const QuizCard = ({ quiz, getQuizzes }) => {
  const { fact_text, question_text, answers, correct_answers } = quiz;
  const [editQuiz, setEditQuiz] = useState(false);

  useEffect(() => {
    setEditQuiz(false);
  }, [getQuizzes]);

  const renderFrenchAnswers = () => {
    if (quiz.answers_french?.length < 1) return;
    return (
      <>
        <Typography variant='subtitle1'>Possible Answers (French)</Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            my: '0.5em',
            gap: '0.5em',
          }}
        >
          {
            quiz.answers_french
              .split('\n')
              .map((answer) =>
                quiz.correct_answers_french.split('\n').includes(answer) ? (
                  <Chip key={answer} icon={<CheckIcon />} label={answer} />
                ) : (
                  <Chip key={answer} label={answer} variant="outlined" />
                )
              )
          }
        </Box>
      </>
    )
  };

  const renderView = () => {
    if (editQuiz) {
      return <EditQuizCard quiz={quiz} getQuizzes={getQuizzes} />;
    } else {
      return (
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
            {
              quiz.fact_text_french &&
              (
                <>
                  <Typography variant='subtitle1'>Fact Text (French)</Typography>
                  <Typography sx={{ mt: '1em' }} variant='subtitle2'>{quiz.fact_text_french || ''}</Typography>
                </>
              )
            }
          </Box>
          <Box>
            <Typography variant="h3">Question Text</Typography>
            <Typography sx={{ mt: '1em' }}>{question_text}</Typography>
            {
              quiz.question_text_french &&
              (
                <>
                  <Typography variant='subtitle1'>Question Text (French)</Typography>
                  <Typography sx={{ mt: '1em' }} variant='subtitle2'>{quiz.question_text_french || ''}</Typography>
                </>
              )
            }
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
            {renderFrenchAnswers()}
          </Box>
        </Box>
      );
    }
  };

  return (
    quiz && (
      <Box sx={{ display: 'flex', flexDirection: 'column' }} component={Paper}>
        <IconButton
          sx={{ alignSelf: 'flex-end' }}
          onClick={() => setEditQuiz(!editQuiz)}
        >
          <EditIcon />
        </IconButton>
        {renderView()}
      </Box>
    )
  );
};

export default QuizCard;
