import React, { useEffect, useState } from 'react';
import SubmittedActionCard from '../components/SubmittedActionCard';
import {
  Box,
  Button,
  Stack,
  Typography,
  Grid,
  Avatar,
  Tab,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { Storage, API, Auth } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import { updateUser } from '../graphql/mutations';
import {
  getAllSubmittedActionsForUser,
  getSingleUser,
} from '../graphql/queries';
import useMediaQuery from '@mui/material/useMediaQuery';

const Input = styled('input')`
  display: none;
`;

const AccountSettings = () => {
  const [showMore, setShowMore] = useState({
    validated: false,
    unvalidated: false,
    failed: false,
  });
  const [avatarPreview, setAvatarPreview] = useState();
  const [newAvatarUploaded, setNewAvatarUploaded] = useState(false);
  const [user, setUser] = useState();
  const [validatedActions, setValidatedActions] = useState();
  const [unvalidatedActions, setUnvalidatedActions] = useState();
  const [failedActions, setFailedActions] = useState();
  const tabs = ['Validated', 'Awaiting Validation', 'Did Not Pass Validation'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const scrollableTabs = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    const id = cognitoUserEntry.attributes['custom:id'];

    const res = await API.graphql({
      query: getSingleUser,
      variables: { user_id: id },
    });
    setUser(res.data.getSingleUser);
    getUserActions(id);
  };

  const getUserActions = async (id) => {
    const res = await API.graphql({
      query: getAllSubmittedActionsForUser,
      variables: { user_id: id },
    });
    const allActions = res.data.getAllSubmittedActionsForUser;
    //filter for all validated actions
    const validated = allActions.filter((action) => action.is_validated);
    setValidatedActions(validated);
    //filter for all unvalidated actions
    const unvalidated = allActions.filter((action) => !action.is_validated);
    setUnvalidatedActions(unvalidated);
    const failed = allActions.filter((action) => action.is_rejected);
    setFailedActions(failed);
  };

  //updates user avatar field in database
  async function updateUserAvatar(userAvatarLink) {
    await API.graphql({
      query: updateUser,
      variables: { user_id: user.user_id, avatar: userAvatarLink },
    });
  }

  //sends selected image to s3 storage
  async function handleAvatarChange(e) {
    if (user) {
      if (!e.target.files || e.target.files.length === 0) {
        setAvatarPreview(null);
        return;
      }
      let imageFile = e.target.files[0];
      let imageKey = 'avatars/'.concat(user.username, 'avatar');
      let imageType = imageFile.type;
      let userAvatarLink =
        process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME.concat(imageKey);
      //avatarPreview will display right after avatar is changed, since cloudfront url stays the same so changes in the avatar src aren't detected until page refresh
      let previewLink = URL.createObjectURL(imageFile);
      setAvatarPreview(previewLink);
      try {
        await Storage.put(imageKey, imageFile, {
          contentType: imageType,
          contentDisposition: 'inline',
        });
        setNewAvatarUploaded(true);
      } catch (error) {
        console.log('Error uploading file', error);
      }
      //if user avatar field was previously null, update field with new link
      if (user.avatar === null) {
        updateUserAvatar(userAvatarLink);
      }
    }
  }

  const renderValidatedActionCards = () => {
    //return if validatedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(validatedActions) && validatedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.validated
              ? validatedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : validatedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            <Button
              sx={{ mt: '3em' }}
              variant="outlined"
              onClick={() =>
                setShowMore((prev) => ({
                  ...prev,
                  validated: !showMore.validated,
                }))
              }
            >
              View {showMore.validated ? 'Less' : 'More'}
            </Button>
          </Stack>
        </Box>
      );
    } else {
      return (
        <Typography variant="subtitle2">
          There are no validated actions to show
        </Typography>
      );
    }
  };

  const renderUnvalidatedActionCards = () => {
    //return if unvalidatedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(unvalidatedActions) && unvalidatedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.unvalidated
              ? unvalidatedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : unvalidatedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            <Button
              sx={{ mt: '3em' }}
              variant="outlined"
              onClick={() =>
                setShowMore((prev) => ({
                  ...prev,
                  unvalidated: !showMore.unvalidated,
                }))
              }
            >
              View {showMore.unvalidated ? 'Less' : 'More'}
            </Button>
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            There are no unvalidated actions to show
          </Typography>
        </Box>
      );
    }
  };

  const renderFailedActionCards = () => {
    //return if failedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(failedActions) && failedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.failed
              ? failedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : failedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            <Button
              sx={{ mt: '3em' }}
              variant="outlined"
              onClick={() =>
                setShowMore((prev) => ({
                  ...prev,
                  failed: !showMore.failed,
                }))
              }
            >
              View {showMore.failed ? 'Less' : 'More'}
            </Button>
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            There are no failed actions to show
          </Typography>
        </Box>
      );
    }
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      {user && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{ mt: { xs: '1.5em', md: '0' }, mb: '1.5em' }}
            >
              Account Information
            </Typography>
            <Grid
              container
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Grid item xs={12} md={3}>
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
                      user.avatar && !newAvatarUploaded
                        ? user.avatar
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
              </Grid>
              <Grid
                item
                xs={12}
                md={9}
                sx={{
                  width: '100%',
                  outline: '2px solid #3F72AF',
                  borderRadius: '5px',
                  padding: '1.5em',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'space-between' },
                  flexFlow: { xs: 'none', md: 'row wrap' },
                  flexDirection: { xs: 'column' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  overflow: 'auto',
                }}
              >
                <Box>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      Name:
                    </Typography>
                    {user.name}
                  </Typography>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      Username:
                    </Typography>
                    {user.username}
                  </Typography>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      Email:
                    </Typography>
                    {user.email}
                  </Typography>
                </Box>
                <Button size="small" sx={{ alignSelf: { md: 'flex-start' } }}>
                  Edit Info
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h2" sx={{ m: '2.5em 0 1.25em' }}>
              Logged Actions
            </Typography>
            <TabContext value={selectedTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  maxWidth: { xs: 320, sm: '100%' },
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="view user action tabs"
                  scrollButtons
                  allowScrollButtonsMobile
                  variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
                  centered={!scrollableTabs}
                >
                  <Tab label={tabs[0]} value={tabs[0]} />
                  <Tab label={tabs[1]} value={tabs[1]} />
                  <Tab label={tabs[2]} value={tabs[2]} />
                </TabList>
              </Box>
              <TabPanel value={tabs[0]}>
                {renderValidatedActionCards()}
              </TabPanel>
              <TabPanel value={tabs[1]}>
                {renderUnvalidatedActionCards()}
              </TabPanel>
              <TabPanel value={tabs[2]}>{renderFailedActionCards()}</TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
};

export default AccountSettings;
