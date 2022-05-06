import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Tab,
  Grid,
  Avatar,
  Stack,
  Paper,
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
} from '../graphql/queries';
import GroupMemberPanel from '../components/groupProfile/GroupMemberPanel';
import AddMemberPanel from '../components/groupProfile/AddMemberPanel';
import MemberActionsPanel from '../components/groupProfile/MemberActionsPanel';
import GroupInfoPanel from '../components/groupProfile/GroupInfoPanel';
import { styled } from '@mui/material/styles';
import Leaderboard from '../components/Leaderboard';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  .statValue {
    margin-top: 0.5em;
  }
`;

const GroupProfile = () => {
  const { groupName } = useParams();
  const [selectedTab, setSelectedTab] = useState('0');
  const [groupInfo, setGroupInfo] = useState();
  const [groupMembers, setGroupMembers] = useState();
  const [groupOwners, setGroupOwners] = useState();
  const [currentUserOwner, setCurrentUserOwner] = useState(false);
  const [userId, setUserId] = useState();

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
    setGroupInfo(groupInfoRes.data.getSingleGroupByName);
    const currentUserId = Number(cognitoUser.attributes['custom:id']);
    setUserId(currentUserId);
    const groupId = groupInfoRes.data.getSingleGroupByName.group_id;
    isUserGroupOwner(currentUserId, groupId);
    getGroupUsers(groupId);
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

  //gets list of all users
  const getGroupUsers = async (groupId) => {
    const memberRes = await API.graphql({
      query: getAllUsersInGroup,
      variables: { group_id: groupId },
    });
    setGroupMembers(memberRes.data.getAllUsersInGroup);
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
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
          textAlign={{ xs: 'center', md: 'left' }}
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-evenly',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
                gap: { xs: '0.5em', md: '2' },
              }}
            >
              <StyledPaper elevation={6}>
                <Typography variant="h4">CO2 Saved This Week</Typography>
                <Typography variant="h5" className="statValue">
                  <AutoGraphOutlined fontSize="large" />
                  {groupInfo.weekly_co2}g
                </Typography>
              </StyledPaper>
              <StyledPaper elevation={6}>
                <Typography variant="h4">Total CO2 Saved</Typography>
                <Typography variant="h5" className="statValue">
                  {groupInfo.total_co2}g
                </Typography>
              </StyledPaper>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Leaderboard
              currentGroup={groupInfo}
              groupMembers={groupMembers}
              userId={userId}
            />
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
              <TabPanel value="0">
                <GroupInfoPanel
                  groupOwners={groupOwners}
                  groupInfo={groupInfo}
                />
              </TabPanel>
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
