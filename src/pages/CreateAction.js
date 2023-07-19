import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  FormControl,
  FormGroup,
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
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import {
  createActionItems,
  createAction,
  createActionValidationLabels,
} from '../graphql/mutations';
import { getAllActions } from '../graphql/queries';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContentTranslationsContext } from '../components/contexts/ContentTranslationsContext';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { updateTranslationWithLangCode } from '../services/translations';

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
  const [allActionNames, setAllActionNames] = useState();
  const [actionForm, setActionForm] = useState(JSON.parse(JSON.stringify(emptyActionForm)));
  const [actionItemsForm, setActionItemsForm] = useState(JSON.parse(JSON.stringify(emptyActionItemForm)));
  const [actionIconFile, setActionIconFile] = useState();
  const [actionIconPreviewLink, setActionIconPreviewLink] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [submitActionSuccess, setSubmitActionSuccess] = useState(false);
  //error states
  const [cO2Error, setCO2Error] = useState(false);
  const [emptyItemFieldError, setEmptyItemFieldError] = useState(false);
  const [emptyActionFieldError, setEmptyActionFieldError] = useState(false);
  const [actionNameTakenError, setActionNameTakenError] = useState(false);
  const [emptyActionItemError, setEmptyActionItemError] = useState(false);
  const [emptyLabelError, setEmptyLabelError] = useState(false);

  //translation states
  const { contentTranslations, setContentTranslations } = useContentTranslationsContext();
  const [frenchActionForm, setFrenchActionForm] = useState(JSON.parse(JSON.stringify(emptyActionForm)));
  const [frenchActionItemsForm, setFrenchActionItemsForm] = useState(JSON.parse(JSON.stringify(emptyActionItemForm)));

  const tabs = [
    'English',
    'French',
  ];

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  //gets list of all action names to make sure submitted group isn't a duplicate
  useEffect(() => {
    const getActionNames = async () => {
      const actionsRes = await API.graphql({ query: getAllActions });
      const allActions = actionsRes.data.getAllActions;
      const allNames = allActions.map((action) => action.action_name);
      setAllActionNames(allNames);
    };
    getActionNames();
  }, []);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const updateForm = (e) => {
    if (e.target.name in actionItemsForm) {
      setActionItemsForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else {
      setActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const updateFrenchTranslations = (e) => {
    if (e.target.name.replace('_french', '') in frenchActionItemsForm) {
      setFrenchActionItemsForm((prev) => ({
        ...prev,
        [e.target.name.replace('_french', '')]: e.target.value,
      }));
    } else {
      setFrenchActionForm((prev) => ({
        ...prev,
        [e.target.name.replace('_french', '')]: e.target.value
      }));
    }
  }

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

  const removeFrenchActionItem = (index) => {
    let frenchActionItemsCopy = frenchActionForm.action_items;
    frenchActionItemsCopy.splice(index, 1);
    setFrenchActionForm((prev) => ({ ...prev, action_items: frenchActionItemsCopy }));
  }

  /** functions for adding and removing action items */
  const removeActionItem = (name) => {
    let actionItemsCopy = actionForm.action_items;
    let deleteActionItemIndex = actionItemsCopy.findIndex(item => item.item_name === name)

    let filteredActionItems = actionItemsCopy.filter(
      (item) => item.item_name !== name
    );
    setActionForm((prev) => ({
      ...prev,
      action_items: filteredActionItems,
    }));

    removeFrenchActionItem(deleteActionItemIndex);
  };

  const checkRequiredActionItemFields = () => {
    const { item_name, item_description, co2_saved_per_unit } = actionItemsForm;

    if (
      item_name === '' ||
      item_description === '' ||
      co2_saved_per_unit === ''
    ) {
      throw new Error('Empty field');
    }
    if (!co2_saved_per_unit.match(new RegExp('^([1-9]\\d*|0)(\\.\\d+)?$'))) {
      throw new Error('Invalid co2 field');
    }
  };

  const addFrenchActionItems = () => {
    let frenchActionItemsCopy = frenchActionForm.action_items;
    frenchActionItemsCopy.push(frenchActionItemsForm);
    setFrenchActionForm((prev) => ({ ...prev, action_items: frenchActionItemsCopy }));
    //clears the actionItemsForm so user can enter in a new action item
    setFrenchActionItemsForm(emptyActionItemForm);
  }

  const addActionItem = () => {
    try {
      checkRequiredActionItemFields();
      //adds the item from the form into actionItems array
      let actionItemsCopy = actionForm.action_items;
      actionItemsCopy.push(actionItemsForm);
      setActionForm((prev) => ({ ...prev, action_items: actionItemsCopy }));
      //clears the actionItemsForm so user can enter in a new action item
      setActionItemsForm(emptyActionItemForm);
      //reset error states
      if (actionItemsCopy.length > 0) {
        setEmptyActionItemError(false);
      }
      addFrenchActionItems();
      setEmptyItemFieldError(false);
      setCO2Error(false);
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Empty field')) {
        setEmptyItemFieldError(true);
      } else if (errorMsg.includes('Invalid co2 field')) {
        setCO2Error(true);
      }
    }
  };

  /** functions for adding and removing validation labels */

  const removeValidationLabel = (label) => {
    let labelsCopy = actionForm.labels;
    const index = labelsCopy.indexOf(label);
    labelsCopy.splice(index, 1);
    setActionForm((prev) => ({ ...prev, labels: labelsCopy }));
  };

  const removeFrenchValidationLabel = (label) => {
    let labelsCopy = frenchActionForm.labels;
    const index = labelsCopy.indexOf(label);
    labelsCopy.splice(index, 1);
    setFrenchActionForm((prev) => ({ ...prev, labels: labelsCopy }));
  };

  const addFrenchValidationLabel = () => {
    //create array that contains the current label input from the form along with all previous inputted labels
    let labelsCopy = frenchActionForm.labels;
    labelsCopy.push(frenchActionForm.curr_label);
    setFrenchActionForm((prev) => ({ ...prev, labels: labelsCopy, curr_label: '' }));
    if (labelsCopy.length > 0) {
      setEmptyLabelError(false);
    }
  }

  const addValidationLabel = () => {
    //create array that contains the current label input from the form along with all previous inputted labels
    let labelsCopy = actionForm.labels;
    labelsCopy.push(actionForm.curr_label);
    setActionForm((prev) => ({ ...prev, labels: labelsCopy }));
    if (labelsCopy.length > 0) {
      setEmptyLabelError(false);
    }
    //clear current label
    setActionForm((prev) => ({ ...prev, curr_label: '' }));

    if (frenchActionForm.curr_label) {
      addFrenchValidationLabel();
    }
  };

  // /** functions adding the action itself */

  const checkRequiredActionFields = () => {
    const { action_name, labels, action_items } = actionForm;
    if (action_name === '') {
      throw new Error('Empty name');
    } else if (allActionNames.includes(action_name)) {
      throw new Error('Action name taken');
    }
    if (labels.length === 0) {
      throw new Error('Missing labels');
    } else if (action_items.length === 0) {
      throw new Error('Missing action items');
    }
  };


  const updateTranslationsInS3 = async (frenchActionFormToSubmit) => {
    const updateFrenchTranslationsJson = async (translationObject) => {
      translationObject.translationJSON?.actions?.push(frenchActionFormToSubmit);
      await updateTranslationWithLangCode('fr', translationObject.translationJSON);

      setContentTranslations((prev) => {
        return prev.map((translation) => {
          if (translation.langCode === 'fr') {
            return {
              ...translation,
              translationJSON: translationObject.translationJSON,
            };
          }
          return translation;
        });
      });
    }

    for (const translationObject of contentTranslations) {
      if (translationObject.langCode === 'fr') {
        await updateFrenchTranslationsJson(translationObject);
      }
    }
  }

  const submitAction = async () => {
    try {
      checkRequiredActionFields();
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
      // add translations here
      let frenchActionFormToSubmit = JSON.parse(JSON.stringify({ ...frenchActionForm, action_id: actionId }));
      await updateTranslationsInS3(frenchActionFormToSubmit);

      //clear form and related states
      setActionForm(JSON.parse(JSON.stringify(emptyActionForm)));
      setFrenchActionForm(JSON.parse(JSON.stringify(emptyActionForm)));
      setActionIconPreviewLink();
      setActionNameTakenError(false);
      setEmptyActionFieldError(false);
      setEmptyLabelError(false);
      setEmptyActionItemError(false);
      //render success message
      setSubmitActionSuccess(true);
    } catch (e) {
      setIsLoading(false);
      const errorMsg = e.message;
      if (!errorMsg) {
        console.error(e);
        setEmptyActionFieldError(true);
      }
      if (errorMsg.includes('Action name taken')) {
        setActionNameTakenError(true);
      } else if (errorMsg.includes('Empty field')) {
        setEmptyActionFieldError(true);
      } else if (errorMsg.includes('Missing labels')) {
        setEmptyLabelError(true);
      } else if (errorMsg.includes('Missing action items')) {
        setEmptyActionItemError(true);
      }
    }
  };

  //once action has been successfully submitted, set loading state to false to remove progress bar
  useEffect(() => {
    submitActionSuccess && setIsLoading(false);
  }, [submitActionSuccess]);

  const renderAddedActionItems = () => {
    return (
      actionForm.action_items &&
      actionForm.action_items.map((item, index) => (
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
            <TabContext value={selectedTab}>
              <TabList
                onChange={handleTabChange}
                aria-label="update action tab"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
              >
                <Tab label={tabs[0]} value={tabs[0]} />
                <Tab label={tabs[1]} value={tabs[1]} />
              </TabList>
              <TabPanel value={tabs[0]} aria-label='english translation tab'>
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
              </TabPanel>
              <TabPanel value={tabs[1]} aria-label='french translation tab'>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Name" secondary={frenchActionForm.action_items.length > 0 ? frenchActionForm.action_items[index].item_name || item.item_name : item.item_name} />
                  </ListItem>
                  <Divider flexItem />
                  <ListItem>
                    <ListItemText
                      primary="Description"
                      secondary={frenchActionForm?.action_items?.length > 0 ? frenchActionForm.action_items[index]?.item_description || item.item_description : item.item_description}
                    />
                  </ListItem>
                  <Divider flexItem />
                  <ListItem>
                    <ListItemText
                      primary="CO2 Saved Per Unit"
                      secondary={frenchActionForm?.action_items?.length > 0 ? frenchActionForm.action_items[index]?.co2_saved_per_unit || item.co2_saved_per_unit : item.co2_saved_per_unit}
                    />
                  </ListItem>
                </List>
              </TabPanel>
            </TabContext>
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

  const renderAddedFrenchLabels = () => {
    return frenchActionForm.labels.map((label, index) => (
      <Chip
        label={label}
        variant="outlined"
        key={index}
        onDelete={() => removeFrenchValidationLabel(label)}
        sx={{ mr: '0.5em' }}
      />
    ));
  };

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h2" component="h1">
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
              {emptyActionFieldError && (
                <Alert severity="error" sx={{ my: '2em' }}>
                  Please fill out all required action fields
                </Alert>
              )}
              <TextField
                required
                label="Action Name"
                name="action_name"
                InputLabelProps={{ shrink: true }}
                value={actionForm.action_name}
                error={actionNameTakenError}
                helperText={
                  actionNameTakenError &&
                  'There is an existing action with this name'
                }
                onChange={updateForm}
                sx={{ width: '100%' }}
              />
              <TextField
                value={frenchActionForm?.action_name || ''}
                InputLabelProps={{ shrink: true }}
                label="Action Name (French)"
                name="action_name_french"
                onChange={updateFrenchTranslations}
                sx={{
                  marginTop: '1em',
                  width: '100%',
                }}
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
                      height: 120,
                      width: 120,
                    }}
                    alt="Uploaded Action Icon"
                    src={actionIconPreviewLink}
                  />
                ) : (
                  <Box
                    component="div"
                    sx={{
                      height: 120,
                      width: 120,
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
              display: emptyActionItemError ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          {renderAddedActionItems()}
          {emptyItemFieldError && (
            <Alert severity="error" sx={{ my: '2em' }}>
              Please fill out all required item fields
            </Alert>
          )}
          <FormGroup
            sx={{
              gap: '1.5em',
              flexDirection: { xs: 'column', md: 'row' },
              mt: actionForm.action_items.length > 0 && '1.5em',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5em'
              }}>
              <Box
                data-fields="action-items-en"
              >
                <TextField
                  required
                  label="Item Name"
                  name="item_name"
                  InputLabelProps={{ shrink: true }}
                  value={actionItemsForm.item_name}
                  onChange={updateForm}
                />
                <TextField
                  required
                  label="Item Description"
                  name="item_description"
                  InputLabelProps={{ shrink: true }}
                  value={actionItemsForm.item_description}
                  onChange={updateForm}
                />
                <TextField
                  required
                  label="CO2 Per Unit Saved"
                  name="co2_saved_per_unit"
                  inputProps={{ inputMode: 'numeric' }}
                  InputLabelProps={{ shrink: true }}
                  value={actionItemsForm.co2_saved_per_unit}
                  error={cO2Error}
                  helperText={cO2Error && 'Input must be a number greater than 0'}
                  sx={{ xs: { mt: '1.5em' } }}
                  onChange={updateForm}
                />
              </Box>
              <Box
                data-fields="action-items-fr"
              >
                <TextField
                  label="Item Name (French)"
                  name="item_name_french"
                  InputLabelProps={{ shrink: true }}
                  value={frenchActionItemsForm.item_name}
                  onChange={updateFrenchTranslations}
                />
                <TextField
                  label="Item Description (French)"
                  name="item_description_french"
                  InputLabelProps={{ shrink: true }}
                  value={frenchActionItemsForm.item_description}
                  onChange={updateFrenchTranslations}
                />

                <TextField
                  label="CO2 Per Unit Saved (French)"
                  name="co2_saved_per_unit_french"
                  inputProps={{ inputMode: 'numeric' }}
                  InputLabelProps={{ shrink: true }}
                  disabled={true}
                  value={actionItemsForm.co2_saved_per_unit}
                  error={cO2Error}
                  sx={{ xs: { mt: '1.5em' } }}
                />
              </Box>
            </Box>
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
          <TextField
            label="Text (French)"
            name="fallback_quiz_media_french"
            InputLabelProps={{ shrink: true }}
            value={frenchActionForm.fallback_quiz_media}
            onChange={updateFrenchTranslations}
            sx={{ marginTop: '0.5em' }}
          />
          <SectionTitle variant="h3">Image Validation Labels</SectionTitle>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              color: '#d32f2f',
              mb: '2em',
              display: emptyLabelError ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 image validation label
          </Typography>
          {actionForm.labels.length !== 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                mb: frenchActionForm.labels.length !== 0 ? '0.25em' : '1.5em',
                width: { xs: '30%', sm: '80%' },
              }}
            >
              {renderAddedLabels()}
            </Box>
          )}
          {frenchActionForm.labels.length !== 0 && (
            <>
              <Typography
                variant="subtitle1"
                component="span"
                sx={{
                  mb: '0.25em',
                }}
              >
                Labels (French)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  mb: '1.5em',
                  width: { xs: '30%', sm: '80%' },
                }}
              >
                {renderAddedFrenchLabels()}
              </Box>
            </>
          )}
          <FormGroup
            sx={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} gap={4} marginRight={'0.5em'} flexGrow={1} maxWidth={'75%'}>
              <TextField
                required
                label="Label"
                name="curr_label"
                value={actionForm.curr_label}
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1 }}
                onChange={updateForm}
              />

              <TextField
                required
                label="Label French"
                name="curr_label_french"
                value={frenchActionForm.curr_label}
                InputLabelProps={{ shrink: true }}
                sx={{ flexGrow: 1 }}
                onChange={updateFrenchTranslations}
              />

            </Box>
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
              mb: '2em',
              width: '100%',
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
