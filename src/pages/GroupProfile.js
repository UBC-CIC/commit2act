import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Tab,
  Grid,
  Avatar,
  Stack,
  Paper,
  Button,
  IconButton,
  Dialog,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import {
  AutoGraphOutlined,
  PeopleAlt,
  Public,
  Lock,
  Close,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Auth, API } from 'aws-amplify';
import {
  getSingleGroupByName,
  getSingleGroup,
  getAllUsersInGroup,
  getAllOwnersInGroup,
} from '../graphql/queries';
import GroupMemberPanel from '../components/groupProfile/GroupMemberPanel';
import AddMemberPanel from '../components/groupProfile/AddMemberPanel';
import MemberActionsPanel from '../components/groupProfile/MemberActionsPanel';
import GroupInfoPanel from '../components/groupProfile/GroupInfoPanel';
import { styled } from '@mui/material/styles';
import GroupPageLeaderboard from '../components/groupProfile/GroupPageLeaderboard';
import EditGroupPanel from '../components/groupProfile/EditGroupPanel';
import { v4 as uuidv4 } from 'uuid';
import LeaveGroupDialogContent from '../components/groupProfile/LeaveGroupDialogContent';
import useTranslation from '../components/customHooks/translations';
import { useUserInfoContext } from '../hooks/use-user-info-context';

const StyledPaper = styled(Paper)`
  padding: 1em 2em;
  text-align: center;
  .statValue {
    margin-top: 0.5em;
  }
`;

