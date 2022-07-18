import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormGroup,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Storage, API } from 'aws-amplify';
import { updateGroup, deleteGroup } from '../../graphql/mutations';
import { getAllGroups } from '../../graphql/queries';
import { useNavigate } from 'react-router-dom';

const Input = styled('input')`
  display: none;
`;

const EditGroupPanel = ({ groupInfo, getUpdatedGroup }) => {
  const {
    group_description,
    group_image,
    group_name,
    is_public,
    private_password,
    group_id,
  } = groupInfo;
  const initialGroupForm = {
    group_name: group_name,
    group_description: group_description,
    group_image: group_image,
    is_public: is_public,
    private_password: private_password,
  };
  const [groupInfoForm, setGroupInfoForm] = useState(initialGroupForm);
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState();
  const [allGroupNames, setAllGroupNames] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [updateGroupSuccess, setUpdateGroupSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  //error states
  const [emptyGroupNameError, setEmptyGroupNameError] = useState(false);
  const [groupNameTakenError, setGroupNameTakenError] = useState(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);

  const navigate = useNavigate();

  //gets list of all group names
  useEffect(() => {
    const getGroups = async () => {
      const groupsRes = await API.graphql({ query: getAllGroups });
      const allGroups = groupsRes.data.getAllGroups;
      let allNames = allGroups.map((group) => group.group_name);
      //remove current group name from the groupNames array
      allNames = allNames.filter((name) => name !== group_name);
      setAllGroupNames(allNames);
    };
    group_name && getGroups();
  }, [group_name]);

  const updateForm = (e) => {
    setGroupInfoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'group_name') {
      if (e.target.value) {
        setEmptyGroupNameError(false);
      }
    }
  };

  const checkRequiredFields = () => {
    const { group_name, private_password, is_public } = groupInfoForm;
    //checks for empty or existing group name
    if (group_name === '') {
      throw new Error('Empty group name');
    } else if (allGroupNames.includes(group_name)) {
      throw new Error('Group name is taken');
    }
    //check for empty password for private groups
    if (!is_public && private_password === '') {
      throw new Error('Empty password');
    }
  };

  const handleAvatarChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarPreview(null);
      return;
    }
    const imageFile = e.target.files[0];
    const previewLink = URL.createObjectURL(imageFile);
    setAvatarFile(imageFile);
    setAvatarPreview(previewLink);
  };

  const updateGroupInfo = async () => {
    try {
      checkRequiredFields();
      const { group_name, group_description, is_public, private_password } =
        groupInfoForm;

      //if user uploaded an icon image, get the group name to upload the group avatar image to s3/cloudfront
      let imageKey = 'groupIcons/'.concat(group_name);
      let iconLink = null;
      if (avatarFile) {
        let imageType = avatarFile.type;
        iconLink =
          process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
        await Storage.put(imageKey, avatarFile, {
          contentType: imageType,
        });
      }
      await API.graphql({
        query: updateGroup,
        variables: {
          group_id: group_id,
          group_name: group_name,
          group_description: group_description,
          group_image: iconLink,
          is_public: is_public,
          private_password: private_password,
        },
      });
      //clear form and related states
      //render success message
      setUpdateGroupSuccess(true);
      getUpdatedGroup(group_id);
      setEmptyGroupNameError(false);
      setGroupNameTakenError(false);
      setEmptyPasswordError(false);
      setAvatarPreview();
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Empty group name')) {
        setEmptyGroupNameError(true);
      } else if (errorMsg.includes('Group name is taken')) {
        setGroupNameTakenError(true);
      } else if (errorMsg.includes('Empty password')) {
        setEmptyPasswordError(true);
      }
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const deleteCurrentGroup = async () => {
    await API.graphql({
      query: deleteGroup,
      variables: { group_id: group_id },
    });
    setDeleteSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const renderEditGroupForm = () => {
    return (
      <>
        <Typography variant="h2">Edit Group Info</Typography>
        <Box
          sx={{
            p: '1em',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            overflow: 'initial',
          }}
        >
          <FormGroup
            sx={{
              mt: '2em',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1em',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1em',
              }}
            >
              {group_image && !avatarPreview ? (
                <>
                  <Avatar
                    variant="rounded"
                    sx={{ height: 120, width: 120, alignSelf: 'center' }}
                    alt={`${group_name} avatar`}
                    src={group_image + '?' + new Date()}
                  />
                  <label htmlFor="action-icon-image">
                    <Input
                      accept="image/*"
                      id="action-icon-image"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <Button variant="outlined" component="span">
                      Upload Group Icon
                    </Button>
                  </label>
                </>
              ) : (
                <>
                  {avatarPreview ? (
                    <Avatar
                      variant="rounded"
                      sx={{
                        height: 120,
                        width: 120,
                      }}
                      alt="Uploaded Group Icon"
                      src={avatarPreview}
                    />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{
                        height: 120,
                        width: 120,
                      }}
                    />
                  )}

                  <label htmlFor="action-icon-image">
                    <Input
                      accept="image/*"
                      id="action-icon-image"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <Button variant="outlined" component="span">
                      Upload Group Icon
                    </Button>
                  </label>
                </>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
                mt: '1em',
              }}
            >
              <TextField
                required
                label="Name"
                name="group_name"
                value={groupInfoForm.group_name}
                InputLabelProps={{ shrink: true }}
                onChange={updateForm}
                error={emptyGroupNameError || groupNameTakenError}
                helperText={
                  (emptyGroupNameError && 'Field must be completed') ||
                  (groupNameTakenError &&
                    'A group already exists with the given name')
                }
              />
              <TextField
                label="Description"
                name="group_description"
                multiline
                value={
                  groupInfoForm.group_description
                    ? groupInfoForm.group_description
                    : ''
                }
                InputLabelProps={{ shrink: true }}
                sx={{ xs: { mt: '1.5em' } }}
                onChange={updateForm}
              />
              <Typography variant="h7" sx={{ mt: '2em' }}>
                Group Privacy
              </Typography>
              <RadioGroup
                aria-labelledby="group-privacy-label"
                name="group-privacy-options"
                required
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Public"
                  checked={groupInfoForm.is_public === true}
                  onClick={() =>
                    setGroupInfoForm({
                      ...groupInfoForm,
                      is_public: true,
                    })
                  }
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Private"
                  checked={groupInfoForm.is_public === false}
                  onClick={() =>
                    setGroupInfoForm({
                      ...groupInfoForm,
                      is_public: false,
                    })
                  }
                />
              </RadioGroup>
              {/* only show private password text field if user selects private group */}
              {!groupInfoForm.is_public && (
                <TextField
                  label="Password"
                  name="private_password"
                  value={
                    groupInfoForm.private_password
                      ? groupInfoForm.private_password
                      : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  onChange={updateForm}
                  sx={{ mt: '1.5em' }}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={emptyPasswordError}
                  helperText={
                    emptyPasswordError && 'Private groups must have a password'
                  }
                ></TextField>
              )}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: { xs: 'center', sm: 'space-between' },
                  my: '2em',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setShowDeleteWarning(true)}
                >
                  Delete Group
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mt: { xs: '1.5em', sm: '0em' },
                  }}
                  onClick={updateGroupInfo}
                >
                  Save Group Info
                </Button>
              </Box>
            </Box>
          </FormGroup>
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
            {deleteSuccess ? (
              <>
                <DialogTitle sx={{ textAlign: 'center' }}>
                  {' '}
                  Success!
                </DialogTitle>
                <DialogContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Typography>
                    {group_name} has been deleted! <br></br>You will now be
                    directed to the homepage
                  </Typography>
                  <CircularProgress sx={{ mt: '2em' }} />
                </DialogContent>
              </>
            ) : (
              <>
                <DialogTitle>Delete {group_name}?</DialogTitle>
                <WarningAmberIcon fontSize="large" />
                <DialogContent>This is irreversible</DialogContent>
                <DialogActions sx={{ display: 'flex', gap: '2em' }}>
                  <Button
                    variant="contained"
                    onClick={() => setShowDeleteWarning(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => deleteCurrentGroup()}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Box>
      </>
    );
  };

  const renderSuccessMsg = () => {
    return (
      <>
        <Typography variant="h2">Success!</Typography>
        <Typography variant="subtitle2" sx={{ mt: '1em' }}>
          The group has been updated
        </Typography>
      </>
    );
  };

  return updateGroupSuccess ? renderSuccessMsg() : renderEditGroupForm();
};

export default EditGroupPanel;
