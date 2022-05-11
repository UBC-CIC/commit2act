import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountCircle,
  PersonAddAlt1,
  PersonRemove,
  GroupRemove,
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
}) => {
  const dialogDisplayInitial = {
    promoteUserSuccess: false,
    demoteOwnerSuccess: false,
    removeUserSuccess: false,
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

  const getUpdatedMembers = async () => {
    const res = await API.graphql({
      query: getAllUsersInGroup,
      variables: { group_id: groupInfo.group_id },
    });
    setGroupMembers(res.data.getAllUsersInGroup);
  };

  //everytime a member is updated, run query to get list of all updated members to reload and update the parent component
  useEffect(() => {
    getUpdatedMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membersUpdated]);

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
          PaperProps={{ sx: { p: '1em' } }}
          open={openDialog}
          onClose={handleClose}
        >
          {/* if there are no success messages to show, display the initial dialog menu */}
          {Object.values(dialogDisplay).every((value) => value === false) && (
            <>
              <DialogTitle>{selectedMember.name}</DialogTitle>
              <DialogContent>
                Role:{' '}
                {selectedMember.user_role.charAt(0).toUpperCase() +
                  selectedMember.user_role.slice(1)}
              </DialogContent>
              <List sx={{ pt: 0 }}>
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
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default GroupMemberDialog;
