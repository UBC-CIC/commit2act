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
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import { createActionItems, createAction } from '../graphql/mutations';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: '#112D4E',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 400,
            margin: '1.5em 0',
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 18,
            color: '#112D4E',
            fontWeight: 400,
            margin: '1em 1em 0 0',
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 18,
            color: 'black',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: '0.75rem',
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const Input = styled('input')({
  display: 'none',
});

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
    } else {
      setCreateActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
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

  useEffect(() => {
    //if the required inputs are valid and there is no error, continue and add the item
    if (
      isValid.co2Valid &&
      isValid.itemNameValid &&
      isValid.itemDescriptionValid
    ) {
      addActionItem();
      setIsValid((prev) => ({
        ...prev,
        co2Valid: false,
        itemNameValid: false,
        actionItemsValid: true,
      }));
      setActionItemFormError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.co2Valid, isValid.itemNameValid, isValid.itemDescriptionValid]);

  const validateActionItem = () => {
    // //checks to see if user input for co2 saved per unit field is a positive numerical value
    if (!actionItemsForm.co2_saved_per_unit.match(/[0-9]*[.,]?[0-9]+/)) {
      setIsValid((prev) => ({
        ...prev,
        co2Valid: false,
      }));
      setActionItemFormError(true);
    } else {
      setIsValid((prev) => ({
        ...prev,
        co2Valid: true,
      }));
    }

    //checks to see if user input for item name field is not null
    if (!actionItemsForm.item_name) {
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

    if (!actionItemsForm.item_description) {
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
  };

  const addActionItem = () => {
    //adds the item from the form into actionItems array
    setActionItems((actionItems) => [...actionItems, actionItemsForm]);
    //clears the actionItemsForm so user can enter in a new action item
    setActionItemsForm(emptyActionItemForm);
  };

  const handleRemoveActionItem = (name) => {
    setActionItems(actionItems.filter((item) => item.item_name !== name));
  };

  /** functions for validating and adding the action itself */

  useEffect(() => {
    //if the required inputs are valid and there is no error, continue and add the item
    if (isValid.actionItemsValid && isValid.actionNameValid) {
      submitAction();
      setIsValid((prev) => ({
        ...prev,
        actionItemsValid: false,
        actionNameValid: false,
      }));
      setFormError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid.actionItemsValid, isValid.actionNameValid]);

  const validateCreateActionForm = () => {
    if (!createActionForm.action_name) {
      setIsValid((prev) => ({
        ...prev,
        actionNameValid: false,
      }));
      setFormError(true);
    } else {
      setIsValid((prev) => ({
        ...prev,
        actionNameValid: true,
      }));
    }

    if (actionItems.length < 1) {
      setIsValid((prev) => ({
        ...prev,
        actionItemsValid: false,
      }));
      setFormError(true);
    } else {
      setIsValid((prev) => ({
        ...prev,
        actionItemsValid: true,
      }));
    }
  };

  const submitAction = async () => {
    setIsLoading(true);

    //if user uploaded an icon image, get the action name to upload the action icon image to s3/cloudfront
    let imageKey = 'actionIcons/'.concat(createActionForm.action_name);
    let iconLink =
      process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
    if (actionIconFile) {
      let imageType = actionIconFile.type;
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
    //create the corresponding items for the action
    await API.graphql({
      query: createActionItems,
      variables: { action_id: actionId, action_items: actionItems },
    });
    //clear form and related states
    setCreateActionForm(emptyCreateActionForm);
    setActionItems([]);
    setActionIconPreviewLink();
    //render success message
    setSubmitActionSuccess(true);
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
          <Typography variant="h5">
            <Typography variant="h4" component="span">
              Item Name:
            </Typography>
            {item.item_name}
          </Typography>
          <Typography variant="h5">
            <Typography variant="h4" component="span">
              Item Description:
            </Typography>
            {item.item_description}
          </Typography>
          <Typography variant="h5">
            <Typography variant="h4" component="span">
              CO2 Per Unit Saved:
            </Typography>
            {item.co2_saved_per_unit}
          </Typography>
        </Box>
        <Button onClick={() => handleRemoveActionItem(item.item_name)}>
          <HighlightOff fontSize="large" />
        </Button>
      </Card>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ my: { xs: '1.5em' } }}>
          Create New Action Type
        </Typography>
      </Box>
      <Grid
        container
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          minHeight: '50vh',
          backgroundColor: '#DBE2EF',
          borderRadius: '8px',
          padding: { xs: '1.5em 1.5em 2em', md: '1.5em 0.5em 2em' },
          justifyContent: 'center',
        }}
      >
        <FormControl>
          <Grid
            container
            spacing={{ xs: 2, md: 12 }}
            direction={{ xs: 'column', md: 'row' }}
          >
            <Grid item xs={6}>
              <Typography variant="h3">Action Name</Typography>
              <TextField
                required
                id="outlined-required"
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
              <Typography variant="h3">Action Icon</Typography>
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
                      height: 80,
                      width: 80,
                    }}
                    alt="Uploaded Action Icon"
                    src={actionIconPreviewLink}
                  />
                ) : (
                  <Box
                    component="div"
                    sx={{
                      height: 80,
                      width: 80,
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
          <Typography variant="h3">Action Items</Typography>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              display:
                formError && !isValid.actionItemsValid ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          <FormGroup
            sx={{
              mt: '1.5em',
              gap: '1.5em',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <TextField
              required
              id="outlined-required"
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
              id="outlined-required"
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
            <Button variant="outlined" onClick={validateActionItem}>
              Add Action Item
            </Button>
          </FormGroup>
          {renderAddedActionItems()}
          <Typography variant="h3">Fallback Text</Typography>
          <TextField
            label="Text"
            name="fallback_quiz_media"
            InputLabelProps={{ shrink: true }}
            value={createActionForm.fallback_quiz_media}
            onChange={updateForm}
          />
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
            onClick={validateCreateActionForm}
          >
            Submit New Action
          </Button>
        </FormControl>
        <Snackbar
          open={submitActionSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2000}
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
    </ThemeProvider>
  );
};

export default CreateAction;
