import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Tab,
  Tooltip,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Stack,
  IconButton,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {
  AutoGraphOutlined,
  PeopleAlt,
  Person,
  Public,
  Lock,
  ContentCopy,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import { getSingleGroupByName, getAllMembersInGroup } from '../graphql/queries';

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
            fontWeight: 'bold',
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
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 50,
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const GroupProfile = () => {
  const { groupName } = useParams();
  const [selectedTab, setSelectedTab] = useState('0');
  const [groupInfo, setGroupInfo] = useState();
  const [groupMembers, setGroupMembers] = useState();

  useEffect(() => {
    getGroupInfo();
  }, []);

  const getGroupInfo = async () => {
    const res = await API.graphql({
      query: getSingleGroupByName,
      variables: { group_name: groupName },
    });
    setGroupInfo(res.data.getSingleGroupByName);
    const groupId = res.data.getSingleGroupByName.group_id;
    getGroupMembers(groupId);
  };

  const getGroupMembers = async (groupId) => {
    const res = await API.graphql({
      query: getAllMembersInGroup,
      variables: { group_id: groupId },
    });
    setGroupMembers(res.data.getAllMembersInGroup);
  };

  const groupLink =
    groupInfo &&
    (groupInfo.is_public
      ? window.location.href.concat('id:', groupInfo.group_id)
      : window.location.href.concat(
          'id:',
          groupInfo.group_id,
          'password:',
          groupInfo.private_password
        ));

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const renderGroupInfoPanel = () => {
    return (
      <Grid container sx={{ pt: '1.5em' }} columnSpacing={12} rowSpacing={4}>
        <Grid item xs={12} sm={6}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            About
          </Typography>
          <Typography component="div" variant="subtitle1">
            {groupInfo.group_description}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            Group Organizers
          </Typography>
          <Box display="flex" alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: {
                  xs: 100,
                },
                height: {
                  xs: 100,
                },
              }}
            >
              C
            </Avatar>
            <Typography component="div" variant="h3" sx={{ ml: '1em' }}>
              Christy Lam
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const renderGroupMemberPanel = () => {
    if (groupMembers) {
      return (
        <Grid
          item
          container
          columnSpacing={{ xs: 0, md: 1 }}
          sx={{
            width: '100%',
            height: '50vh',
            backgroundColor: '#DBE2EF',
            borderRadius: '8px',
            padding: '1.5em',
            mt: '2em',
            alignItems: 'center',
            flexWrap: 'wrap',
            overflow: 'auto',
          }}
        >
          {groupMembers.map((member, index) => (
            <Grid
              container
              item
              xs={6}
              sm={4}
              md={2}
              sx={{ justifyContent: 'center' }}
            >
              <Avatar
                key={index}
                variant="rounded"
                sx={{
                  width: {
                    xs: 100,
                  },
                  height: {
                    xs: 100,
                  },
                  mb: { xs: '1.5em' },
                }}
              >
                {member.name.charAt(0)}
              </Avatar>
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderAddMemberPanel = () => {
    //add check to only show this panel if user is owner
    return (
      <Box display="flex" justifyContent="center" flexDirection="column">
        <Typography component="div" variant="h3">
          Add Users To This Group By Sending Them Your Group Link
        </Typography>
        <Typography component="div" variant="subtitle1" sx={{ mt: '2em' }}>
          Your Group Link is:{' '}
        </Typography>
        <Typography
          component="div"
          variant="subtitle1"
          sx={{
            border: '1px black solid',
            borderRadius: '2px',
            pl: '1em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: { xs: '100%', md: '50%' },
          }}
        >
          {groupLink}
          <Tooltip title="Copy">
            <IconButton aria-label="copy" onClick={() => copyText(groupLink)}>
              <ContentCopy
                sx={{
                  alignSelf: 'center',
                  ':hover': { cursor: 'pointer', opacity: '0.5' },
                }}
              />
            </IconButton>
          </Tooltip>
        </Typography>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      {groupInfo && (
        <Grid
          container
          columnSpacing={{ xs: 0, md: 8 }}
          alignItems={{ xs: 'center', lg: 'flex-start' }}
          direction={{ xs: 'column', lg: 'row' }}
          sx={{ mt: '2em' }}
          gap={{ xs: '2em', lg: '0' }}
          textAlign={{ xs: 'center', lg: 'left' }}
        >
          <Grid
            container
            item
            xs={4.5}
            direction={{ xs: 'column', md: 'row' }}
            gap={{ xs: '2.5em' }}
            alignItems="center"
            sx={{ mb: '1.5em' }}
            width={{ xs: '70%', md: '100%' }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: {
                  xs: 150,
                },
                height: {
                  xs: 150,
                },
              }}
              src={groupInfo.group_image ? groupInfo.group_image : null}
            >
              {groupInfo.group_name.charAt(0)}
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5em',
              }}
            >
              <Typography component="div" variant="h1" sx={{ mb: '0.5em' }}>
                {groupName}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <PeopleAlt />
                <Typography component="div" variant="subtitle1">
                  Members: {groupMembers && groupMembers.length}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Person />
                <Typography component="div" variant="subtitle1">
                  Created By:
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                {groupInfo.is_public ? <Public /> : <Lock />}
                <Typography component="div" variant="subtitle1">
                  {groupInfo.is_public ? 'Public' : 'Private'}
                </Typography>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={7.5}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 0, sm: 1 }}
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{
                width: '100%',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
              }}
            >
              <Grid item xs={6}>
                <Card raised={true} sx={{ p: '1em', height: { md: '25vh' } }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">CO2 Saved This Week</Typography>
                    <CardContent>
                      <Typography variant="h5">
                        <AutoGraphOutlined fontSize="large" />
                        800g
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card raised={true} sx={{ p: '1em', height: { md: '25vh' } }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Total CO2 Saved</Typography>
                    <CardContent>
                      <Typography variant="h5">1600g</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            item
            sx={{
              mt: { xs: '2em', md: '3em' },
              width: { xs: '70%', sm: '100%' },
            }}
          >
            <TabContext value={selectedTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  width: '100%',
                  display: 'flex',
                  padding: '0.5em',
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="group profile tabs"
                  scrollButtons
                  allowScrollButtonsMobile
                  variant="scrollable"
                >
                  <Tab label="Group Info" value="0" />
                  <Tab label="Member Actions" value="1" />
                  <Tab label="Group Members" value="2" />
                  <Tab label="Add Members" value="3" />
                </TabList>
              </Box>
              <TabPanel value="0">{renderGroupInfoPanel()}</TabPanel>
              <TabPanel value="1">Member Actions</TabPanel>
              <TabPanel
                value="2"
                sx={{
                  padding: { xs: '0' },
                  width: '100%',
                }}
              >
                {renderGroupMemberPanel()}
              </TabPanel>
              <TabPanel
                value="3"
                sx={{
                  padding: { xs: '1.5em 0' },
                  width: '100%',
                }}
              >
                {renderAddMemberPanel()}
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      )}
    </ThemeProvider>
  );
};

export default GroupProfile;
