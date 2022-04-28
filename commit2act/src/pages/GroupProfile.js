import React, { useEffect, useState } from 'react';
import {
  Typography,
  Tooltip,
  Box,
  Tab,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  AvatarGroup,
  Stack,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {
  AutoGraphOutlined,
  PeopleAlt,
  Public,
  Lock,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { Auth, API } from 'aws-amplify';
import {
  getSingleGroupByName,
  getAllUsersInGroup,
  getAllOwnersInGroup,
  getGroupsTotalCO2,
  getGroupsWeekCO2,
} from '../graphql/queries';
import GroupMemberPanel from '../components/groupProfile/GroupMemberPanel';
import AddMemberPanel from '../components/groupProfile/AddMemberPanel';
import MemberActionsPanel from '../components/groupProfile/MemberActionsPanel';

const GroupProfile = () => {
  const { groupName } = useParams();
  const [selectedTab, setSelectedTab] = useState('0');
  const [groupInfo, setGroupInfo] = useState();
  const [groupMembers, setGroupMembers] = useState();
  const [groupOwners, setGroupOwners] = useState();
  const [currentUserOwner, setCurrentUserOwner] = useState(false);
  const [progressStats, setProgressStats] = useState({
    totalCO2: '',
    weekCO2: '',
  });

  useEffect(() => {
    getGroupAndUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGroupAndUserInfo = async () => {
    const [cognitoUser, groupInfoRes] = await Promise.all([
      Auth.currentAuthenticatedUser(),
      API.graphql({
        query: getSingleGroupByName,
        variables: { group_name: groupName },
      }),
    ]);
    const currentUserId = Number(cognitoUser.attributes['custom:id']);
    setGroupInfo(groupInfoRes.data.getSingleGroupByName);
    const groupId = groupInfoRes.data.getSingleGroupByName.group_id;
    isUserGroupOwner(currentUserId, groupId);
    getGroupStats(groupId);
  };

  //gets array of all group owners and checks if the current user is a owner
  const isUserGroupOwner = async (currentUserId, groupId) => {
    const ownerRes = await API.graphql({
      query: getAllOwnersInGroup,
      variables: { group_id: groupId },
    });
    const owners = ownerRes.data.getAllOwnersInGroup;
    setGroupOwners(owners);
    const ownerIds = owners.map((owner) => owner.user_id);
    if (ownerIds.includes(currentUserId)) {
      setCurrentUserOwner(true);
    }
  };

  //gets list of all users and group stats
  const getGroupStats = async (groupId) => {
    const [memberRes, totalCO2Res, weeklyCO2Res] = await Promise.all([
      API.graphql({
        query: getAllUsersInGroup,
        variables: { group_id: groupId },
      }),
      API.graphql({
        query: getGroupsTotalCO2,
        variables: { group_id: groupId },
      }),
      API.graphql({
        query: getGroupsWeekCO2,
        variables: { group_id: groupId },
      }),
    ]);
    setGroupMembers(memberRes.data.getAllUsersInGroup);
    setProgressStats((prev) => ({
      ...prev,
      totalCO2: totalCO2Res.data.getGroupsTotalCO2,
      weekCO2: weeklyCO2Res.data.getGroupsWeekCO2,
    }));
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const renderGroupInfoPanel = () => {
    return (
      <Grid container sx={{ pt: '1.5em' }} columnSpacing={12} rowSpacing={4}>
        <Grid item xs={12} sm={7}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            About
          </Typography>
          <Typography component="div" variant="subtitle2">
            {groupInfo.group_description}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            Group Organizers
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: 'center', lg: 'flex-start' }}
          >
            <AvatarGroup max={4}>
              {groupOwners &&
                groupOwners.map((owner, index) => (
                  <Tooltip title={owner.name}>
                    <Avatar
                      key={index}
                      alt={owner.name}
                      src={owner.avatar ? owner.avatar : null}
                      sx={{ width: 60, height: 60 }}
                    >
                      {owner.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
            </AvatarGroup>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
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
            justifyContent={{ sm: 'center' }}
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
                <Typography component="div" variant="subtitle2">
                  Members: {groupMembers && groupMembers.length}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                {groupInfo.is_public ? <Public /> : <Lock />}
                <Typography component="div" variant="subtitle2">
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
                        {progressStats.weekCO2}g
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
                      <Typography variant="h5">
                        {progressStats.totalCO2}g
                      </Typography>
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
                  {/* only display addMemberPanel tab if current user is a group owner */}
                  {currentUserOwner && <Tab label="Add Members" value="3" />}
                </TabList>
              </Box>
              <TabPanel value="0">{renderGroupInfoPanel()}</TabPanel>
              <TabPanel
                value="1"
                sx={{
                  padding: { xs: '0' },
                  width: '100%',
                }}
              >
                <MemberActionsPanel groupInfo={groupInfo} />
              </TabPanel>
              <TabPanel
                value="2"
                sx={{
                  padding: { xs: '0' },
                  width: '100%',
                }}
              >
                <GroupMemberPanel
                  groupMembers={groupMembers}
                  setGroupMembers={setGroupMembers}
                  groupInfo={groupInfo}
                  currentUserOwner={currentUserOwner}
                />
              </TabPanel>
              <TabPanel
                value="3"
                sx={{
                  padding: { xs: '1.5em 0' },
                  width: '100%',
                }}
              >
                <AddMemberPanel groupInfo={groupInfo} />
              </TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default GroupProfile;
