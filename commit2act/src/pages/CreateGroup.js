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
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Storage, API } from 'aws-amplify';
import { createGroupAndOwner } from '../graphql/mutations';

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

const CreateGroup = ({ user }) => {
  const emptyCreateGroupForm = {
    group_name: '',
    group_description: '',
    group_image: '',
    is_public: true,
    private_password: '',
    showPassword: false,
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
  // const [publicGroup, setPublicGroup] = useState(true);

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

  const handleClickShowPassword = () => {
    setCreateGroupForm({
      ...createGroupForm,
      showPassword: !createGroupForm.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
      let iconLink =
        process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
      if (groupIconFile) {
        let imageType = groupIconFile.type;
        try {
          await Storage.put(imageKey, groupIconFile, {
            contentType: imageType,
          });
        } catch (error) {
          console.log('Error uploading file', error);
        }
      }
      //create the action and get its id
      const createGroupRes = await API.graphql({
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

      console.log(createGroupRes);

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
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ my: { xs: '1.5em' } }}>
          Create New Group
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
        }}
      >
        <FormControl>
          <Grid
            container
            // columnSpacing={{ xs: 2, md: 10 }}
            direction={{ xs: 'column', md: 'row' }}
            columnSpacing={8}
          >
            <Grid item xs={6}>
              <Typography variant="h3">Group Name</Typography>
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
              <Typography variant="h3">Group Icon</Typography>
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
              <Typography variant="h3">Group Description</Typography>
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
            <Grid item xs={5}>
              <Typography variant="h3">Group Privacy</Typography>
              <RadioGroup
                aria-labelledby="group-privacy-label"
                defaultValue="public"
                name="group-privacy-options"
                required
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Public"
                  onClick={() =>
                    setCreateGroupForm({
                      ...createGroupForm,
                      is_public: true,
                    })
                  }
                />
                <FormControlLabel
                  value="private"
                  control={<Radio />}
                  label="Private"
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
                  type={createGroupForm.showPassword ? 'password' : 'text'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {createGroupForm.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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
    </ThemeProvider>
  );
};

export default CreateGroup;
