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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  color: #455a7f;
  font-weight: 300;
`;

const QuizCard = ({ action, open, handleClose, getActions }) => {
  const [editQuizzes, setEditQuizzes] = useState(false);

  const question = {
    fact_text:
      'As of 2019, the average Canadian produced an equivalent of 14.2 tonnes of CO2, with transportation playing the largest role, contributing 35% of total CO2 production',
    question_text:
      'What percentage of an average Canadian’s total CO2 production is due to transportation?',
  };

  const quizAnswers = {
    answers: ['35%', '70%', '10%', '60%'],
    answer: '35%',
  };

  const renderViewQuizContent = () => {
    return (
      <Box>
        <Typography>Fact Text</Typography>
        <Typography>{question.fact_text}</Typography>
        <Typography>Question Text</Typography>
        <Typography>{question.question_text}</Typography>
      </Box>
    );
  };

  const renderEditQuizContent = () => {
    return <Typography>bye</Typography>;
  };

  return (
    <Dialog
      aria-labelledby="action-card-dialog"
      PaperProps={{ sx: { minWidth: '70%' } }}
      open={open}
      onClose={handleClose}
    >
      <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>

      <StyledDialogTitle sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        {action.action_name}
      </StyledDialogTitle>
      <DialogContent sx={{ mt: '1em', p: '3em' }}>
        {editQuizzes ? renderEditQuizContent() : renderViewQuizContent()}
      </DialogContent>
    </Dialog>
  );
};
export default QuizCard;
