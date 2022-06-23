import React, { useState, useEffect } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { API } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { deleteGroup, removeGroupMember } from '../../graphql/mutations';

const LeaveGroupWarningDialogContent = ({
  groupInfo,
  handleClose,
  groupMembers,
  currentUserOwner,
  userId,
}) => {
  const { group_id, group_name } = groupInfo;
  const [deleteGroupSuccess, setDeleteGroupSuccess] = useState(false);
  const [leaveGroupSuccess, setLeaveGroupSuccess] = useState(false);
  const [userIsOnlyOwner, setUserIsOnlyOwner] = useState(
    currentUserOwner &&
      groupMembers.filter((member) => member.user_role === 'owner').length === 1
  );
  const navigate = useNavigate();

  //each time a member is updated, get the updated number of group owners and check if user is the only owner
  useEffect(() => {
    const numOwners = groupMembers.filter(
      (member) => member.user_role === 'owner'
    ).length;
    setUserIsOnlyOwner(currentUserOwner && numOwners === 1);
  }, [currentUserOwner, groupMembers]);

  //if there is more than 1 group member and the user is not the only group owner, remove the user from the group
  useEffect(() => {
    if (groupMembers.length > 1 && !userIsOnlyOwner) {
      leaveGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupMembers, userIsOnlyOwner]);

  const leaveGroup = async () => {
    try {
      setLeaveGroupSuccess(true);
      await API.graphql({
        query: removeGroupMember,
        variables: {
          group_id: groupInfo.group_id,
          user_id: userId,
        },
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteCurrentGroup = async () => {
    await API.graphql({
      query: deleteGroup,
      variables: { group_id: group_id },
    });
    setDeleteGroupSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const renderWarningContent = () => {
    if (groupMembers.length === 1) {
      return (
        <>
          <DialogTitle> Warning!</DialogTitle>
          <WarningAmberIcon fontSize="large" />
          <DialogContent>
            This group will be deleted since there will be no group members.
          </DialogContent>
          <DialogActions sx={{ display: 'flex', gap: '3em' }}>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={deleteCurrentGroup}>
              Leave
            </Button>
          </DialogActions>
        </>
      );
    } else if (userIsOnlyOwner) {
      return (
        <>
          <DialogTitle>Leave Group</DialogTitle>
          <WarningAmberIcon fontSize="large" />
          <DialogContent>
            You must promote another user to group owner before leaving the
            group.
          </DialogContent>
        </>
      );
    }
  };

  const renderSuccessContent = () => {
    if (deleteGroupSuccess) {
      return (
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
              {group_name} has been deleted! <br></br>You will now be directed
              to the homepage
            </Typography>
            <CircularProgress sx={{ mt: '2em' }} />
          </DialogContent>
        </>
      );
    } else if (leaveGroupSuccess) {
      return (
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
              You have left the the group! <br></br>You will now be directed to
              the homepage
            </Typography>
            <CircularProgress sx={{ mt: '2em' }} />
          </DialogContent>
        </>
      );
    }
  };

  return (
    <>
      {!deleteGroupSuccess && !leaveGroupSuccess
        ? renderWarningContent()
        : renderSuccessContent()}
    </>
  );
};

export default LeaveGroupWarningDialogContent;
