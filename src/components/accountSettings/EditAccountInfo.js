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
  Typography,
  InputAdornment,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { updateUser } from '../../graphql/mutations';
import { Storage, API, Auth } from 'aws-amplify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PasswordRequirements from '../authentication/PasswordRequirements';

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 28px;
  color: #455a7f;
  font-weight: 300;
`;

const Input = styled('input')`
  display: none;
`;

const EditAccountInfo = ({
  open,
  databaseUser,
  setEditUser,
  editUser,
  getCurrentDatabaseUser,
}) => {
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);
  const [accountEmailExistError, setAccountEmailExistError] = useState(false);
  const [currentPassIncorrectError, setCurrentPassIncorrectError] =
    useState(false);
  const [passwordsNotMatchError, setPasswordsNotMatchError] = useState(false);
  const [accountPasswordError, setAccountPasswordError] = useState(false);
  const [requiredAttributeError, setRequiredAttributeError] = useState(false);
  const [requiredPasswordError, setRequiredPasswordError] = useState(false);
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
  const [infoUpdateSuccess, setInfoUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

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
    setEditUser(false);

    setInvalidEmailError(false);
    setAccountEmailExistError(false);
    setCurrentPassIncorrectError(false);
    setAccountPasswordError(false);
    setPasswordsNotMatchError(false);
    setRequiredAttributeError(false);
    setRequiredPasswordError(false);
    setUserInfoForm(initialUserForm);
    setInfoUpdateSuccess(false);
    setPasswordUpdateSuccess(false);
  };

  const checkMatchingPasswords = () => {
    if (!userInfoForm.currentPassword) {
      throw new Error('empty');
    } else if (passwordsNotMatchError) {
      throw new Error('Passwords do not match');
    }
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

    // check if "password" is the same as "confirm password"
    if (e.target.name === 'confirmNewPassword') {
      e.target.value === userInfoForm.newPassword
        ? setPasswordsNotMatchError(false)
        : setPasswordsNotMatchError(true);
    }
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
    const { name, email } = userInfoForm;

    if (email === '') {
      setRequiredAttributeError(true);
      return;
    }
    try {
      //update user in cognito
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(cognitoUser, {
        name: name,
        email: email,
      });

      //handle updating user avatar
      console.log(process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME);
      let userAvatarLink;
      if (avatarFile) {
        const imageKey = 'avatars/' + databaseUser.user_id + 'avatar.png';
        const imageType = avatarFile.type;
        userAvatarLink = process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME + imageKey;
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
      setInfoUpdateSuccess(true);
      getCurrentDatabaseUser(databaseUser.user_id);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (e) {
      const errorMsg = e.message;
      console.log(errorMsg);
      if (errorMsg.includes('given email already exists')) {
        setAccountEmailExistError(true);
      } else if (errorMsg.includes('Invalid email address format')) {
        setInvalidEmailError(true);
      } else if (errorMsg.includes('Required attribute cannot be deleted')) {
        setRequiredAttributeError(true);
      }
    }
  };

  const updatePassword = async () => {
    const { currentPassword, newPassword } = userInfoForm;
    try {
      checkMatchingPasswords();
      const cognitoUser = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(cognitoUser, currentPassword, newPassword);

      setPasswordUpdateSuccess(true);
      getCurrentDatabaseUser(databaseUser.user_id);
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (e) {
      const errorMsg = e.message;
      if (errorMsg.includes('Incorrect username or password')) {
        setCurrentPassIncorrectError(true);
      } else if (errorMsg.includes('Passwords do not match')) {
        setPasswordsNotMatchError(true);
      } else if (errorMsg.includes('empty')) {
        setRequiredPasswordError(true);
      } else {
        setAccountPasswordError(true);
      }
    }
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const renderSuccessMsg = () => {
    return (
      <>
        <StyledDialogTitle sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          Success!
        </StyledDialogTitle>
        <DialogContent sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          {infoUpdateSuccess
            ? 'User information has been changed'
            : passwordUpdateSuccess && 'Password has been changed'}
        </DialogContent>
      </>
    );
  };

  const renderEditInfoForm = () => {
    return (
      <>
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
              {databaseUser.avatar && !avatarPreview ? (
                <>
                  <Avatar
                    variant="rounded"
                    sx={{ height: 100, width: 100, alignSelf: 'center' }}
                    alt={`${databaseUser.name} avatar`}
                    src={databaseUser.avatar + '?' + new Date()}
                  />
                  <label htmlFor="action-icon-image">
                    <Input
                      accept="image/*"
                      id="action-icon-image"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <Button variant="outlined" component="span">
                      Upload Profile Photo
                    </Button>
                  </label>
                </>
              ) : (
                <>
                  {avatarPreview ? (
                    <Avatar
                      variant="rounded"
                      sx={{
                        height: 100,
                        width: 100,
                      }}
                      alt="Uploaded Action Icon"
                      src={avatarPreview}
                    />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{
                        height: 100,
                        width: 100,
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
                      Upload Profile Photo
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
              {requiredAttributeError && (
                <Alert severity="error">
                  Please fill out all required fields
                </Alert>
              )}
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
              <Button
                variant="outlined"
                sx={{
                  mt: { xs: '1.5em', sm: '0em' },
                }}
                onClick={updateUserInfo}
              >
                Save Name, Email, Photo
              </Button>
            </Box>
          </FormGroup>
          <FormGroup
            sx={{
              mt: '4em',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1em',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              variant="h7"
              sx={{ mb: '1em', color: '#455A7F', fontWeight: 400 }}
            >
              Change Password
            </Typography>
            {requiredPasswordError && (
              <Alert severity="error">
                Please fill out all required fields
              </Alert>
            )}
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
                      aria-label="toggle current password visibility"
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
              helperText={
                currentPassIncorrectError && 'Current password is incorrect'
              }
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
                      aria-label="toggle new password visibility"
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
                      aria-label="toggle confirm new password visibility"
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
            <Button
              variant="outlined"
              sx={{
                mt: { xs: '1.5em', sm: '0em' },
              }}
              onClick={updatePassword}
            >
              Save Password
            </Button>
          </FormGroup>
        </DialogContent>
      </>
    );
  };

  return (
    <Dialog
      aria-labelledby="action-card-dialog"
      PaperProps={{ sx: { minWidth: '70%' } }}
      open={open}
    >
      {/* render edit info form if password or info has not been successfully updated */}
      {infoUpdateSuccess || passwordUpdateSuccess
        ? renderSuccessMsg()
        : editUser && renderEditInfoForm()}
    </Dialog>
  );
};

export default EditAccountInfo;
