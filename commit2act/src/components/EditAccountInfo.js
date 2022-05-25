import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  FormGroup,
  Button,
  TextField,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { updateUser } from '../graphql/mutations';
import { Storage, API, Auth } from 'aws-amplify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PasswordRequirements from './authentication/PasswordRequirements';

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  color: #455a7f;
  font-weight: 300;
`;

const Input = styled('input')`
  display: none;
`;

// async function updateUser() {
//     const user = await Auth.currentAuthenticatedUser();
//     await Auth.updateUserAttributes(user, {
//       'address': '105 Main St. New York, NY 10001'
//     });
//   }

const EditAccountInfo = ({
  open,
  databaseUser,
  setEditUser,
  getCurrentDatabaseUser,
}) => {
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState();
  const [newAvatarUploaded, setNewAvatarUploaded] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);
  const [accountEmailExistError, setAccountEmailExistError] = useState(false);
  const [currentPassIncorrectError, setCurrentPassIncorrectError] =
    useState(false);
  const [passwordsNotMatchError, setPasswordsNotMatchError] = useState(false);
  const [accountPasswordError, setAccountPasswordError] = useState(false);
  const initialUserForm = {
    name: databaseUser.name,
    email: databaseUser.email,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const [userInfoForm, setUserInfoForm] = useState(initialUserForm);
  const [passwordRequirements, setPasswordRequirements] = useState({
    uppercase: { error: false, description: 'At least one uppercase letter' },
    lowercase: { error: false, description: 'At least one lowercase letter' },
    digit: { error: false, description: 'At least one digit' },
    special: { error: false, description: 'At least one special character' },
    minLength: {
      error: false,
      description: 'Should be more than 8 characters',
    },
    maxLength: {
      error: false,
      description: 'Should be less than 16 characters',
    },
  });

  //closes dialog, resets states
  const handleClose = () => {
    setPasswordRequirements(() => {
      passwordRequirements.uppercase.error = false;
      passwordRequirements.lowercase.error = false;
      passwordRequirements.digit.error = false;
      passwordRequirements.special.error = false;
      passwordRequirements.minLength.error = false;
      passwordRequirements.maxLength.error = false;

      return passwordRequirements;
    });
    setInvalidEmailError(false);
    setAccountEmailExistError(false);
    setCurrentPassIncorrectError(false);
    setAccountPasswordError(false);
    setUserInfoForm(initialUserForm);
    setEditUser(false);
  };

  const updateForm = (e) => {
    setUserInfoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangePassword = (e) => {
    const currPW = e.target.value;
    setPasswordRequirements(() => {
      passwordRequirements.uppercase.error = /[A-Z]/.test(currPW);
      passwordRequirements.lowercase.error = /[a-z]/.test(currPW);
      passwordRequirements.digit.error = /[0-9]/.test(currPW);
      passwordRequirements.special.error = /[^A-Za-z0-9]/.test(currPW);
      passwordRequirements.minLength.error = currPW.length > 8;
      passwordRequirements.maxLength.error = currPW.length <= 16;

      return passwordRequirements;
    });

    updateForm(e);
  };

  //sends selected image to s3 storage
  async function handleAvatarChange(e) {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarPreview(null);
      return;
    }
    const imageFile = e.target.files[0];
    const previewLink = URL.createObjectURL(imageFile);
    setAvatarFile(imageFile);
    setAvatarPreview(previewLink);
  }

  const updateUserInfo = async () => {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      userInfoForm;

    try {
      //update user in cognito
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(cognitoUser, {
        name: name,
        email: email,
      });
      if (
        newPassword === confirmNewPassword &&
        newPassword !== '' &&
        confirmNewPassword !== ''
      ) {
        await Auth.changePassword(cognitoUser, currentPassword, newPassword);
      }
      //   } else {
      //     setPasswordsNotMatchError(true);
      //   }

      //handle updating user avatar
      let userAvatarLink;
      if (avatarFile) {
        const imageKey = 'avatars/'.concat(databaseUser.user_id, 'avatar');
        const imageType = avatarFile.type;
        userAvatarLink =
          process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
        try {
          await Storage.put(imageKey, avatarFile, {
            contentType: imageType,
          });
        } catch (error) {
          console.log('Error uploading file', error);
        }
      }
      //update user in db
      await API.graphql({
        query: updateUser,
        variables: {
          user_id: databaseUser.user_id,
          name: name,
          email: email,
          avatar: userAvatarLink ? userAvatarLink : databaseUser.avatar,
        },
      });
      getCurrentDatabaseUser(databaseUser.user_id);
      handleClose();
    } catch (e) {
      console.log(e.message);
      if (e.message.includes('given email already exists')) {
        setAccountEmailExistError(true);
      } else if (e.message.includes('Invalid email address format')) {
        setInvalidEmailError(true);
      } else if (e.message.includes('Incorrect username or password')) {
        setCurrentPassIncorrectError(true);
      } else {
        setAccountPasswordError(true);
      }
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <Dialog
      aria-labelledby="action-card-dialog"
      PaperProps={{ sx: { minWidth: '70%' } }}
      open={open}
    >
      <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      <StyledDialogTitle sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
        Edit Account Information
      </StyledDialogTitle>
      <DialogContent
        sx={{
          p: '3em',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'initial',
        }}
      >
        <FormGroup
          sx={{
            mt: '1em',
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
            }}
          >
            <Avatar
              variant="rounded"
              src={
                databaseUser.avatar && !newAvatarUploaded
                  ? databaseUser.avatar
                  : avatarPreview
              }
              sx={{
                width: 100,
                height: 100,
              }}
            ></Avatar>
            <label htmlFor="user-avatar">
              <Input
                accept="image/*"
                id="user-avatar"
                multiple
                type="file"
                onChange={handleAvatarChange}
              />
              <Button
                variant="outlined"
                component="span"
                sx={{ mt: '1em', mb: { xs: '1.5em' } }}
              >
                Upload Photo
              </Button>
            </label>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1em',
            }}
          >
            <TextField
              required
              label="Name"
              name="name"
              value={userInfoForm.name}
              InputLabelProps={{ shrink: true }}
              onChange={updateForm}
            />
            <TextField
              required
              label="Email"
              name="email"
              value={userInfoForm.email}
              InputLabelProps={{ shrink: true }}
              sx={{ xs: { mt: '1.5em' } }}
              onChange={updateForm}
              error={accountEmailExistError || invalidEmailError}
              helperText={
                (accountEmailExistError &&
                  'An account with the given email already exists.') ||
                (invalidEmailError && 'Please enter a valid email.')
              }
            />
            <TextField
              required
              label="Current Password"
              name="currentPassword"
              value={userInfoForm.password}
              InputLabelProps={{ shrink: true }}
              type={showCurrentPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showCurrentPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ xs: { mt: '1.5em' } }}
              onChange={updateForm}
              error={currentPassIncorrectError}
              helperText="Current password is incorrect"
            />
            <TextField
              required
              label="New Password"
              name="newPassword"
              value={userInfoForm.password}
              InputLabelProps={{ shrink: true }}
              type={showNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ xs: { mt: '1.5em' } }}
              onChange={onChangePassword}
              error={accountPasswordError}
              helperText={'Your password must have the following:'}
            />
            <PasswordRequirements requirements={passwordRequirements} />

            <TextField
              required
              label="Confirm New Password"
              name="confirmNewPassword"
              value={userInfoForm.confirmPassword}
              InputLabelProps={{ shrink: true }}
              type={showConfirmNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmNewPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ xs: { mt: '1.5em' } }}
              onChange={onChangePassword}
              error={passwordsNotMatchError}
              helperText={passwordsNotMatchError && 'Passwords do not match.'}
            />
          </Box>
          <Button
            variant="outlined"
            sx={{
              mt: { xs: '1.5em', sm: '0em' },
            }}
            onClick={updateUserInfo}
          >
            Update User Info
          </Button>
        </FormGroup>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountInfo;
