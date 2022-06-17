import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  LinearProgress,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
  FormGroup,
  CircularProgress,
  DialogTitle,
  DialogContent,
  Dialog,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import { createGroupAndOwner } from '../graphql/mutations';
import { getAllGroups } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';

const Input = styled('input')`
  display: none;
`;

const SectionTitle = styled(Typography)`
  margin: 1.5em 0;
`;

const CreateGroup = ({ user }) => {
  const emptyCreateGroupForm = {
    group_name: '',
    group_description: '',
    group_image: '',
    is_public: true,
    private_password: '',
  };
  const [createGroupForm, setCreateGroupForm] = useState(emptyCreateGroupForm);
  const [allGroupNames, setAllGroupNames] = useState();
  const [avatarFile, setAvatarFile] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [emptyGroupNameError, setEmptyGroupNameError] = useState(false);
  const [groupNameTakenError, setGroupNameTakenError] = useState(false);
  const [emptyPasswordError, setEmptyPasswordError] = useState(false);
  const [createGroupSuccess, setCreateGroupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //gets list of all group names to make sure submitted group isn't a duplicate
  useEffect(() => {
    const getGroups = async () => {
      const groupsRes = await API.graphql({ query: getAllGroups });
      const allGroups = groupsRes.data.getAllGroups;
      const groupNames = allGroups.map((group) => group.group_name);
      setAllGroupNames(groupNames);
    };
    getGroups();
  }, []);

  const updateForm = (e) => {
    setCreateGroupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'group_name') {
      if (e.target.value) {
        setEmptyGroupNameError(false);
      }
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  /** functions for uploading an icon */

  const handleAvatarChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarFile(null);
      return;
    }
    const imageFile = e.target.files[0];
    const previewLink = URL.createObjectURL(imageFile);
    setAvatarFile(imageFile);
    setAvatarPreview(previewLink);
  };

  /** functions adding the group */

  const checkRequiredFields = () => {
    const { group_name, private_password, is_public } = createGroupForm;

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

  const submitGroup = async () => {
    try {
      checkRequiredFields();
      setIsLoading(true);
      const { group_name, group_description, is_public, private_password } =
        createGroupForm;
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
      //create the group
      await API.graphql({
        query: createGroupAndOwner,
        variables: {
          owner_user_id: user.user_id,
          group_name: group_name,
          group_description: group_description,
          group_image: iconLink,
          is_public: is_public,
          private_password: private_password,
        },
      });
      const groupName = group_name;
      //clear form and related states
      setCreateGroupForm(emptyCreateGroupForm);
      setEmptyGroupNameError(false);
      setGroupNameTakenError(false);
      setAvatarPreview();
      //render success message
      setCreateGroupSuccess(true);
      setTimeout(() => {
        navigate(`/group-profile/${groupName}`);
      }, 2000);
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

  //once action has been successfully submitted, set loading state to false to remove progress bar
  useEffect(() => {
    createGroupSuccess && setIsLoading(false);
  }, [createGroupSuccess]);

  return (
    <>
      {allGroupNames ? (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{ mt: { xs: '1.5em', sm: '0em' }, mb: '1.5em' }}
            >
              Create New Group
            </Typography>
          </Box>
          <Box
            component={Paper}
            sx={{
              display: 'flex',
              p: '3em',
              justifyContent: 'center',
              flexDirection: 'column',
              overflow: 'initial',
            }}
          >
            <FormGroup>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1em',
                }}
              >
                {avatarPreview ? (
                  <Avatar
                    variant="rounded"
                    sx={{ height: 150, width: 150, alignSelf: 'center' }}
                    alt="Uploaded Group Icon"
                    src={avatarPreview}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      height: 150,
                      width: 150,
                    }}
                  />
                )}
                <label htmlFor="group-icon-image">
                  <Input
                    accept="image/*"
                    id="group-icon-image"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ m: { xs: '1.5em 0 0', md: '0' } }}
                  >
                    Upload Group Icon
                  </Button>
                </label>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1em',
                  mt: '1em',
                }}
              >
                <>
                  {' '}
                  <SectionTitle variant="h4">Group Name</SectionTitle>
                  <TextField
                    required
                    label="Group Name"
                    name="group_name"
                    InputLabelProps={{ shrink: true }}
                    value={createGroupForm.group_name}
                    error={emptyGroupNameError || groupNameTakenError}
                    helperText={
                      (emptyGroupNameError &&
                        'Group Name field must be completed') ||
                      (groupNameTakenError &&
                        'A group already exists with the given name')
                    }
                    onChange={updateForm}
                    sx={{ width: '100%' }}
                  />
                </>
                <>
                  <SectionTitle variant="h4">Group Description</SectionTitle>
                  <TextField
                    multiline
                    rows={4}
                    label="Group description"
                    name="group_description"
                    value={createGroupForm.group_description}
                    InputLabelProps={{ shrink: true }}
                    onChange={updateForm}
                    sx={{ width: '100%' }}
                  />
                </>
                <>
                  {' '}
                  <SectionTitle variant="h4">Group Privacy</SectionTitle>
                  <RadioGroup
                    aria-labelledby="group-privacy-label"
                    defaultValue={createGroupForm.is_public}
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
                      checked={createGroupForm.is_public}
                      onClick={() =>
                        setCreateGroupForm({
                          ...createGroupForm,
                          is_public: true,
                          private_password: '',
                        })
                      }
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Private"
                      checked={!createGroupForm.is_public}
                      onClick={() =>
                        setCreateGroupForm({
                          ...createGroupForm,
                          is_public: false,
                        })
                      }
                    />
                  </RadioGroup>
                  {/* only show private password text field if user selects private group */}
                  {!createGroupForm.is_public && (
                    <TextField
                      label="password"
                      name="private_password"
                      value={createGroupForm.private_password}
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      error={emptyPasswordError}
                      helperText={
                        emptyPasswordError &&
                        'Private groups must have a password'
                      }
                    ></TextField>
                  )}
                </>
              </Box>
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
                  width: '100%',
                  alignSelf: 'center',
                }}
                variant="contained"
                type="submit"
                onClick={submitGroup}
              >
                Create Group
              </Button>
            </FormGroup>
            <Dialog
              aria-labelledby="success-dialog"
              PaperProps={{
                sx: {
                  p: '1em',
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  alignItems: 'center',
                },
              }}
              open={createGroupSuccess}
            >
              <DialogTitle sx={{ textAlign: 'center' }}> Success!</DialogTitle>
              <DialogContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography>
                  You will now be redirected to the group page
                </Typography>
                <CircularProgress sx={{ mt: '2em' }} />
              </DialogContent>
            </Dialog>
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '5em' }}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default CreateGroup;
