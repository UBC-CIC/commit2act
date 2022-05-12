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
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import {
  createActionItems,
  createAction,
  createActionValidationLabels,
} from '../graphql/mutations';

const Input = styled('input')`
  display: none;
`;

const SectionTitle = styled(Typography)`
  margin: 1.5em 0;
`;

const ActionItemCategory = styled(Typography)`
  margin: 1em 1em 0 0;
  font-weight: 500;
`;

const CreateAction = () => {
  const emptyActionItemForm = {
    item_name: '',
    item_description: '',
    co2_saved_per_unit: '',
  };
  const emptyCreateActionForm = {
    action_name: '',
    page_media: '',
    fallback_quiz_media: '',
    curr_label: '',
    labels: [],
  };
  const [createActionForm, setCreateActionForm] = useState(
    emptyCreateActionForm
  );
  const [actionItemsForm, setActionItemsForm] = useState(emptyActionItemForm);
  const [actionItems, setActionItems] = useState([]);
  const [isValid, setIsValid] = useState({
    co2Valid: false,
    itemNameValid: false,
    itemDescriptionValid: false,
    actionItemsValid: false,
    actionNameValid: false,
    validationLabels: false,
  });
  const [formError, setFormError] = useState(false);
  const [actionItemFormError, setActionItemFormError] = useState(false);
  const [submitActionSuccess, setSubmitActionSuccess] = useState(false);
  const [actionIconFile, setActionIconFile] = useState();
  const [actionIconPreviewLink, setActionIconPreviewLink] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //if input field names are from actionItems form, update that form. Otherwise update the createAction form.
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
              itemNameValid: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              itemNameValid: true,
            }));
          }
          break;
        case 'item_description':
          //checks to see if user input for item description field is null
          if (!e.target.value) {
            setIsValid((prev) => ({
              ...prev,
              itemDescriptionValid: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              itemDescriptionValid: true,
            }));
          }
          break;
        default:
          //checks to see if user input for co2 saved per unit field is a positive numerical value
          if (!e.target.value.match(/[0-9]*[.,]?[0-9]+/)) {
            setIsValid((prev) => ({
              ...prev,
              co2Valid: false,
            }));
          } else {
            setIsValid((prev) => ({
              ...prev,
              co2Valid: true,
            }));
          }
      }
    } else {
      setCreateActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      switch (e.target.name) {
        //checks to see if action_name field is null
        default:
          if (e.target.name === 'action_name' && !e.target.value) {
            setIsValid((prev) => ({
              ...prev,
              actionNameValid: false,
            }));
            setFormError(true);
          } else if (e.target.name === 'action_name') {
            setIsValid((prev) => ({
              ...prev,
              actionNameValid: true,
            }));
          }
          break;
      }
    }
  };

  /** functions for uploading an icon */

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

  /** functions for validating and adding the actionItems */

  //checks to see if actionItems are valid for submission (if there is more than 1 item in the array)
  useEffect(() => {
    if (actionItems.length < 1) {
      setIsValid((prev) => ({
        ...prev,
        actionItemsValid: false,
      }));
    } else {
      setIsValid((prev) => ({
        ...prev,
        actionItemsValid: true,
      }));
    }
  }, [actionItems]);

  //check to see if image validation labels are valid for submission
  useEffect(() => {
    if (createActionForm.labels.length > 0) {
      console.log('hi');
      setIsValid((prev) => ({
        ...prev,
        validationLabels: true,
      }));
    } else if (createActionForm.labels.length === 0) {
      setIsValid((prev) => ({
        ...prev,
        validationLabels: false,
      }));
    }
  }, [createActionForm]);

  const addActionItem = () => {
    if (
      isValid.co2Valid &&
      isValid.itemNameValid &&
      isValid.itemDescriptionValid
    ) {
      //adds the item from the form into actionItems array
      setActionItems((actionItems) => [...actionItems, actionItemsForm]);
      //clears the actionItemsForm so user can enter in a new action item
      setActionItemsForm(emptyActionItemForm);
      setIsValid((prev) => ({
        ...prev,
        co2Valid: false,
        itemNameValid: false,
        itemDescriptionValid: false,
      }));
      setActionItemFormError(false);
    } else {
      setActionItemFormError(true);
    }
  };

  const removeActionItem = (name) => {
    setActionItems(actionItems.filter((item) => item.item_name !== name));
  };

  const addValidationLabel = () => {
    //create array that contains the current label input from the form along with all previous inputted labels
    let labelsCopy = createActionForm.labels;
    labelsCopy.push(createActionForm.curr_label);
    setCreateActionForm((prev) => ({ ...prev, labels: labelsCopy }));
    //clear current label
    setCreateActionForm((prev) => ({ ...prev, curr_label: '' }));
  };

  const removeValidationLabel = (label) => {
    let labelsCopy = createActionForm.labels;
    const index = labelsCopy.indexOf(label);
    labelsCopy.splice(index, 1);
    setCreateActionForm((prev) => ({ ...prev, labels: labelsCopy }));
  };

  /** functions adding the action itself */

  const submitAction = async () => {
    if (
      isValid.actionItemsValid &&
      isValid.actionNameValid &&
      isValid.validationLabels
    ) {
      setIsLoading(true);

      //if user uploaded an icon image, get the action name to upload the action icon image to s3/cloudfront
      let imageKey = 'actionIcons/'.concat(createActionForm.action_name);
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
          action_name: createActionForm.action_name,
          action_icon: iconLink,
          fallback_quiz_media: createActionForm.fallback_quiz_media,
        },
      });
      const actionId = createActionRes.data.createAction.action_id;
      //create the corresponding items and labels for the action
      await Promise.all([
        API.graphql({
          query: createActionItems,
          variables: { action_id: actionId, action_items: actionItems },
        }),
        API.graphql({
          query: createActionValidationLabels,
          variables: {
            action_id: actionId,
            validation_labels: createActionForm.labels,
          },
        }),
      ]);

      //clear form and related states
      setCreateActionForm(emptyCreateActionForm);
      setActionItems([]);
      setActionIconPreviewLink();
      setIsValid((prev) => ({
        ...prev,
        actionNameValid: false,
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
    return actionItems.map((item, index) => (
      <Card
        key={index}
        sx={{
          backgroundColor: 'white',
          mt: '1em',
          borderRadius: '5px',
          padding: '1em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box>
          <Typography variant="h8" component="div">
            <ActionItemCategory variant="h8" component="span">
              Item Name:
            </ActionItemCategory>
            {item.item_name}
          </Typography>
          <Typography variant="h8" component="div">
            <ActionItemCategory variant="h8" component="span">
              Item Description:
            </ActionItemCategory>
            {item.item_description}
          </Typography>
          <Typography variant="h8" component="div">
            <ActionItemCategory variant="h8" component="span">
              CO2 Per Unit Saved:
            </ActionItemCategory>
            {item.co2_saved_per_unit}
          </Typography>
        </Box>
        <IconButton onClick={() => removeActionItem(item.item_name)}>
          <HighlightOff fontSize="large" />
        </IconButton>
      </Card>
    ));
  };

  const renderAddedLabels = () => {
    return createActionForm.labels.map((label, index) => (
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
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Create New Action Type
        </Typography>
      </Box>
      <Grid
        container
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          minHeight: '50vh',
          backgroundColor: '#e8f4f8',
          borderRadius: '8px',
          padding: { xs: '1.5em 1.5em 2em', md: '1.5em 0.5em 2em' },
          justifyContent: 'center',
          mt: '3em',
        }}
      >
        <FormControl>
          <Grid
            container
            spacing={{ xs: 2, md: 12 }}
            direction={{ xs: 'column', md: 'row' }}
          >
            <Grid item xs={6}>
              <SectionTitle variant="h3">Action Name</SectionTitle>
              <TextField
                required
                label="Action Name"
                name="action_name"
                InputLabelProps={{ shrink: true }}
                value={createActionForm.action_name}
                error={formError && !isValid.actionNameValid}
                helperText={
                  formError &&
                  !isValid.actionNameValid &&
                  'Action Name field must be completed'
                }
                onChange={updateForm}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <SectionTitle variant="h3">Action Icon</SectionTitle>
              <Box
                component="div"
                display="flex"
                alignItems="center"
                sx={{ flexDirection: { xs: 'column', md: 'row' } }}
              >
                {actionIconPreviewLink ? (
                  <Box
                    component="img"
                    sx={{
                      height: 70,
                      width: 70,
                    }}
                    alt="Uploaded Action Icon"
                    src={actionIconPreviewLink}
                  />
                ) : (
                  <Box
                    component="div"
                    sx={{
                      height: 70,
                      width: 70,
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
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ m: { xs: '1.5em 0 0', md: '0 0 0 1.5em' } }}
                  >
                    Upload Icon Image
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
              display:
                formError && !isValid.actionItemsValid ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          <FormGroup
            sx={{
              gap: '1.5em',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <TextField
              required
              label="Item Name"
              name="item_name"
              InputLabelProps={{ shrink: true }}
              value={actionItemsForm.item_name}
              error={actionItemFormError && !isValid.itemNameValid}
              helperText={
                actionItemFormError &&
                !isValid.itemNameValid &&
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
              error={actionItemFormError && !isValid.itemDescriptionValid}
              helperText={
                actionItemFormError &&
                !isValid.itemDescriptionValid &&
                'Input is required'
              }
              onChange={updateForm}
            />
            <TextField
              required
              label="CO2 Per Unit Saved"
              name="co2_saved_per_unit"
              inputMode="decimal"
              InputLabelProps={{ shrink: true }}
              value={actionItemsForm.co2_saved_per_unit}
              error={actionItemFormError && !isValid.co2Valid}
              helperText={
                actionItemFormError &&
                !isValid.co2Valid &&
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
          {renderAddedActionItems()}
          <SectionTitle variant="h3">Fallback Text</SectionTitle>
          <TextField
            label="Text"
            name="fallback_quiz_media"
            InputLabelProps={{ shrink: true }}
            value={createActionForm.fallback_quiz_media}
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
          {createActionForm.labels.length !== 0 && (
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
              value={createActionForm.curr_label}
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