const GroupProfile = () => {
  const translation = useTranslation();
  const { user } = useUserInfoContext();
  const { groupName } = useParams();
  const tabs = [
    translation.groupInfo,
    translation.memberActions,
    translation.groupMembers,
    translation.addMembers,
    translation.editGroupInfo,
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [groupInfo, setGroupInfo] = useState();
  const [groupMembers, setGroupMembers] = useState();
  const [groupOwners, setGroupOwners] = useState();
  const [currentUserOwner, setCurrentUserOwner] = useState(false);
  const [currentUserMember, setCurrentUserMember] = useState(false);
  const [cognitoUser, setCognitoUser] = useState();
  const [userId, setUserId] = useState();
  const [groupId, setGroupId] = useState();
  const [leaveGroupWarning, setLeaveGroupWarning] = useState(false);
  const navigate = useNavigate();
  const groupLink =
    groupInfo &&
    '/group-profile/'.concat(
      encodeURI(groupInfo.group_name),
      '/add/',
      uuidv4(),
      '-',
      groupId ** 2
    );

  useEffect(() => {
    const getGroupAndUserInfo = async () => {
      const [cognitoRes, groupInfoRes] = await Promise.all([
        Auth.currentAuthenticatedUser(),
        API.graphql({
          query: getSingleGroupByName,
          variables: { group_name: groupName },
        }),
      ]);
      setCognitoUser(cognitoRes);
      setGroupInfo(groupInfoRes.data.getSingleGroupByName);
      const currentUserId = Number(cognitoRes.attributes['custom:id']);
      setUserId(currentUserId);
      const currentGroupId = groupInfoRes.data.getSingleGroupByName.group_id;
      setGroupId(currentGroupId);
    };
    getGroupAndUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName]);

  useEffect(() => {
    //gets list of all users, checks to see if current user is a group member
    const getGroupUsers = async () => {
      const memberRes = await API.graphql({
        query: getAllUsersInGroup,
        variables: { group_id: groupId },
      });
      const members = memberRes.data.getAllUsersInGroup;
      setGroupMembers(members);
      const memberIds = members.map((member) => member.user_id);
      if (memberIds.includes(userId)) {
        setCurrentUserMember(true);
      }
    };

    //gets array of all group owners and checks if the current user is a owner
    const isUserGroupOwner = async () => {
      const ownerRes = await API.graphql({
        query: getAllOwnersInGroup,
        variables: { group_id: groupId },
      });
      const owners = ownerRes.data.getAllOwnersInGroup;
      setGroupOwners(owners);
      const ownerIds = owners.map((owner) => owner.user_id);
      if (ownerIds.includes(userId)) {
        setCurrentUserOwner(true);
      }
    };

    if (userId && groupId) {
      getGroupUsers();
      isUserGroupOwner();
    }
  }, [userId, groupId, groupInfo]);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const getUpdatedGroup = async (id) => {
    const updatedGroupRes = await API.graphql({
      query: getSingleGroup,
      variables: { group_id: id },
    });
    setGroupInfo(updatedGroupRes.data.getSingleGroup);
  };

  return (
    <>
      {groupInfo && (
        <>
          <Grid
            container
            alignItems={{ xs: 'center' }}
            direction={{ xs: 'column', lg: 'row' }}
            sx={{ mt: '0' }}
            gap={{ xs: '2em', lg: '0' }}
            textAlign={{ xs: 'center', md: 'left' }}
          >
            <Grid
              container
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              alignItems={{ xs: 'center' }}
              spacing={{ xs: 4, sm: 8 }}
              sx={{ mb: '1.5em', overflow: 'auto' }}
            >
              <Grid item xs={2}>
                <Avatar
                  variant="rounded"
                  sx={{
                    background: '#5bc1ab',
                    borderRadius: 5,
                    boxShadow: '8px 8px 16px rgb(0 0 0 / 43%)',
                    border: '1px solid #000000',
                    padding: '30px 30px 30px 30px',
                    width: 150,
                    height: 150,
                  }}
                  src={groupInfo.group_image ? groupInfo.group_image : null}
                >
                  {groupInfo.group_name.charAt(0)}
                </Avatar>
              </Grid>
              <Grid
                item
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.5em',
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    wordWrap: 'break-word',
                    maxWidth: { xs: '300px', sm: '100%' },
                  }}
                >
                  {groupName}
                </Typography>
                <Grid
                  container
                  sx={{
                    display: 'flex',
                    gap: '20px',
                    color: '#BCF10C',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PeopleAlt />
                    <Typography component="div" variant="subtitle2">
                      {translation.membersColon}{' '}
                      {groupMembers && groupMembers.length}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {groupInfo.is_public ? <Public /> : <Lock />}
                    <Typography component="div" variant="subtitle2">
                      {groupInfo.is_public
                        ? translation.public
                        : translation.private}
                    </Typography>
                  </Stack>
                </Grid>
                {currentUserMember ? (
                  <Button
                    variant="contained"
                    sx={{ mt: { xs: '1em' } }}
                    onClick={() => setLeaveGroupWarning(true)}
                  >
                    {translation.leaveGroup}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ mt: { xs: '1em' } }}
                    onClick={() => {
                      navigate(groupLink);
                    }}
                  >
                    {translation.joinGroup}
                  </Button>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={7.5}
                justifyContent="center"
                sx={{ width: '70%' }}
              >
                <Box
                  component={Paper}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-evenly',
                    backgroundColor: '#DBE2EF',
                    borderRadius: '10px',
                    background:
                      'linear-gradient(91.49deg, #56C573 0.29%, #5BC0AC 100%)',
                    padding: '1em',
                    width: '100%',
                    gap: { xs: '0.5em', md: '2' },
                  }}
                >
                  <StyledPaper
                    elevation={6}
                    sx={{ background: 'white', flex: '1' }}
                  >
                    <Typography variant="h4">
                      {translation.co2SavedWeek}
                    </Typography>
                    <Typography variant="h5" className="statValue">
                      <AutoGraphOutlined fontSize="large" />
                      {groupInfo.weekly_co2.toFixed(4)}g
                    </Typography>
                  </StyledPaper>
                  <StyledPaper
                    elevation={6}
                    sx={{ background: 'white', flex: '1' }}
                  >
                    <Typography variant="h4">
                      {translation.totalCO2Saved}
                    </Typography>
                    <Typography variant="h5" className="statValue">
                      {Math.ceil(groupInfo.total_co2)}g
                    </Typography>
                  </StyledPaper>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              item
              sx={{
                mt: { xs: '2em', md: '3em' },
                width: { xs: '90%' },
              }}
            >
              <GroupPageLeaderboard
                currentGroup={groupInfo}
                groupMembers={groupMembers}
                userId={userId}
                user={user}
              />
            </Grid>
            <Grid
              container
              item
              sx={{
                mt: { xs: '2em', md: '3em' },
                width: { xs: '90%' },
              }}
            >
              <Typography variant="h2" paddingBottom={4}>
                {translation.groupInfo}
              </Typography>
              <TabContext value={selectedTab}>
                <Box
                  sx={{
                    borderBottom: 1,
                    borderTop: 1,
                    borderColor: 'divider',
                    maxWidth: { xs: 320, sm: '100%' },
                    width: { sm: '100%' },
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
                    <Tab label={translation.groupInfo} value={tabs[0]} />
                    <Tab label={translation.memberActions} value={tabs[1]} />
                    <Tab label={translation.groupMembers} value={tabs[2]} />
                    {/* only display following tabs if current user is a group owner */}
                    {currentUserOwner && (
                      <Tab label={translation.addMembers} value={tabs[3]} />
                    )}
                    {currentUserOwner && (
                      <Tab label={translation.editGroupInfo} value={tabs[4]} />
                    )}
                  </TabList>
                </Box>
                <TabPanel
                  value={tabs[0]}
                  sx={{
                    width: '100%',
                  }}
                >
                  <GroupInfoPanel
                    groupOwners={groupOwners}
                    groupInfo={groupInfo}
                  />
                </TabPanel>
                <TabPanel
                  value={tabs[1]}
                  sx={{
                    padding: { xs: '0' },
                    width: '100%',
                  }}
                >
                  <MemberActionsPanel
                    groupInfo={groupInfo}
                    cognitoUser={cognitoUser}
                  />
                </TabPanel>
                <TabPanel
                  value={tabs[2]}
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
                    cognitoUser={cognitoUser}
                  />
                </TabPanel>
                <TabPanel
                  value={tabs[3]}
                  sx={{
                    padding: { xs: '1.5em 0' },
                    width: '100%',
                  }}
                >
                  <AddMemberPanel groupInfo={groupInfo} />
                </TabPanel>
                <TabPanel
                  value={tabs[4]}
                  sx={{
                    padding: { xs: '1.5em 0' },
                    width: '100%',
                  }}
                >
                  <EditGroupPanel
                    groupInfo={groupInfo}
                    getUpdatedGroup={getUpdatedGroup}
                  />
                </TabPanel>
              </TabContext>
            </Grid>
          </Grid>
          {/* leave group warning dialog */}
          <Dialog
            aria-labelledby="leave-group-dialog"
            PaperProps={{
              sx: {
                p: '1em',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
              },
            }}
            open={leaveGroupWarning}
          >
            <IconButton
              sx={{ alignSelf: 'flex-end' }}
              onClick={() => setLeaveGroupWarning(false)}
            >
              <Close />
            </IconButton>
            <LeaveGroupDialogContent
              handleClose={() => setLeaveGroupWarning(false)}
              groupInfo={groupInfo}
              groupMembers={groupMembers}
              currentUserOwner={currentUserOwner}
              userId={userId}
            />
          </Dialog>
        </>
      )}
    </>
  );
};

export default GroupProfile;
