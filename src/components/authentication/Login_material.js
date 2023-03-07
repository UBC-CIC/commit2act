import { Button, CircularProgress, Divider, Grid, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';
import { ArrowBack, AlternateEmail, Lock, Dialpad, Person, Badge } from '@mui/icons-material';

import { makeStyles } from 'tss-react/mui';

import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { updateLoginState } from '../../actions/loginActions';
import TextFieldStartAdornment from './TextFieldStartAdornment';
import './Login.css';
import PasswordRequirements from './PasswordRequirements';
import LoginNavbar from './LoginNavbar';

import useTranslation from '../customHooks/translations';

const initialFormState = {
  email: '',
  password: '',
  name: '',
  preferred_username: '',
  user_type: '',
  authCode: '',
  resetCode: '',
};

const useStyles = makeStyles()((theme) => {
  return{
    marginTop: {
      margin: theme.spacing(2, 'auto', 'auto', 'auto'),
    },
    marginHorizontal: {
      margin: theme.spacing(4, 'auto'),
    },
    padding: {
      padding: theme.spacing(1.5),
    },
    textAlignCenter: {
      textAlign: 'center',
    },
    flexDisplay: {
      display: 'flex',
    },
    forgetPassword: {
      justifyContent: 'flex-end',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    activeButton: {
      borderRadius: 50,
      width: '100%',
      fontSize: '1em',
    },
    themeColor: {
      backgroundColor: '#380FD1',
    },
    errorMessage: {
      color: '#8d0000',
    },
    cursor: {
      cursor: 'pointer',
    },
    underlineText: {
      textDecoration: 'underline',
    },
    passwordReq: {
      backgroundColor: '#ffc2c2',
      borderRadius: 5,
    },
    centerBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    defaultButton: {
      borderRadius: 5,
      width: '100%',
      fontSize: '1em',
      padding: theme.spacing(1.5),
      margin: theme.spacing(2, 'auto'),
      backgroundColor: '#262a2c',
      color: '#BCF10C',
      '&:hover': {
        backgroundColor: '#262a2c',
      },
    },
    submitButton: {
      color: theme.palette.getContrastText('#380FD1'),
      backgroundColor: '#380FD1',
      '&:hover': {
        backgroundColor: '#262a2c',
      },
    },
    helpText: {
      marginBottom: '20px',
      color: '#000',
      display: 'block',
    },
    textFieldStyle: {
      marginBottom: '12px',
      '& label' : {
        color: '#262a2c',
        fontSize: '1.3em',
        paddingRight: '5px',
        '&.Mui-focused' : {
          color: '#000',
        }
      },
      '& legend' : {
        fontSize: '1em',
      },
      '& fieldset' : {
        borderColor: '#262a2c',
      },
      '& input' : {
        color: '#000',
      },
      '& svg': {
        color: '#000'
      },
      '& p': {
        color: '#000'
      }
    }
  }
});

function Login(props) {
  const {
    loginState,
    updateLoginState,
    animateTitle,
    type,
    title,
    darkMode,
    themeColor,
    disableSignUp,
  } = props;
  const [formState, updateFormState] = useState(initialFormState);
  const [accountCreationEmailExistError, setAccountCreationEmailExistError] =
    useState(false);
  const [accountCreationPasswordError, setAccountCreationPasswordError] =
    useState(false);
  const [accountLoginError, setAccountLoginError] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newVerification, setNewVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [forgotPasswordError, setForgotPasswordError] = useState(false);
  const [emptyInputError, setEmptyInputError] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);
  const [timeLimitError, setTimeLimitError] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  // password check
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
  const [passwordUnmatchError, setPasswordUnmatchError] = useState(false);
  const [confirmPasswordString, setConfirmPasswordString] = useState('');

  const { classes } = useStyles();

  const translation = useTranslation();

  useEffect(() => {
    async function retrieveUser() {
      try {
        Auth.currentAuthenticatedUser()
          .then((user) => {
            updateLoginState('signedIn');
          })
          .catch((err) => {
            updateLoginState('signIn');
          });
      } catch (e) {}
    }
    retrieveUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearErrors() {
    setAccountCreationEmailExistError(false);
    setAccountCreationPasswordError(false);
    setAccountLoginError(false);
    setVerificationError(false);
    setNewVerification(false);
    setNewPasswordError(false);
    setInvalidEmailError(false);
  }

  function onChange(e) {
    e.persist();
    clearErrors();

    updateFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function onChangePassword(e) {
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

    onChange(e);

    // check if "password" is the same as "confirm-password"
    e.target.value === confirmPasswordString
      ? setPasswordUnmatchError(false)
      : setPasswordUnmatchError(true);
  }

  async function signUp() {
    try {
      // check if both passwords match first before signing up
      checkMatchingPasswords();

      const { email, password, name, preferred_username } = formState;
      checkEmptyString(name);
      checkEmptyString(preferred_username);

      setLoading(true);
      await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          name: name,
          preferred_username: preferred_username,
          'custom:type': 'User',
          'custom:firstLogin': 'true',
        },
      });

      updateFormState(() => ({
        ...initialFormState,
        name,
        preferred_username,
        email,
      }));
      updateLoginState('confirmSignUp');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setEmptyInputError(false);
      const errorMsg = e.message;

      if (errorMsg.includes('empty')) {
        setEmptyInputError(true);
      } else if (errorMsg.includes('Username should be an email.')) {
        setInvalidEmailError(true);
      } else if (errorMsg.includes('given email already exists')) {
        setAccountCreationEmailExistError(true);
      } else if (errorMsg.includes('Passwords do not match')) {
        setPasswordUnmatchError(true);
      } else {
        setAccountCreationPasswordError(true);
      }
    }
  }

  // confirmSignUp shows after signUp page
  async function confirmSignUp() {
    // Verify Account with confirmation code after sign up page
    try {
      setNewVerification(false);
      const { email, authCode } = formState;
      setLoading(true);
      await Auth.confirmSignUp(email, authCode);
      resetStates('signIn');
      setShowSuccessAlert(true);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setVerificationError(true);
      setLoading(false);

      const errorMsg = e.message;
      if (errorMsg.includes('time')) {
        setTimeLimitError(errorMsg);
      }
    }
  }

  async function resendConfirmationCode() {
    try {
      const { email } = formState;
      setVerificationError(false);
      await Auth.resendSignUp(email);
      setNewVerification(true);
    } catch (err) {
      setNewVerification(false);

      const errorMsg = err.message;
      if (errorMsg.includes('time')) {
        setTimeLimitError(errorMsg);
      }
    }
  }

  async function signIn() {
    try {
      setLoading(true);
      const { email, password } = formState;
      let user = await Auth.signIn(email, password);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        // a new password needs to be set if account is created through Amazon Cognito for the user
        resetStates('newUserPassword');
        setLoading(false);
        setCurrentUser(user);
      } else {
        resetStates('signedIn');
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      const errorMsg = e.code;

      // if a password is requested through Amazon Cognito,
      // need to jump to resetPassword page
      if (errorMsg.includes('PasswordResetRequiredException')) {
        const { email } = formState;

        updateFormState(() => ({ ...initialFormState, email }));
        updateLoginState('resetPassword');
        setLoading(false);
      } else {
        setAccountLoginError(true);
      }
    }
  }

  async function setNewPassword() {
    try {
      // check if both passwords match first before setting new password
      checkMatchingPasswords();

      const { password } = formState;
      setLoading(true);
      await Auth.completeNewPassword(currentUser, password);
      resetStates('signedIn');
      setLoading(false);
    } catch (e) {
      setLoading(false);

      const errorMsg = e.message;

      if (errorMsg.includes('empty')) {
        setEmptyInputError(true);
      } else if (errorMsg.includes('Passwords do not match')) {
        setPasswordUnmatchError(true);
      } else if (errorMsg.includes('time')) {
        setTimeLimitError(errorMsg);
      } else {
        setNewPasswordError(true);
      }
    }
  }

  async function forgotPassword() {
    try {
      const { email } = formState;
      setLoading(true);
      await Auth.forgotPassword(email);
      updateFormState(() => ({ ...initialFormState, email }));
      updateLoginState('resetPassword');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setForgotPasswordError(true);
    }
  }

  // resetPassword after forgotPassword page
  async function resetPassword() {
    try {
      // check if both passwords match first before resetting password
      checkMatchingPasswords();

      const { email, resetCode, password } = formState;
      setLoading(true);
      await Auth.forgotPasswordSubmit(email, resetCode, password);
      resetStates('signIn');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setEmptyInputError(false);

      const errorMsg = e.message;

      if (errorMsg.includes('empty')) {
        setEmptyInputError(true);
      } else if (errorMsg.includes('verification code')) {
        setVerificationError(true);
      } else if (errorMsg.includes('time')) {
        setTimeLimitError(errorMsg);
      } else if (errorMsg.includes('Passwords do not match')) {
        setPasswordUnmatchError(true);
      } else {
        setNewPasswordError(true);
      }
    }
  }

  function checkMatchingPasswords() {
    // check if both passwords match
    if (!confirmPasswordString) {
      // empty field
      throw new Error('empty');
    } else if (passwordUnmatchError) {
      throw new Error('Passwords do not match');
    }
  }

  function checkEmptyString(str) {
    // check if string is empty after space trimmed
    if (str.replace(/\s+/g, '') === '') {
      throw new Error('empty');
    }
  }

  function resetStates(state) {
    // clear states when hitting the back button
    updateFormState(() => initialFormState);
    clearErrors();

    // the following were not removed during onChange() so need to be cleared here
    setForgotPasswordError(false);
    setEmptyInputError(false);
    setPasswordUnmatchError(false);
    setConfirmPasswordString('');
    setTimeLimitError('');

    // clear password requirement checks
    setPasswordRequirements(() => {
      passwordRequirements.uppercase.error = false;
      passwordRequirements.lowercase.error = false;
      passwordRequirements.digit.error = false;
      passwordRequirements.special.error = false;
      passwordRequirements.minLength.error = false;
      passwordRequirements.maxLength.error = false;

      return passwordRequirements;
    });

    updateLoginState(state);
  }

  return (
    <>
      {/*  An example image is provided. Please use a royalty-free photo, a photo owned by you, or a photo owned by the CIC */}
      <Grid
        container
        className={classes.centerBox}
        style={
          type === 'image'
            ? themeColor === 'standard'
              ? {
                  backgroundColor: '#012144',
                  backgroundImage: 'url(./assets/images/login-background.jpg)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no',
                  width: '100%',
                  height: '100vh',
                }
              : {
                  backgroundColor: themeColor,
                  backgroundImage: 'url(./assets/images/login-background.jpg)',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no',
                  width: '100%',
                  height: '100vh',
                }
            : themeColor === 'standard'
            ? { backgroundColor: '#012144', width: '100%', height: '100vh' }
            : { backgroundColor: themeColor, width: '100%', height: '100vh' }
        }
      >
      
        <LoginNavbar />

        {/* Please use a royalty free video or a video that you or the CIC owns */}
        {type === 'video' ? (
          <video playsInline autoPlay muted loop>
            <source
              src={process.env.PUBLIC_URL + '/Assets/Videos/video.mp4'}
              type="video/mp4"
            />
          </video>
        ) : null}
        <Grid
          container
          item
          xs={12}
          md={6}
          className={`page-info ${classes.centerBox}`}
        >
          <Grid
            container
            item
            justifyContent={'space-evenly'}
            alignItems={'center'} /*style={{height: "60vh"}}*/
          >
            <Grid xs item className={`typewriter ${classes.marginHorizontal}`}>
              <p
                className={`${classes.textAlignCenter} ${
                  animateTitle
                    ? darkMode
                      ? 'line anim-typewriter'
                      : 'line anim-typewriter-light lightMode'
                    : darkMode
                    ? 'line-static'
                    : 'line-static lightMode-static'
                }`}
              >
                {title}
              </p>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={7}
          md={5}
          className={`login-container ${classes.centerBox}`}
        >
          <Grid
            container
            item
            direction={'column'}
			wrap={'nowrap'}
            xs={12}
            sm={11}
            md={9}
            className={'login-box'}
          >
            <Grid className={'login-wrapper-top'}>
              <span className={'login-wrapper-top-header'}>
                {loginState === 'signIn' ? (
                  <span>{translation.signIn}</span>
                ) : loginState === 'signUp' ? (
                  <span>{translation.createAccount}</span>
                ) : loginState === 'confirmSignUp' ? (
                  <span>{translation.verifyAccount}</span>
                ) : loginState === 'forgotPassword' ? (
                  <span>{translation.forgotPassword}</span>
                ) : loginState === 'resetPassword' ? (
                  <span>{translation.passwordReset}</span>
                ) : loginState === 'newUserPassword' ? (
                  <span>{translation.setNewPassword}</span>
                ) : (
                  <span>{translation.welcome}</span>
                )}
              </span>
            </Grid>
            {loginState === 'signIn' && (
              <Grid>
                <Snackbar
                  autoHideDuration={2000}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  open={showSuccessAlert}
                  message="Success! Redirecting you to sign in page"
                  onClose={() => setShowSuccessAlert(false)}
                />
                <BannerMessage type={'error'} typeCheck={accountLoginError}>
                  {translation.incorrectLogin}
                </BannerMessage>
                {/* username */}
                <TextFieldStartAdornment
                  startIcon={<AlternateEmail />}
                  name={'email'}
                  type={'email'}
                  onChange={onChange}
                  label={translation.email}
                  className={classes.textFieldStyle}
                />
                {/* password */}
                <TextFieldStartAdornment
                  startIcon={<Lock />}
                  name={'password'}
                  type={'password'}
                  onChange={onChange}
                  label={translation.password}
                  className={classes.textFieldStyle}
                />
                <Grid
                  className={`${classes.flexDisplay} ${classes.forgetPassword} ${classes.cursor}`}
                  onClick={() => resetStates('forgotPassword')}
                >
                  {' '}
                  {/* forget */}
                  <span style={{ textAlign: 'end' }}>
				  	{translation.forgotPassword}
                  </span>
                </Grid>
                <Grid className={`input-box ${classes.marginTop}`}>
                  {' '}
                  {/* sign in button */}
                  <SubmitButtonWithLoading
                    submitAction={signIn}
                    submitMessage={translation.signIn}
                    loadingState={loading}
                  />
                </Grid>
                {!disableSignUp && ( // if sign up is not disabled, then show the create an account option
                  <div>
                    {/* divider */}
                    <Grid container item alignItems="center" xs={12}>
                      <Grid item xs>
                        <Divider />
                      </Grid>
                      <Grid item className={classes.padding}>
                        {translation.or}
                      </Grid>
                      <Grid item xs>
                        <Divider />
                      </Grid>
                    </Grid>
                    {/* create an account button */}
                    <Grid className={`input-box`}>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={() => resetStates('signUp')}
                        className={classes.defaultButton}
                      >
                        {translation.createAccount}
                      </Button>
                    </Grid>
                  </div>
                )}
              </Grid>
            )}
            {loginState === 'forgotPassword' && (
              <Grid>
                <Grid container item xs={12}>
                  <span className={classes.helpText}>
                    {translation.enterEmailAddress}
                  </span>
                </Grid>
                <TextFieldStartAdornment
                  startIcon={<AlternateEmail />}
                  label={translation.email}
                  name={'email'}
                  type="email"
                  autoComplete={'new-password'}
                  variant="outlined"
                  error={forgotPasswordError}
                  onChange={onChange}
                  className={classes.textFieldStyle}
                />
                {!!forgotPasswordError && (
                  <Grid container item xs={12} className={classes.errorMessage}>
                    <span>
                      {translation.validEmailAccount}&nbsp;
                      <span
                        className={`${classes.cursor} ${classes.underlineText}`}
                        onClick={() => updateLoginState('signUp')}
                      >
                        <strong>{translation.here}</strong>
                      </span>
                      <span>.</span>
                    </span>
                  </Grid>
                )}
                <BackAndSubmitButtons
                  backAction={() => resetStates('signIn')}
                  submitAction={forgotPassword}
                  submitMessage={translation.sendResetCode}
                  loadingState={loading}
                />
              </Grid>
            )}
            {loginState === 'resetPassword' && (
              <Grid>
                <Grid>
                  <span className={classes.helpText}>
                    {translation.checkEmail}&nbsp;
                    <strong>{formState.email}</strong>
                    <br />
                    {translation.forResetCodeAndCreatePassword}
                  </span>
                </Grid>
                <BannerMessage
                  type={'error'}
                  typeCheck={emptyInputError || timeLimitError}
                >
                  {(!!emptyInputError && translation.fillAllFields) ||
                    (timeLimitError !== '' && timeLimitError)}
                </BannerMessage>
                <TextFieldStartAdornment
                  startIcon={<Dialpad />}
                  label={translation.enterResetCode}
                  variant="outlined"
                  name={'resetCode'}
                  type="text"
                  error={verificationError}
                  className={classes.textFieldStyle}
                  helperText={
                    !!verificationError && translation.enterCorrectResetCode
                  }
                  onChange={onChange}
                />
                <TextFieldStartAdornment
                  startIcon={<Lock />}
                  label={translation.createNewPassword}
                  name={'password'}
                  type="password"
                  error={newPasswordError}
                  helperText={translation.passwordSettings}
                  autoComplete={'new-password'}
                  onChange={onChangePassword}
                  className={classes.textFieldStyle}
                />
                <Grid
                  container
                  item
                  xs={12}
                  className={!!newPasswordError ? classes.passwordReq : null}
                >
                  <PasswordRequirements requirements={passwordRequirements} />
                </Grid>
                <TextFieldStartAdornment
                  startIcon={<Lock />}
                //   label="Password"
                  label={translation.reEnterPassword}
                  name={'confirm-password'}
                  type="password"
                  error={passwordUnmatchError}
                  helperText={
                    !!passwordUnmatchError && translation.passwordNotMatch
                  }
                  autoComplete={'new-password'}
                  className={classes.textFieldStyle}
                  value={confirmPasswordString}
                  onChange={(e) => {
                    setConfirmPasswordString(e.target.value); // update current input state
                    // check if "password" is the same as "confirm-password"
                    e.target.value === formState.password
                      ? setPasswordUnmatchError(false)
                      : setPasswordUnmatchError(true);
                  }}
                />
                <BackAndSubmitButtons
                  backAction={() => resetStates('signIn')}
                  submitAction={resetPassword}
                  submitMessage={translation.updatePassword}
                  loadingState={loading}
                />
              </Grid>
            )}
            {loginState === 'signUp' && (
              <Grid>
                <BannerMessage type={'error'} typeCheck={emptyInputError}>
                  {translation.fillAllFields}
                </BannerMessage>
                <TextFieldStartAdornment
                  startIcon={<Badge />}
                  label={translation.name}
                  name={'name'}
                  type="text"
                  autoComplete={'new-password'}
                  onChange={onChange}
                  className={classes.textFieldStyle}
                />
                <TextFieldStartAdornment
                  startIcon={<Person />}
                  label={translation.username}
                  name={'preferred_username'}
                  type="text"
                  autoComplete={'new-password'}
                  onChange={onChange}
                  className={classes.textFieldStyle}
                />
                <TextFieldStartAdornment
                  className={classes.textFieldStyle}
                  startIcon={<AlternateEmail />}
                  label={translation.email}
                  name={'email'}
                  type="email"
                  autoComplete={'new-password'}
                  error={accountCreationEmailExistError || invalidEmailError}
                  helperText={
                    (!!accountCreationEmailExistError &&
                      translation.emailAlreadyExists) ||
                    (!!invalidEmailError && translation.validEmail)
                  }
                  onChange={onChange}
                />
                <TextFieldStartAdornment
                  startIcon={<Lock />}
                  label={translation.password}
                  name={'password'}
                  type="password"
                  error={accountCreationPasswordError}
                  helperText={'Your password must have the following:'}
                  autoComplete={'new-password'}
                  onChange={onChangePassword}
                  className={classes.textFieldStyle}
                />
                <Grid
                  container
                  item
                  xs={12}
                  className={
                    !!accountCreationPasswordError ? classes.passwordReq : null
                  }
                >
                  <PasswordRequirements requirements={passwordRequirements} />
                </Grid>
                <TextFieldStartAdornment
                  startIcon={<Lock />}
                  label={translation.confirmPassword}
                  name={'confirm-password'}
                  type="password"
                  error={passwordUnmatchError}
                  helperText={
                    !!passwordUnmatchError && translation.passwordNotMatch
                  }
                  autoComplete={'new-password'}
                  value={confirmPasswordString}
                  className={classes.textFieldStyle}
                  onChange={(e) => {
                    setConfirmPasswordString(e.target.value); // update current input state
                    // check if "password" is the same as "confirm-password"
                    e.target.value === formState.password
                      ? setPasswordUnmatchError(false)
                      : setPasswordUnmatchError(true);
                  }}
                />
                <BackAndSubmitButtons
                  backAction={() => resetStates('signIn')}
                  submitAction={signUp}
                  submitMessage={translation.signUp}
                  loadingState={loading}
                />
              </Grid>
            )}
            {loginState === 'confirmSignUp' && (
              <Grid>
                <Grid container item xs={12}>
                  <span>
                    {translation.checkEmailForConfirmationCode}
                  </span>
                </Grid>
                <BannerMessage type={'error'} typeCheck={verificationError}>
                  {translation.invalidVerificationCode}
                </BannerMessage>
                <BannerMessage type={'error'} typeCheck={timeLimitError !== ''}>
                  {timeLimitError}
                </BannerMessage>
                <BannerMessage type={'success'} typeCheck={newVerification}>
                  {translation.newVerificationCodeSentSuccesfully}
                </BannerMessage>
                <Grid
                  container
                  item
                  direction={'column'}
                  xs={12}
                  className={'input-box'}
                >
                  <TextFieldStartAdornment
                    startIcon={<Dialpad />}
                    Label={translation.enterConfirmationCode}
                    name={'authCode'}
                    type="text"
                    autoComplete={'new-password'}
                    onChange={onChange}
                    className={classes.textFieldStyle}
                  />
                </Grid>
                <Grid>
                  <span>{translation.didNotReceiveCode}</span>
                  <Button onClick={resendConfirmationCode}>
                    <span className={classes.underlineText}>{translation.resendCode}</span>
                  </Button>
                </Grid>
                <BackAndSubmitButtons
                  backAction={() => resetStates('signUp')}
                  submitAction={confirmSignUp}
                  submitMessage={'Verify'}
                  loadingState={loading}
                />
              </Grid>
            )}
            {loginState === 'newUserPassword' && (
              <Grid>
                <Grid container item xs={12}>
                  <span>
                    {translation.replaceTemporaryPassword} <strong>{formState.email}</strong>.
                  </span>
                </Grid>
                <BannerMessage type={'error'} typeCheck={timeLimitError !== ''}>
                  {timeLimitError}
                </BannerMessage>
                <Grid className={`input-box`}>
                  <TextFieldStartAdornment
                    startIcon={false}
                    // label={'Enter new password'}
                    label={translation.password}
                    name={'password'}
                    type="password"
                    autoComplete={'new-password'}
                    error={newPasswordError || emptyInputError}
                    helperText={translation.passwordSettings}
                    onChange={onChangePassword}
                    className={classes.textFieldStyle}
                  />
                  <Grid
                    container
                    item
                    xs={12}
                    className={
                      !!newPasswordError || !!emptyInputError
                        ? classes.passwordReq
                        : null
                    }
                  >
                    <PasswordRequirements requirements={passwordRequirements} />
                  </Grid>
                  <TextFieldStartAdornment
                    startIcon={false}
                    // label={'Re-enter new password'}
                    label={translation.confirmPassword}
                    name={'confirm-password'}
                    type="password"
                    error={passwordUnmatchError}
                    className={classes.textFieldStyle}
                    helperText={
                      !!passwordUnmatchError && translation.passwordNotMatch
                    }
                    autoComplete={'new-password'}
                    value={confirmPasswordString}
                    onChange={(e) => {
                      setConfirmPasswordString(e.target.value); // update current input state
                      // check if "password" is the same as "confirm-password"
                      e.target.value === formState.password
                        ? setPasswordUnmatchError(false)
                        : setPasswordUnmatchError(true);
                    }}
                  />
                </Grid>
                <BackAndSubmitButtons
                  backAction={() => resetStates('signIn')}
                  submitAction={setNewPassword}
                  submitMessage={translation.setPassword}
                  loadingState={loading}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

/* helper components */

const BannerMessage = (props) => {
  const { type, typeCheck, children } = props;

  const useStyles = makeStyles()((theme) => {
    return{
      root: {
        width: '100%',
        margin: theme.spacing(2, 'auto'),
      },
    }
  });

  const { classes } = useStyles();

  return (
    <Grid>
      {!!typeCheck && (
        <Grid container item xs={12}>
          <Alert
            className={classes.root}
            variant="filled"
            severity={type}
            elevation={3}
          >
            {children}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};

const SubmitButtonWithLoading = (props) => {
  const useStyles = makeStyles()((theme) => {
    return{
      progress: {
        display: 'flex',
        padding: theme.spacing(0, 1),
      },
      submitButton: {
        borderRadius: 5,
        width: '100%',
        fontSize: '1em',
        padding: theme.spacing(1.5),
        margin: theme.spacing(2, 'auto'),
        color: theme.palette.getContrastText('#380FD1'),
        backgroundColor: '#380FD1',
        '&:hover': {
          backgroundColor: '#380FD1',
        },
      }
    }
  });

  const { submitAction, submitMessage, loadingState } = props;
  const { classes } = useStyles();

  return (
    <Button
      variant="contained"
      disabled={!!loadingState}
      onClick={submitAction}
      className={classes.submitButton}
    >
      {submitMessage}
      {/* if it is loading, show the loading indicator */}
      {!!loadingState && (
        <Grid className={classes.progress}>
          <CircularProgress size={15} />
        </Grid>
      )}
    </Button>
  );
};

const BackAndSubmitButtons = ({ backAction, ...others }) => {

  const { classes } = useStyles();

  const translation = useTranslation();

  return (
    <Grid container item xs={12} justifyContent="space-between" spacing={1}>
      <Grid container item xs>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={backAction}
          className={classes.defaultButton}
        >
          {translation.back}
        </Button>
      </Grid>
      <Grid container item md={7} justifyContent={'flex-end'}>
        <SubmitButtonWithLoading {...others} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState.currentState,
  };
};

const mapDispatchToProps = {
  updateLoginState,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
