import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  PersonAddAlt1,
  PersonRemove,
  GroupRemove,
  ExitToApp,
  Close,
} from '@mui/icons-material';
import {
  promoteGroupMember,
  demoteGroupOwner,
  removeGroupMember,
} from '../../graphql/mutations';
import { getAllUsersInGroup } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const GroupMemberDialog = ({
  selectedMember,
  openDialog,
  handleClose,
  groupInfo,
  setGroupMembers,
  currentUserOwner,
  cognitoUser,
}) => {
  const dialogDisplayInitial = {
    promoteUserSuccess: false,
    demoteOwnerSuccess: false,
    removeUserSuccess: false,
    leaveGroupSuccess: false,
  };
  const [dialogDisplay, setDialogDisplay] = useState(dialogDisplayInitial);
  const [membersUpdated, setMembersUpdated] = useState(false);
  const navigate = useNavigate();

  const promoteUser = async () => {
    try {
      await API.graphql({
        query: promoteGroupMember,
        variables: {
          group_id: groupInfo.group_id,
          user_id: selectedMember.user_id,
        },
      });
      setDialogDisplay({ ...dialogDisplay, promoteUserSuccess: true });
    } catch (err) {
      console.log(err);
    }
    setMembersUpdated(true);
  };

  const demoteOwner = async () => {
    try {
      await API.graphql({
        query: demoteGroupOwner,
        variables: {
          group_id: groupInfo.group_id,
          user_id: selectedMember.user_id,
        },
      });
      setDialogDisplay({ ...dialogDisplay, demoteOwnerSuccess: true });
    } catch (err) {
      console.log(err);
    }
    setMembersUpdated(true);
  };

  const removeUser = async () => {
    try {
      await API.graphql({
        query: removeGroupMember,
        variables: {
          group_id: groupInfo.group_id,
          user_id: selectedMember.user_id,
        },
      });
      setDialogDisplay({ ...dialogDisplay, removeUserSuccess: true });
    } catch (err) {
      console.log(err);
    }
    setMembersUpdated(true);
  };

  const leaveGroup = async () => {
    try {
      await API.graphql({
        query: removeGroupMember,
        variables: {
          group_id: groupInfo.group_id,
          user_id: selectedMember.user_id,
        },
      });
      setDialogDisplay({ ...dialogDisplay, leaveGroupSuccess: true });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.log(err);
    }
    setMembersUpdated(true);
  };

  //everytime a member is updated, run query to get list of all updated members to reload and update the parent component
  useEffect(() => {
    const getUpdatedMembers = async () => {
      const res = await API.graphql({
        query: getAllUsersInGroup,
        variables: { group_id: groupInfo.group_id },
      });
      setGroupMembers(res.data.getAllUsersInGroup);
    };
    getUpdatedMembers();
  }, [groupInfo.group_id, membersUpdated, setGroupMembers]);

  //display promote, demote and remove options only if current user is a group owner
  const renderOwnerView = () => {
    return (
      currentUserOwner && (
        <>
          {selectedMember.user_role === 'member' ? (
            <ListItem autoFocus button onClick={promoteUser}>
              <ListItemIcon>
                <PersonAddAlt1 />
              </ListItemIcon>
              <ListItemText>Promote User to Group Organizer</ListItemText>
            </ListItem>
          ) : (
            <ListItem autoFocus button onClick={demoteOwner}>
              <ListItemIcon>
                <PersonRemove />
              </ListItemIcon>
              <ListItemText>Demote User to Group Member</ListItemText>
            </ListItem>
          )}
          <ListItem autoFocus button onClick={removeUser}>
            <ListItemIcon>
              <GroupRemove />
            </ListItemIcon>
            <ListItemText>Remove User From Group</ListItemText>
          </ListItem>
        </>
      )
    );
  };

  return (
    <>
      {openDialog && (
        <Dialog
          aria-labelledby="already-member-dialog"
          PaperProps={{ sx: { minWidth: '20%', p: '1em' } }}
          open={openDialog}
          onClose={handleClose}
        >
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
            <Close />
          </IconButton>
          {/* if current cognito user is the selected member, give option to leave group */}
          {!dialogDisplay.leaveGroupSuccess &&
          selectedMember.user_id ===
            Number(cognitoUser.attributes['custom:id']) ? (
            <>
              <DialogTitle>{selectedMember.name}</DialogTitle>
              <DialogContent>
                Your Role:{' '}
                {selectedMember.user_role.charAt(0).toUpperCase() +
                  selectedMember.user_role.slice(1)}
              </DialogContent>
              <List sx={{ pt: 0, pb: '2em' }}>
                <ListItem autoFocus button onClick={leaveGroup}>
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText>Leave Group</ListItemText>
                </ListItem>
              </List>
            </>
          ) : (
            /* if there are no success messages to show, display the initial dialog menu */
            Object.values(dialogDisplay).every((value) => value === false) && (
              <>
                <DialogTitle>{selectedMember.name}</DialogTitle>
                <DialogContent>
                  Role:{' '}
                  {selectedMember.user_role.charAt(0).toUpperCase() +
                    selectedMember.user_role.slice(1)}
                </DialogContent>
                <List sx={{ pt: 0, pb: '2em' }}>
                  <ListItem
                    autoFocus
                    button
                    onClick={() =>
                      navigate(`/user-profile/${selectedMember.user_id}`)
                    }
                  >
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText>View User Profile</ListItemText>
                  </ListItem>
                  {renderOwnerView()}
                </List>
              </>
            )
          )}
          {dialogDisplay.promoteUserSuccess && (
            <>
              <DialogTitle> Success!</DialogTitle>
              <DialogContent>
                {selectedMember.name} is now a group owner
              </DialogContent>
            </>
          )}
          {dialogDisplay.demoteOwnerSuccess && (
            <>
              <DialogTitle> Success!</DialogTitle>
              <DialogContent>
                {selectedMember.name} is now a group member
              </DialogContent>
            </>
          )}
          {dialogDisplay.removeUserSuccess && (
            <>
              <DialogTitle> Success!</DialogTitle>
              <DialogContent>
                {selectedMember.name} has been removed from the group
              </DialogContent>
            </>
          )}
          {dialogDisplay.leaveGroupSuccess && (
            <>
              <DialogTitle sx={{ textAlign: 'center' }}> Success!</DialogTitle>
              <DialogContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography>
                  You have left the the group! <br></br>You will now be directed
                  to the homepage
                </Typography>
                <CircularProgress sx={{ mt: '2em' }} />
              </DialogContent>
            </>
          )}
        </Dialog>
      )}
    </>
  );
};

export default GroupMemberDialog;
