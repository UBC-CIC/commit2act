import React, { useEffect, useState } from 'react';
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
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import { API } from 'aws-amplify';
import { getActionItemsForAction } from '../graphql/queries';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ActionCard = ({ action, open, handleClose }) => {
  const { action_icon, action_name, action_id, validation_labels } = action;
  const [actionItems, setActionItems] = useState();

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

  //get all action items for the action
  useEffect(() => {
    const getActionItems = async () => {
      const res = await API.graphql({
        query: getActionItemsForAction,
        variables: { action_id: action_id },
      });
      setActionItems(res.data.getActionItemsForAction);
    };
    getActionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderActionContent = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
        <Box
          component="img"
          sx={{ height: 100, width: 100, alignSelf: 'center' }}
          alt={`${action_name} icon`}
          src={action_icon}
        />
        <Box>
          <Typography variant="h3" sx={{ mb: '1em' }}>
            Action Items
          </Typography>
          {actionItems &&
            actionItems.map((item) => (
              <Accordion key={item.item_name}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="action-item-content"
                >
                  <Typography variant="subtitle2">{item.item_name}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Name" secondary={item.item_name} />
                    </ListItem>
                    <Divider flexItem />
                    <ListItem>
                      <ListItemText
                        primary="Description"
                        secondary={item.item_description}
                      />
                    </ListItem>
                    <Divider flexItem />
                    <ListItem>
                      <ListItemText
                        primary="CO2 Saved Per Unit"
                        secondary={item.co2_saved_per_unit}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
        <Box>
          <Typography variant="h3">Action Labels</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              my: '1.5em',
              gap: '0.5em',
            }}
          >
            {validation_labels.split(', ').map((label) => (
              <Chip label={label} variant="outlined" />
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      aria-labelledby="already-member-dialog"
      PaperProps={{ sx: { p: '1em', minWidth: '70%' } }}
      open={open}
      onClose={handleClose}
    >
      <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle>
        <Typography variant="h2">{action_name}</Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: '1em' }}>{renderActionContent()}</DialogContent>
    </Dialog>
  );
};

export default ActionCard;
