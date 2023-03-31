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
} from '@mui/material';
import {
  AccountCircle,
  PersonAddAlt1,
  PersonRemove,
  GroupRemove,
  ExitToApp,
  Close,
  ErrorOutline,
} from '@mui/icons-material';
import {
  promoteGroupMember,
  demoteGroupOwner,
  removeGroupMember,
} from '../../graphql/mutations';
import { getAllUsersInGroup } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import LeaveGroupDialogContent from './LeaveGroupDialogContent';

import useTranslation from '../customHooks/translations';

const GroupMemberDialog = ({
  selectedMember,
  openDialog,
  handleClose,
  groupInfo,
  groupMembers,
  setGroupMembers,
  currentUserOwner,
  cognitoUser,
}) => {
  const dialogDisplayInitial = {
    promoteUserSuccess: false,
    demoteOwnerSuccess: false,
    removeUserSuccess: false,
    leaveGroupWarning: false,
    demoteWarning: false,
  };
  const [dialogDisplay, setDialogDisplay] = useState(dialogDisplayInitial);
  const [membersUpdated, setMembersUpdated] = useState(false);
  const userType = cognitoUser && cognitoUser.attributes['custom:type'];
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
    if (
      groupMembers.filter((member) => member.user_role === 'owner').length === 1
    ) {
      setDialogDisplay({ ...dialogDisplay, demoteWarning: true });
    } else {
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
    }
  };
  const translation = useTranslation();

  const removeUser = async () => {
    //check if leaving user is the only owner
    const allOwners =
      groupMembers &&
      groupMembers.filter((member) => member.user_role === 'owner');
    const isOnlyOwner =
      allOwners.length === 1 &&
      allOwners.some((owner) => owner.user_id === selectedMember.user_id);
    //if there is only 1 group member, or if the user being removed is the only owner, show warning
    if (groupMembers.length === 1 || isOnlyOwner) {
      setDialogDisplay({ ...dialogDisplay, leaveGroupWarning: true });
    } else {
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
    }
  };

  //each time a member is updated, run query to get list of all updated members to reload and update the parent component
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
  const renderOwnerAdminView = () => {
    return (
      (currentUserOwner || userType === 'Admin') && (
        <>
          {selectedMember.user_role === 'member' ? (
            <ListItem autoFocus button onClick={promoteUser}>
              <ListItemIcon>
                <PersonAddAlt1 />
              </ListItemIcon>
              <ListItemText>{translation.promoteUserToOwner}</ListItemText>
            </ListItem>
          ) : (
            <ListItem autoFocus button onClick={demoteOwner}>
              <ListItemIcon>
                <PersonRemove />
              </ListItemIcon>
              <ListItemText>{translation.demoteUserToMember}</ListItemText>
            </ListItem>
          )}
          <ListItem autoFocus button onClick={removeUser}>
            <ListItemIcon>
              <GroupRemove />
            </ListItemIcon>
            <ListItemText>{translation.removeUserFromGroup}</ListItemText>
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
          PaperProps={{
            sx: {
              p: '1em',
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              alignItems: 'center',
              minWidth: '30%',
            },
          }}
          open={openDialog}
          onClose={handleClose}
        >
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
            <Close />
          </IconButton>
          {/* if current cognito user is the selected member, give option to leave group */}
          {!dialogDisplay.leaveGroupWarning &&
          selectedMember.user_id ===
            Number(cognitoUser.attributes['custom:id']) ? (
            <>
              <DialogTitle>{selectedMember.name}</DialogTitle>
              <DialogContent>
                {translation.yourRoleColon}{' '}
                {selectedMember.user_role.charAt(0).toUpperCase() +
                  selectedMember.user_role.slice(1)}
              </DialogContent>
              <List sx={{ pt: '1em', pb: '2em' }}>
                <ListItem
                  autoFocus
                  button
                  onClick={() =>
                    setDialogDisplay({
                      ...dialogDisplay,
                      leaveGroupWarning: true,
                    })
                  }
                >
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText>{translation.leaveGroup}</ListItemText>
                </ListItem>
              </List>
            </>
          ) : (
            /* if there are no success messages to show, display the initial dialog menu */
            Object.values(dialogDisplay).every((value) => value === false) && (
              <>
                <DialogTitle>{selectedMember.name}</DialogTitle>
                <DialogContent>
                  {translation.roleColon}{' '}
                  {selectedMember.user_role.charAt(0).toUpperCase() +
                    selectedMember.user_role.slice(1)}
                </DialogContent>
                <List sx={{ pt: '1em', pb: '2em' }}>
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
                    <ListItemText>{translation.viewUserProfile}</ListItemText>
                  </ListItem>
                  {renderOwnerAdminView()}
                </List>
              </>
            )
          )}
          {dialogDisplay.promoteUserSuccess && (
            <>
              <DialogTitle>{translation.success}</DialogTitle>
              <DialogContent>
                {translation.formatString(translation.successUserNowOwner, selectedMember.name)}
              </DialogContent>
            </>
          )}
          {dialogDisplay.demoteOwnerSuccess && (
            <>
              <DialogTitle>{translation.success}</DialogTitle>
              <DialogContent>
                {translation.formatString(translation.successUserNowMember, selectedMember.name)}
              </DialogContent>
            </>
          )}
          {dialogDisplay.removeUserSuccess && (
            <>
              <DialogTitle>{translation.success}</DialogTitle>
              <DialogContent>
                {translation.formatString(translation.successUserNowRemoved, selectedMember.name)}
              </DialogContent>
            </>
          )}
          {dialogDisplay.demoteWarning && (
            <>
              <DialogTitle>{translation.demotionErrorTitle}</DialogTitle>
              <ErrorOutline fontSize="large" />
              <DialogContent>
                {translation.demotionErrorText}
              </DialogContent>
            </>
          )}

          {dialogDisplay.leaveGroupWarning && (
            <LeaveGroupDialogContent
              handleClose={() =>
                setDialogDisplay({
                  ...dialogDisplay,
                  leaveGroupWarning: false,
                })
              }
              groupInfo={groupInfo}
              groupMembers={groupMembers}
              currentUserOwner={currentUserOwner}
              userId={selectedMember.user_id}
              cognitoUser={cognitoUser}
            />
          )}
        </Dialog>
      )}
    </>
  );
};

export default GroupMemberDialog;
