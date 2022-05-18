import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  FormControl,
  FormGroup,
  Card,
  Snackbar,
  Alert,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import {
  createActionItems,
  createAction,
  createActionValidationLabels,
} from '../graphql/mutations';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Input = styled('input')`
  display: none;
`;

const SectionTitle = styled(Typography)`
  margin: 1.5em 0;
`;

const CreateAction = () => {
  const emptyActionForm = {
    action_name: '',
    page_media: '',
    fallback_quiz_media: '',
    curr_label: '',
    labels: [],
    action_items: [],
  };

  const emptyActionItemForm = {
    item_name: '',
    item_description: '',
    co2_saved_per_unit: '',
  };

  const [isValid, setIsValid] = useState({
    co2: false,
    itemName: false,
    itemDescription: false,
    actionName: false,
    actionItems: false,
    validationLabels: false,
  });

  const [actionForm, setActionForm] = useState(emptyActionForm);
  const [actionItemsForm, setActionItemsForm] = useState(emptyActionItemForm);
  const [formError, setFormError] = useState(false);
  const [actionItemFormError, setActionItemFormError] = useState(false);
  const [actionIconFile, setActionIconFile] = useState();
  const [actionIconPreviewLink, setActionIconPreviewLink] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [submitActionSuccess, setSubmitActionSuccess] = useState(false);

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
    } else {
      setActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      switch (e.target.name) {
        //checks to see if action_name field is null
        default:
          if (e.target.name === 'action_name' && !e.target.value) {
            setIsValid((prev) => ({
              ...prev,
              actionName: false,
            }));
            setFormError(true);
          } else if (e.target.name === 'action_name') {
            setIsValid((prev) => ({
              ...prev,
              actionName: true,
            }));
          }
          break;
      }
    }
  };

  //handle icon upload
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

  /** functions for adding and removing action items */
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

  /** functions for adding and removing validation labels */

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

  // /** functions adding the action itself */

  const submitAction = async () => {
    if (isValid.actionItems && isValid.actionName && isValid.validationLabels) {
      setIsLoading(true);

      //if user uploaded an icon image, get the action name to upload the action icon image to s3/cloudfront
      let imageKey = 'actionIcons/'.concat(actionForm.action_name);
      let iconLink = null;
      if (actionIconFile) {
        let imageType = actionIconFile.type;
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
      //create the action and get its id
      const createActionRes = await API.graphql({
        query: createAction,
        variables: {
          action_name: actionForm.action_name,
          action_icon: iconLink,
          fallback_quiz_media: actionForm.fallback_quiz_media,
        },
      });
      const actionId = createActionRes.data.createAction.action_id;
      //create the corresponding items and labels for the action
      await Promise.all([
        API.graphql({
          query: createActionItems,
          variables: {
            action_id: actionId,
            action_items: actionForm.action_items,
          },
        }),
        API.graphql({
          query: createActionValidationLabels,
          variables: {
            action_id: actionId,
            validation_labels: actionForm.labels,
          },
        }),
      ]);

      //clear form and related states
      setActionForm(emptyActionForm);
      setActionIconPreviewLink();
      setIsValid((prev) => ({
        ...prev,
        actionName: false,
      }));
      setFormError(false);
      //render success message
      setSubmitActionSuccess(true);
    } else {
      setFormError(true);
    }
  };

  //once action has been successfully submitted, set loading state to false to remove progress bar
  useEffect(() => {
    submitActionSuccess && setIsLoading(false);
  }, [submitActionSuccess]);

  const renderAddedActionItems = () => {
    return (
      actionForm.action_items &&
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
      ))
    );
  };

  const renderAddedLabels = () => {
    return actionForm.labels.map((label, index) => (
      <Chip
        label={label}
        variant="outlined"
        key={index}
        onDelete={() => removeValidationLabel(label)}
        sx={{ mr: '0.5em' }}
      />
    ));
  };

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h2" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Create New Action Type
        </Typography>
      </Box>
      <Grid
        container
        direction={{ xs: 'column', md: 'row' }}
        component={Paper}
        sx={{
          minHeight: '50vh',
          borderRadius: '8px',
          padding: { xs: '1.5em 1.5em 2em', md: '1.5em 0.5em 2em' },
          justifyContent: 'center',
          mt: '3em',
        }}
      >
        <FormControl>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            direction={{ xs: 'column', md: 'row' }}
          >
            <Grid item xs={12}>
              <SectionTitle variant="h3">Action Name</SectionTitle>
              <TextField
                required
                label="Action Name"
                name="action_name"
                InputLabelProps={{ shrink: true }}
                value={actionForm.action_name}
                error={formError && !isValid.actionName}
                helperText={
                  formError &&
                  !isValid.actionName &&
                  'Action Name field must be completed'
                }
                onChange={updateForm}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <SectionTitle variant="h3">Action Icon</SectionTitle>
              <Box
                component="div"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ flexDirection: 'column', gap: '1em' }}
              >
                {actionIconPreviewLink ? (
                  <Box
                    component="img"
                    sx={{
                      height: 150,
                      width: 150,
                    }}
                    alt="Uploaded Action Icon"
                    src={actionIconPreviewLink}
                  />
                ) : (
                  <Box
                    component="div"
                    sx={{
                      height: 150,
                      width: 150,
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
                    Upload Image
                  </Button>
                </label>
              </Box>
            </Grid>
          </Grid>
          <SectionTitle variant="h3">Action Items</SectionTitle>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              mb: '2em',
              display: formError && !isValid.actionItems ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          {renderAddedActionItems()}
          <FormGroup
            sx={{
              gap: '1.5em',
              flexDirection: { xs: 'column', md: 'row' },
              mt: actionForm.action_items.length > 0 && '1.5em',
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
                actionItemFormError && !isValid.itemName && 'Input is required'
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
            <Button
              variant="outlined"
              onClick={addActionItem}
              sx={{ height: 'min-content' }}
            >
              Add Action Item
            </Button>
          </FormGroup>
          <SectionTitle variant="h3">Fallback Text</SectionTitle>
          <TextField
            label="Text"
            name="fallback_quiz_media"
            InputLabelProps={{ shrink: true }}
            value={actionForm.fallback_quiz_media}
            onChange={updateForm}
          />
          <SectionTitle variant="h3">Image Validation Labels</SectionTitle>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              mb: '2em',
              display:
                formError && !isValid.validationLabels ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 image validation label
          </Typography>
          {actionForm.labels.length !== 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                mb: '1.5em',
                width: { xs: '30%', sm: '80%' },
              }}
            >
              {renderAddedLabels()}
            </Box>
          )}
          <FormGroup
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
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
                mt: { xs: '2em', md: '0em' },
                height: 'min-content',
              }}
              onClick={addValidationLabel}
            >
              Add Label
            </Button>
          </FormGroup>
          {isLoading && (
            <LinearProgress
              sx={{ width: '100%', mt: '1.5em' }}
              color="primary"
              variant="indeterminate"
            />
          )}
          <Button
            sx={{
              mt: '4em',
              backgroundColor: '#112D4E',
              width: { xs: '100%', md: '40%' },
              alignSelf: 'center',
            }}
            variant="contained"
            type="submit"
            onClick={submitAction}
            disabled={
              !isValid.actionName ||
              !isValid.validationLabels ||
              !isValid.actionItems
            }
          >
            Submit New Action
          </Button>
        </FormControl>
        <Snackbar
          open={submitActionSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2000}
          onClose={() => setSubmitActionSuccess(false)}
        >
          <Alert
            onClose={() => setSubmitActionSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Your action has been submitted!
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
};

export default CreateAction;
