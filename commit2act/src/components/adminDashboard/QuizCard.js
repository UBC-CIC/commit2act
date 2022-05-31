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

  const renderViewQuizContent = () => {
    return (
      <Box>
        <Typography>hi</Typography>
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
