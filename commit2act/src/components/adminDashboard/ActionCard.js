import React, { useEffect, useState } from 'react';
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
import { Storage, API } from 'aws-amplify';
import { getActionItemsForAction } from '../../graphql/queries';
import {
  deleteAction,
  updateAction,
  graveyardAction,
  restoreAction,
  remakeActionItems,
  remakeActionValidationLabels,
} from '../../graphql/mutations';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { styled } from '@mui/material/styles';

const Input = styled('input')`
  display: none;
`;

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  color: #455a7f;
  font-weight: 300;
`;

const ActionCard = ({
  action,
  open,
  handleClose,
  editAction,
  setEditAction,
  getActions,
}) => {
  const { action_icon, action_name, action_id, validation_labels, is_hidden } =
    action;

  const initialActionForm = {
    action_name: action_name,
    fallback_quiz_media: '',
    curr_label: '',
    labels: validation_labels.split(', '),
    action_items: [],
  };

  const emptyActionItemForm = {
    action_id: action_id,
    item_name: '',
    item_description: '',
    co2_saved_per_unit: '',
  };

  const [isValid, setIsValid] = useState({
    co2: false,
    itemName: false,
    itemDescription: false,
    actionItems: false,
    validationLabels: false,
  });
  const [actionForm, setActionForm] = useState(initialActionForm);
  const [actionItemsForm, setActionItemsForm] = useState(emptyActionItemForm);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showPauseWarning, setShowPauseWarning] = useState(false);
  const [formError, setFormError] = useState(false);
  const [actionItemFormError, setActionItemFormError] = useState(false);
  const [actionIconFile, setActionIconFile] = useState();
  const [actionIconPreviewLink, setActionIconPreviewLink] = useState();

  //get all action items for the action
  useEffect(() => {
    const getActionItems = async () => {
      const res = await API.graphql({
        query: getActionItemsForAction,
        variables: { action_id: action_id },
      });
      setActionForm((prev) => ({
        ...prev,
        action_items: res.data.getActionItemsForAction,
      }));
    };
    getActionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** functions for rendering the non editable action card */

  const renderActionContent = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
        {action_icon && (
          <Box
            component="img"
            sx={{ height: 100, width: 100, alignSelf: 'center' }}
            alt={`${action_name} icon`}
            src={action_icon + '?' + new Date()}
          />
        )}
        {is_hidden && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">
              This action is currently paused. <br></br>Restore action to allow
              user submitted content
            </Typography>
          </Box>
        )}
        <Box>
          <Typography variant="h3" sx={{ mb: '1em' }}>
            Action Items
          </Typography>
          {actionForm.action_items.length === 0 && <Skeleton variant="text" />}
          {actionForm.action_items &&
            actionForm.action_items.map((item) => (
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
          <Typography variant="h3">Image Validation Labels</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              my: '1.5em',
              gap: '0.5em',
            }}
          >
            {validation_labels.split(', ').map((label) => (
              <Chip key={label} label={label} variant="outlined" />
            ))}
          </Box>
        </Box>
        {is_hidden ? (
          <Button onClick={() => unPauseAction()} variant="outlined">
            Restore Action
          </Button>
        ) : (
          <Button onClick={() => setEditAction(true)} variant="outlined">
            Edit Action
          </Button>
        )}
      </Box>
    );
  };

  /** functions for rendering the editable action card */

  const updateForm = (e) => {
    if (e.target.name in actionItemsForm) {
      setActionItemsForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      switch (e.target.name) {
        case 'item_name':
          //checks to see if user input for item name field is null
          if (!e.target.value) {
            setIsValid((prev) => ({
              ...prev,
              itemName: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              itemName: true,
            }));
          }
          break;
        case 'item_description':
          //checks to see if user input for item description field is null
          if (!e.target.value) {
            setIsValid((prev) => ({
              ...prev,
              itemDescription: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              itemDescription: true,
            }));
          }
          break;
        default:
          //checks to see if user input for co2 saved per unit field is a positive numerical value
          if (!e.target.value.match(new RegExp('^([1-9]\\d*|0)(\\.\\d+)?$'))) {
            setIsValid((prev) => ({
              ...prev,
              co2: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              co2: true,
            }));
          }
      }
    } else if (e.target.name in actionForm) {
      setActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  //checks to see if actionItems and image validation labels  are valid for submission (if there is more than 1 item in the array)
  useEffect(() => {
    if (actionForm.labels.length > 0) {
      setIsValid((prev) => ({
        ...prev,
        validationLabels: true,
      }));
    } else if (actionForm.labels.length === 0) {
      setIsValid((prev) => ({
        ...prev,
        validationLabels: false,
      }));
    }

    if (actionForm.action_items.length < 1) {
      setIsValid((prev) => ({
        ...prev,
        actionItems: false,
      }));
    } else {
      setIsValid((prev) => ({
        ...prev,
        actionItems: true,
      }));
    }
  }, [actionForm]);

  const removeActionItem = (name) => {
    let actionItemsCopy = actionForm.action_items;
    let filteredActionItems = actionItemsCopy.filter(
      (item) => item.item_name !== name
    );
    setActionForm((prev) => ({
      ...prev,
      action_items: filteredActionItems,
    }));
  };

  const addActionItem = () => {
    if (isValid.co2 && isValid.itemName && isValid.itemDescription) {
      actionItemsForm.co2_saved_per_unit = Number(
        actionItemsForm.co2_saved_per_unit
      );
      //adds the item from the form into actionItems array
      let actionItemsCopy = actionForm.action_items;
      actionItemsCopy.push(actionItemsForm);
      setActionForm((prev) => ({ ...prev, action_items: actionItemsCopy }));
      //clears the actionItemsForm so user can enter in a new action item
      setActionItemsForm(emptyActionItemForm);
      setIsValid((prev) => ({
        ...prev,
        co2: false,
        itemName: false,
        itemDescription: false,
      }));
      setActionItemFormError(false);
    } else {
      setActionItemFormError(true);
    }
  };

  const removeValidationLabel = (label) => {
    let labelsCopy = actionForm.labels;
    const index = labelsCopy.indexOf(label);
    labelsCopy.splice(index, 1);
    setActionForm((prev) => ({ ...prev, labels: labelsCopy }));
  };

  const addValidationLabel = () => {
    //create array that contains the current label input from the form along with all previous inputted labels
    let labelsCopy = actionForm.labels;
    labelsCopy.push(actionForm.curr_label);
    setActionForm((prev) => ({ ...prev, labels: labelsCopy }));
    //clear current label
    setActionForm((prev) => ({ ...prev, curr_label: '' }));
  };

  const handleIconUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setActionIconFile(null);
      return;
    }
    let imageFile = e.target.files[0];
    let previewLink = URL.createObjectURL(imageFile);
    setActionIconFile(imageFile);
    setActionIconPreviewLink(previewLink);
  };

  const updateSelectedAction = async () => {
    if (isValid.actionItems && isValid.validationLabels) {
      //update icon image in s3 if user uploaded a new image
      let iconLink = null;
      if (actionIconFile) {
        let imageType = actionIconFile.type;
        let imageKey = 'actionIcons/'.concat(actionForm.action_name);
        iconLink =
          process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
        try {
          await Storage.put(imageKey, actionIconFile, {
            contentType: imageType,
          });
        } catch (error) {
          console.log('Error uploading file', error);
        }
      }

      await Promise.all([
        API.graphql({
          query: updateAction,
          variables: {
            action_id: action_id,
            action_icon: actionIconFile ? iconLink : action_icon,
          },
        }),
        API.graphql({
          query: remakeActionItems,
          variables: {
            action_id: action_id,
            action_items: actionForm.action_items,
          },
        }),
        API.graphql({
          query: remakeActionValidationLabels,
          variables: {
            action_id: action_id,
            validation_labels: actionForm.labels,
          },
        }),
      ]);
      handleClose();
      getActions();
    } else {
      setFormError(true);
    }
  };

  const deleteSelectedAction = async () => {
    await API.graphql({
      query: deleteAction,
      variables: { action_id: action_id },
    });
    handleClose();
    getActions();
  };

  const pauseSelectedAction = async () => {
    await API.graphql({
      query: graveyardAction,
      variables: { action_id: action_id },
    });
    handleClose();
    getActions();
  };

  const unPauseAction = async () => {
    await API.graphql({
      query: restoreAction,
      variables: { action_id: action_id },
    });
    handleClose();
    getActions();
  };

  const renderEditActionContent = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1em',
            alignSelf: 'center',
          }}
        >
          {action_icon && !actionIconPreviewLink ? (
            <>
              <Box
                component="img"
                sx={{ height: 100, width: 100, alignSelf: 'center' }}
                alt={`${action_name} icon`}
                src={action_icon + '?' + new Date()}
              />
              <label htmlFor="action-icon-image">
                <Input
                  accept="image/*"
                  id="action-icon-image"
                  type="file"
                  onChange={handleIconUpload}
                />
                <Button variant="outlined" component="span">
                  Upload Icon Image
                </Button>
              </label>
            </>
          ) : (
            <>
              {actionIconPreviewLink ? (
                <Box
                  component="img"
                  sx={{
                    height: 100,
                    width: 100,
                  }}
                  alt="Uploaded Action Icon"
                  src={actionIconPreviewLink}
                />
              ) : (
                <Box
                  component="div"
                  sx={{
                    height: 100,
                    width: 100,
                    backgroundColor: '#A9A9A9',
                  }}
                />
              )}

              <label htmlFor="action-icon-image">
                <Input
                  accept="image/*"
                  id="action-icon-image"
                  type="file"
                  onChange={handleIconUpload}
                />
                <Button variant="outlined" component="span">
                  Upload Icon Image
                </Button>
              </label>
            </>
          )}
        </Box>

        <Box>
          <Typography variant="h3" sx={{ mb: '1em' }}>
            Action Items
          </Typography>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              display: formError && !isValid.actionItems ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          {actionForm.action_items &&
            actionForm.action_items.map((item) => (
              <Accordion key={item.item_name}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="action-item-content"
                  sx={{
                    '.MuiAccordionSummary-content': {
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mr: '0.5em',
                    },
                  }}
                >
                  <Typography variant="subtitle2">{item.item_name}</Typography>
                  <IconButton onClick={() => removeActionItem(item.item_name)}>
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
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
          <FormGroup
            sx={{
              mt: '3em',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              gap: '1em',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: '1em',
                width: { xs: '100%', md: '80%' },
              }}
            >
              <TextField
                required
                label="Item Name"
                name="item_name"
                InputLabelProps={{ shrink: true }}
                value={actionItemsForm.item_name}
                error={actionItemFormError && !isValid.itemName}
                helperText={
                  actionItemFormError &&
                  !isValid.itemName &&
                  'Input is required'
                }
                onChange={updateForm}
              />
              <TextField
                required
                label="Item Description"
                name="item_description"
                InputLabelProps={{ shrink: true }}
                value={actionItemsForm.item_description}
                error={actionItemFormError && !isValid.itemDescription}
                helperText={
                  actionItemFormError &&
                  !isValid.itemDescription &&
                  'Input is required'
                }
                onChange={updateForm}
              />
              <TextField
                required
                label="CO2 Per Unit Saved"
                name="co2_saved_per_unit"
                inputProps={{ inputMode: 'numeric' }}
                InputLabelProps={{ shrink: true }}
                value={actionItemsForm.co2_saved_per_unit}
                error={actionItemFormError && !isValid.co2}
                helperText={
                  actionItemFormError &&
                  !isValid.co2 &&
                  'Input must be a number greater than 0'
                }
                sx={{ xs: { mt: '1.5em' } }}
                onChange={updateForm}
              />
            </Box>
            <Button
              variant="outlined"
              sx={{
                width: { xs: '100%', md: '17%' },
                mt: { xs: '1.5em', sm: '0em' },
                height: 'min-content',
              }}
              onClick={addActionItem}
            >
              Add Item
            </Button>
          </FormGroup>
        </Box>
        <Box>
          <Typography variant="h3" sx={{ mb: '1em' }}>
            Image Validation Labels
          </Typography>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              display:
                formError && !isValid.validationLabels ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 image validation label
          </Typography>
          {actionForm.labels.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                my: '1.5em',
                gap: '0.5em',
              }}
            >
              {actionForm.labels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  variant="outlined"
                  onDelete={() => removeValidationLabel(label)}
                />
              ))}
            </Box>
          )}
          <FormGroup
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              mt: '3em',
            }}
          >
            <TextField
              required
              label="Label"
              name="curr_label"
              value={actionForm.curr_label}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { xs: '100%', md: '80%' } }}
              onChange={updateForm}
            />
            <Button
              variant="outlined"
              sx={{
                width: { xs: '100%', md: '17%' },
                mt: { xs: '1.5em', sm: '0em' },
                height: 'min-content',
              }}
              onClick={addValidationLabel}
            >
              Add Label
            </Button>
          </FormGroup>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'space-between' },
            my: '2em',
            gap: '4em',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: '1em',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setShowDeleteWarning(true)}
            >
              Delete Action
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowPauseWarning(true)}
            >
              Pause Action
            </Button>
          </Box>
          <Button variant="contained" onClick={updateSelectedAction}>
            Save Action
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Dialog
        aria-labelledby="action-card-dialog"
        PaperProps={{ sx: { minWidth: '70%' } }}
        open={open}
        onClose={editAction ? () => setShowCloseWarning(true) : handleClose}
      >
        {editAction ? (
          <IconButton
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setShowCloseWarning(true)}
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        )}
        <StyledDialogTitle sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          {action_name}
        </StyledDialogTitle>
        <DialogContent sx={{ mt: '1em', p: '3em' }}>
          {editAction ? renderEditActionContent() : renderActionContent()}
        </DialogContent>
      </Dialog>
      {/* display warning dialog when user clicks the close button*/}
      <Dialog
        aria-labelledby="close-warning-dialog"
        PaperProps={{
          sx: {
            p: '1em',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
          },
        }}
        open={showCloseWarning}
      >
        <DialogTitle>Exit?</DialogTitle>
        <WarningAmberIcon fontSize="large" />
        <DialogContent>
          Your changes for this action will not be saved
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: '2em' }}>
          <Button
            variant="contained"
            onClick={() => setShowCloseWarning(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Exit
          </Button>
        </DialogActions>
      </Dialog>
      {/* display warning dialog when user clicks the delete action button*/}
      <Dialog
        aria-labelledby="delete-warning-dialog"
        PaperProps={{
          sx: {
            p: '1em',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
          },
        }}
        open={showDeleteWarning}
      >
        <DialogTitle>Delete {action_name}</DialogTitle>
        <WarningAmberIcon fontSize="large" />
        <DialogContent>
          You will lose all user submitted content for this action.
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: '2em' }}>
          <Button
            variant="contained"
            onClick={() => setShowDeleteWarning(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={() => deleteSelectedAction()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* display warning dialog when user clicks the pause action button*/}
      <Dialog
        aria-labelledby="pause-warning-dialog"
        PaperProps={{
          sx: {
            p: '1em',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
          },
        }}
        open={showPauseWarning}
      >
        <DialogTitle>Pause {action_name}?</DialogTitle>
        <WarningAmberIcon fontSize="large" />
        <DialogContent>
          Users will not be able to submit content for this action until it is
          unpaused
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: '2em' }}>
          <Button
            variant="contained"
            onClick={() => setShowPauseWarning(false)}
          >
            Cancel
          </Button>
          <Button variant="outlined" onClick={() => pauseSelectedAction()}>
            Pause Action
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionCard;
