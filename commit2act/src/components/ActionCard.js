import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const ActionCard = ({ action, open, handleClose }) => {
  console.log(action);

  return (
    <Dialog
      aria-labelledby="already-member-dialog"
      PaperProps={{ sx: { p: '1em' } }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{action.action_name}</DialogTitle>
      <DialogContent>test</DialogContent>
    </Dialog>
  );
};

export default ActionCard;
