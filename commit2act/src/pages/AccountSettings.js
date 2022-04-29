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
import { Storage, API } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import { updateUser } from '../graphql/mutations';
import { getAllSubmittedActionsForUser } from '../graphql/queries';
import { useParams } from 'react-router-dom';

const Input = styled('input')`
  display: none;
`;

const AccountSettings = ({ user }) => {
  const { profileId } = useParams();
  const [showMore, setShowMore] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState();
  const [newAvatarUploaded, setNewAvatarUploaded] = useState(false);
  const [userActions, setUserActions] = useState();
  const [selectedTab, setSelectedTab] = useState('0');

  useEffect(() => {
    getUserActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsForUser,
      variables: { user_id: user.user_id },
    });
    setUserActions(res.data.getAllSubmittedActionsForUser);
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

  const renderActionCards = () => {
    if (userActions) {
      return showMore
        ? userActions.map((action, index) => (
            <SubmittedActionCard key={index} action={action} />
          ))
        : userActions
            .slice(0, 3)
            .map((action, index) => (
              <SubmittedActionCard key={index} action={action} />
            ));
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
              My Account
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
                      width: {
                        xs: '24vw',
                        sm: '22vw',
                        md: '20vw',
                        lg: '15vw',
                        xl: '15vw',
                      },
                      height: {
                        xs: '12vh',
                        md: '22vh',
                        lg: '24vh',
                        xl: '26vh',
                      },
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
              My Actions
            </Typography>
            <TabContext value={selectedTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  width: '100%',
                  padding: '0.5em',
                }}
              >
                <TabList
                  centered={true}
                  onChange={handleTabChange}
                  aria-label="view user action tabs"
                  scrollButtons
                  allowScrollButtonsMobile
                  variant="scrollable"
                >
                  <Tab label="Validated Actions" value="0" />
                  <Tab label="Actions Awaiting Validation" value="1" />
                </TabList>
              </Box>
              <TabPanel value="0">
                <Box
                  sx={{ height: '110vh', overflow: 'auto', padding: '0.25em' }}
                >
                  <Stack spacing={2}>
                    {renderActionCards()}
                    <Button
                      sx={{ mt: '3em' }}
                      variant="outlined"
                      onClick={() => setShowMore(!showMore)}
                    >
                      View {showMore ? 'Less' : 'More'}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
};

export default AccountSettings;
