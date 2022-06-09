import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  IconButton,
  TextField,
  FormGroup,
  Skeleton,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
// import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';
import NewQuizForm from './NewQuizForm';
import QuizCard from './QuizCard';

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  color: #455a7f;
  font-weight: 300;
`;

const QuizDialog = ({ action, open, handleClose, getActions }) => {
  const dialogOptions = [
    'Add New Question',
    'View and Edit Existing Questions',
  ];
  const [selectedOption, setSelectedOption] = useState();

  const questions = [
    {
      fact_text:
        'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production',
      question_text:
        'What percentage of an average Canadian’s total CO2 production is due to transportation?',
    },
    {
      fact_text:
        'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production',
      question_text:
        'What percentage of an average Canadian’s total CO2 production is due to transportation?',
    },
  ];

  const quizAnswers = {
    answers: ['35%', '70%', '10%', '60%'],
    answer: '35%',
  };

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
          variant="outlined"
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
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
        {questions.map((question) => (
          <QuizCard question={question} quizAnswers={quizAnswers} />
        ))}
      </Box>
    );
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
          <NewQuizForm />
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
