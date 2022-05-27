import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  Alert,
  LinearProgress,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import { createGroupAndOwner } from '../graphql/mutations';

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
  const [isValid, setIsValid] = useState({
    groupNameValid: false,
  });
  const [groupIconFile, setGroupIconFile] = useState();
  const [groupIconPreviewLink, setGroupIconPreviewLink] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(false);
  const [createGroupSuccess, setCreateGroupSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateForm = (e) => {
    setCreateGroupForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (e.target.name === 'group_name') {
      if (!e.target.value) {
        setIsValid((prev) => ({
          ...prev,
          groupNameValid: false,
        }));
        setFormError(true);
      } else {
        setIsValid((prev) => ({
          ...prev,
          groupNameValid: true,
        }));
      }
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  /** functions for uploading an icon */

  const handleIconUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setGroupIconFile(null);
      return;
    }
    let imageFile = e.target.files[0];
    let previewLink = URL.createObjectURL(imageFile);
    setGroupIconFile(imageFile);
    setGroupIconPreviewLink(previewLink);
  };

  /** functions adding the group */

  const submitGroup = async () => {
    if (isValid.groupNameValid) {
      setIsLoading(true);

      //if user uploaded an icon image, get the action name to upload the action icon image to s3/cloudfront
      let imageKey = 'groupIcons/'.concat(createGroupForm.group_name);
      let iconLink = null;
      if (groupIconFile) {
        let imageType = groupIconFile.type;
        iconLink =
          process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
        try {
          await Storage.put(imageKey, groupIconFile, {
            contentType: imageType,
          });
        } catch (error) {
          console.log('Error uploading file', error);
        }
      }
      //create the action and get its id
      await API.graphql({
        query: createGroupAndOwner,
        variables: {
          owner_user_id: user.user_id,
          group_name: createGroupForm.group_name,
          group_description: createGroupForm.group_description,
          group_image: iconLink,
          is_public: createGroupForm.is_public,
          private_password: createGroupForm.private_password,
        },
      });

      //clear form and related states
      setCreateGroupForm(emptyCreateGroupForm);
      setGroupIconPreviewLink();
      setFormError(false);
      //render success message
      setCreateGroupSuccess(true);
    } else {
      setFormError(true);
    }
  };

  //once action has been successfully submitted, set loading state to false to remove progress bar
  useEffect(() => {
    createGroupSuccess && setIsLoading(false);
  }, [createGroupSuccess]);

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography
          variant="h1"
          sx={{ mt: { xs: '1.5em', sm: '0em' }, mb: '1.5em' }}
        >
          Create New Group
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
        }}
      >
        <FormControl>
          <Grid
            container
            columnSpacing={{ xs: 2, md: 12 }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ pl: { xs: '0em', md: '4em' } }}
          >
            <Grid item xs={6}>
              <SectionTitle variant="h3">Group Name</SectionTitle>
              <TextField
                required
                label="Group Name"
                name="group_name"
                InputLabelProps={{ shrink: true }}
                value={createGroupForm.group_name}
                error={formError && !isValid.groupNameValid}
                helperText={
                  formError &&
                  !isValid.groupNameValid &&
                  'Group Name field must be completed'
                }
                onChange={updateForm}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={6}>
              <SectionTitle variant="h3">Group Icon</SectionTitle>
              <Box
                component="div"
                display="flex"
                alignItems="center"
                sx={{ flexDirection: { xs: 'column', md: 'row' } }}
              >
                {groupIconPreviewLink ? (
                  <Box
                    component="img"
                    sx={{
                      height: 70,
                      width: 70,
                    }}
                    alt="Uploaded Group Icon"
                    src={groupIconPreviewLink}
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
                <label htmlFor="group-icon-image">
                  <Input
                    accept="image/*"
                    id="group-icon-image"
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
            <Grid item xs={6}>
              <SectionTitle variant="h3">Group Description</SectionTitle>
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
            </Grid>
            <Grid item xs={6}>
              <SectionTitle variant="h3">Group Privacy</SectionTitle>
              <RadioGroup
                aria-labelledby="group-privacy-label"
                defaultValue={createGroupForm.is_public}
                name="group-privacy-options"
                required
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Public"
                  checked={createGroupForm.is_public === true}
                  onClick={() =>
                    setCreateGroupForm({
                      ...createGroupForm,
                      is_public: true,
                    })
                  }
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Private"
                  checked={createGroupForm.is_public === false}
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              )}
            </Grid>
          </Grid>
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
            onClick={submitGroup}
          >
            Create Group
          </Button>
        </FormControl>
        <Snackbar
          open={createGroupSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={2000}
          onClose={() => setCreateGroupSuccess(false)}
        >
          <Alert
            onClose={() => setCreateGroupSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Your group has been created!
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
};

export default CreateGroup;
