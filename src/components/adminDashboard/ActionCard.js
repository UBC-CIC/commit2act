import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  Tab,
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
import { useContentTranslationsContext } from '../contexts/ContentTranslationsContext';
import { updateTranslationWithLangCode } from '../../services/translations';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Input = styled('input')`
  display: none;
`;

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
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
  const {
    action_icon,
    action_name,
    action_id,
    validation_labels,
    is_hidden,
    fallback_quiz_media,
  } = action;

  const initialActionForm = {
    action_name: action_name,
    fallback_quiz_media: fallback_quiz_media,
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

  const tabs = [
    'English',
    'French',
  ];

  const [actionForm, setActionForm] = useState(initialActionForm);
  const [actionItemsForm, setActionItemsForm] = useState(emptyActionItemForm);
  const [showCloseWarning, setShowCloseWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showPauseWarning, setShowPauseWarning] = useState(false);
  const [actionIconFile, setActionIconFile] = useState();
  const [actionIconPreviewLink, setActionIconPreviewLink] = useState();
  //error states
  const [cO2Error, setCO2Error] = useState(false);
  const [emptyItemFieldError, setEmptyItemFieldError] = useState(false);
  const [emptyActionItemError, setEmptyActionItemError] = useState(false);
  const [emptyLabelError, setEmptyLabelError] = useState(false);

  const { contentTranslations, setContentTranslations } = useContentTranslationsContext();
  const [relevantFrenchAction, setRelevantFrenchAction] = useState(emptyActionItemForm);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  //get all action items for the action
  useEffect(() => {
    const getActionItems = async () => {
      const res = await API.graphql({
        query: getActionItemsForAction,
        variables: { action_id: action_id },
      });

      const actionItemsWithIndex = res.data.getActionItemsForAction.map((actionItem, index) => {
        return actionItem = { ...actionItem, index: index };
      });

      setActionForm((prev) => ({
        ...prev,
        action_items: actionItemsWithIndex,
      }));

      // load all translations for the action
      const frenchTranslations = contentTranslations.find((translation) => translation.langCode === 'fr');
      if (frenchTranslations) {
        let frenchAction = frenchTranslations.translationJSON?.actions?.find((action) => action.action_id === action_id);
        if (frenchAction) {
          if (frenchAction.action_items) {
            // if frenchAction already has action_items
            setRelevantFrenchAction(frenchAction);
          } else if (actionItemsWithIndex.length > 0) {
            // if frenchAction does not have action_items but actionItemsWithIndex has action_items
            frenchAction.action_items = actionItemsWithIndex.map((actionItem) => {
              return { ...emptyActionItemForm, index: actionItem.index }
            })
            setRelevantFrenchAction(frenchAction);
          } else {
            // if frenchAction does not have action_items and actionItemsWithIndex does not have action_items
            frenchAction.action_items = [];
            setRelevantFrenchAction(frenchAction);
          }
        } else {
          let emptyActionInit = initialActionForm;
          emptyActionInit.action_items = actionItemsWithIndex.map((actionItem) => {
            return { ...emptyActionItemForm, index: actionItem.index }
          })
          setRelevantFrenchAction(emptyActionInit);
        }
      }
    };
    getActionItems();
  }, [action_id]);

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
          <Typography variant="h3">Fallback Text</Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              mt: '1em',
            }}
          >
            {action.fallback_quiz_media
              ? action.fallback_quiz_media
              : 'There is currently no fallback text.'}
          </Box>
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
          <Button onClick={() => unPauseAction()} variant="contained">
            Restore Action
          </Button>
        ) : (
          <Button onClick={() => setEditAction(true)} variant="contained">
            Edit Action
          </Button>
        )}
      </Box>
    );
  };

  const updateActionItemWithNewValue = (event) => {
    let updatedActionItemIndex = event.target.attributes.index.value;

    return actionForm.action_items.map((item) => {
      if (item.index === parseInt(updatedActionItemIndex)) {
        if (event.target.name.includes('item_name')) {
          return {
            ...item,
            item_name: event.target.value,
          };
        } else if (event.target.name.includes('item_description')) {
          return {
            ...item,
            item_description: event.target.value,
          };
        } else if (event.target.name.includes('item_co2')) {
          return {
            ...item,
            co2_saved_per_unit: event.target.value,
          };
        }
      }
      return item;
    });
  }

  const updateActionItemTranslationWithNewValue = (event, relevantTranslationObject) => {
    let updatedActionItemIndex = event.target.attributes.index.value;
    return relevantTranslationObject.action_items?.map((item) => {
      if (item.index === parseInt(updatedActionItemIndex)) {
        if (event.target.name.includes('item_name')) {
          return {
            ...item,
            item_name: event.target.value,
          };
        } else if (event.target.name.includes('item_description')) {
          return {
            ...item,
            item_description: event.target.value,
          };
        } else if (event.target.name.includes('item_co2')) {
          return {
            ...item,
            co2_saved_per_unit: event.target.value,
          };
        }
      }
      return item;
    });
  }

  /** functions for rendering the editable action card */
  const updateForm = (e) => {
    e.preventDefault();
    if (e.target.name in actionItemsForm) {
      setActionItemsForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else if (e.target.name.includes('edit')) {
      let updatedActionItems = updateActionItemWithNewValue(e)
      setActionForm((prev) => ({
        ...prev,
        action_items: updatedActionItems,
      }));
    } else {
      setActionForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const updateTranslations = (e) => {
    e.preventDefault();
    if (e.target.name.includes('french')) {
      if (e.target.name.includes('edit')) {
        let updatedActionItems = updateActionItemTranslationWithNewValue(e, relevantFrenchAction)
        setRelevantFrenchAction((prev) => ({
          ...prev, action_items: updatedActionItems
        }))
      } else {
        setRelevantFrenchAction(
          {
            ...relevantFrenchAction,
            [e.target.name.replace('_french', '')]: e.target.value
          })
      }
    }
  }

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

  const addActionItem = () => {
    try {
      checkRequiredActionItemFields();
      actionItemsForm.co2_saved_per_unit = Number(
        actionItemsForm.co2_saved_per_unit
      );
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
      setEmptyItemFieldError(false);
      setCO2Error(false);
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Invalid co2 field')) {
        setCO2Error(true);
      } else if (errorMsg.includes('Empty field')) {
        setEmptyItemFieldError(true);
      }
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
    if (labelsCopy.length > 0) {
      setEmptyLabelError(false);
    }
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

  const checkRequiredActionFields = () => {
    const { labels, action_items } = actionForm;
    if (labels.length === 0) {
      throw new Error('Missing labels');
    } else if (action_items.length === 0) {
      throw new Error('Missing action items');
    }
  };

  const updateTranslationsJsonActionsWithinAllTranslations = (translationJSON) => {
    if (!translationJSON.actions) translationJSON.actions = [];

    let relevantActionIndex = translationJSON.actions?.findIndex((action) => action.action_id === action_id);
    if (relevantActionIndex > -1) {
      translationJSON.actions[relevantActionIndex] = { ...relevantFrenchAction };
    } else {
      translationJSON.actions.push({
        action_id: action_id,
        ...relevantFrenchAction
      })
    }
  }

  const updateFrenchTranslationsJson = async () => {
    for (const translationObject of contentTranslations) {
      if (translationObject.langCode === 'fr') {
        await updateTranslationsJsonActionsWithinAllTranslations(translationObject.translationJSON);
        await updateTranslationWithLangCode('fr', translationObject.translationJSON)
      }
    }
    setContentTranslations(...contentTranslations)
  }

  const updateSelectedAction = async () => {
    updateFrenchTranslationsJson();
    try {
      checkRequiredActionFields();
      //update icon image in s3 if user uploaded a new image
      let iconLink = null;
      if (actionIconFile) {
        let imageType = actionIconFile.type;
        let imageKey = 'actionIcons/' + actionForm.action_name;
        iconLink = process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME + imageKey;
        try {
          await Storage.put(imageKey, actionIconFile, {
            contentType: imageType,
          });
        } catch (error) {
          console.log('Error uploading file', error);
        }
      }

      // remove index from action_items
      let actionItemsWithoutIndex = actionForm.action_items;
      actionItemsWithoutIndex.forEach((item) => {
        delete item.index;
      });

      await Promise.all([
        API.graphql({
          query: updateAction,
          variables: {
            action_id: action_id,
            action_name: actionForm.action_name,
            fallback_quiz_media: actionForm.fallback_quiz_media,
            action_icon: actionIconFile ? iconLink : action_icon,
          },
        }),
        API.graphql({
          query: remakeActionItems,
          variables: {
            action_id: action_id,
            action_items: actionItemsWithoutIndex,
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
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Missing labels')) {
        setEmptyLabelError(true);
      } else if (errorMsg.includes('Missing action items')) {
        setEmptyActionItemError(true);
      }
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

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
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
              display: emptyActionItemError ? 'inline' : 'none',
            }}
          >
            New Action Type must have at least 1 action item
          </Typography>
          {actionForm.action_items &&
            actionForm.action_items.map((item) => (
              <Accordion key={item.index}>
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
                    <TabPanel value={tabs[0]}>
                      <List dense>
                        <ListItem>
                          <TextField
                            required
                            value={item.item_name}
                            label="Name"
                            name='item_name_edit'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateForm}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                        <Divider flexItem sx={{ marginY: '5px' }} />
                        <ListItem>
                          <TextField
                            required
                            value={item.item_description}
                            label="Description"
                            name='item_description_edit'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateForm}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                        <Divider flexItem sx={{ marginY: '5px' }} />
                        <ListItem>
                          <TextField
                            required
                            value={item.co2_saved_per_unit}
                            label="CO2 Saved Per Unit"
                            name='item_co2_edit'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateForm}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                      </List>
                    </TabPanel>
                    <TabPanel value={tabs[1]}>
                      <List dense>
                        <ListItem>
                          <TextField
                            required
                            value={relevantFrenchAction.action_items ? relevantFrenchAction.action_items[item.index]?.item_name : ''}
                            label="Name"
                            name='item_name_edit_french'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateTranslations}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                        <Divider flexItem sx={{ marginY: '5px' }} />
                        <ListItem>
                          <TextField
                            required
                            value={relevantFrenchAction.action_items ? relevantFrenchAction.action_items[item.index]?.item_description : ''}
                            label="Description"
                            name='item_description_edit_french'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateTranslations}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                        <Divider flexItem sx={{ marginY: '5px' }} />
                        <ListItem>
                          <TextField
                            required
                            value={relevantFrenchAction.action_items ? relevantFrenchAction.action_items[item.index]?.co2_saved_per_unit : ''}
                            label="CO2 Saved Per Unit"
                            name='item_co2_edit_french'
                            property=''
                            inputProps={{ 'index': item.index }}
                            onChange={updateTranslations}
                            sx={{ width: '100%' }}
                          />
                        </ListItem>
                      </List>
                    </TabPanel>
                  </TabContext>
                </AccordionDetails>
              </Accordion>
            ))}
          {emptyItemFieldError && (
            <Alert severity="error" sx={{ my: '2em' }}>
              Please fill out all required item fields
            </Alert>
          )}
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
          <Typography variant="h3">Fallback Text</Typography>
          <TextField
            required
            name="fallback_quiz_media"
            value={actionForm.fallback_quiz_media}
            multiline
            InputProps={{
              style: { fontSize: 15, fontWeight: 100, color: 'black' },
            }}
            InputLabelProps={{ shrink: true }}
            sx={{ width: '100%', mt: '1em' }}
            onChange={updateForm}
          />
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
              display: emptyLabelError ? 'inline' : 'none',
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
                mt: { xs: '1.5em', md: '0em' },
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
              color="error"
              onClick={() => setShowDeleteWarning(true)}
            >
              Delete Action
            </Button>
            <Button
              variant="outlined"
              color="error"
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
        {
          editAction ? (
            <>
              <TextField
                required
                value={actionForm.action_name}
                InputLabelProps={{ shrink: true }}
                label="Action Name"
                name="action_name"
                onChange={updateForm}
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  fontSize: '28px',
                  fontWeight: '300',
                  marginLeft: '1em',
                  marginRight: '1em',
                }}
              />

              <TextField
                value={relevantFrenchAction?.action_name || ''}
                InputLabelProps={{ shrink: true }}
                label="Action Name (French)"
                name="action_name_french"
                onChange={updateTranslations}
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  fontSize: '28px',
                  fontWeight: '300',
                  marginTop: '1em',
                  marginLeft: '1em',
                  marginRight: '1em',
                }}
              />

            </>

          ) : (
            <StyledDialogTitle sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              {action_name}
            </StyledDialogTitle>
          )
        }
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
          <Button variant="outlined" color="error" onClick={() => deleteSelectedAction()}>
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
