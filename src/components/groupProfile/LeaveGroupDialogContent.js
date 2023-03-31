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

import useTranslation from '../customHooks/translations';

const LeaveGroupWarningDialogContent = ({
  groupInfo,
  handleClose,
  groupMembers,
  currentUserOwner,
  userId,
  cognitoUser,
}) => {
  const { group_id, group_name } = groupInfo;
  const [deleteGroupSuccess, setDeleteGroupSuccess] = useState(false);
  const [leaveGroupSuccess, setLeaveGroupSuccess] = useState(false);
  const allOwners =
    groupMembers &&
    groupMembers.filter((member) => member.user_role === 'owner');
  const [userIsOnlyOwner, setUserIsOnlyOwner] = useState(
    allOwners.some((owner) => owner.user_id === userId) &&
      allOwners.length === 1
  );
  const navigate = useNavigate();
  const translation = useTranslation();

  //each time a member is updated, get the updated number of group owners and check if user is the only owner
  useEffect(() => {
    const isOnlyOwner =
      allOwners.length === 1 &&
      allOwners.some((owner) => owner.user_id === userId);
    setUserIsOnlyOwner(isOnlyOwner);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <DialogTitle>{translation.warning}</DialogTitle>
          <WarningAmberIcon fontSize="large" />
          <DialogContent>
            {translation.leaveGroupLastMemberWarning}
          </DialogContent>
          <DialogActions sx={{ display: 'flex', gap: '3em' }}>
            <Button variant="contained" onClick={handleClose}>
              {translation.cancel}
            </Button>
            <Button variant="outlined" onClick={deleteCurrentGroup}>
              {translation.leave}
            </Button>
          </DialogActions>
        </>
      );
    } else if (
      userIsOnlyOwner &&
      Number(cognitoUser.attributes['custom:id']) === userId
    ) {
      return (
        <>
          <DialogTitle>{translation.leaveGroup}</DialogTitle>
          <WarningAmberIcon fontSize="large" />
          <DialogContent>
            {translation.promoteOtherUserBeforeLeavingGroup}
          </DialogContent>
        </>
      );
    } else if (
      userIsOnlyOwner &&
      Number(cognitoUser.attributes['custom:id']) !== userId
    ) {
      return (
        <>
          <DialogTitle>{translation.removeGroupOwner}</DialogTitle>
          <WarningAmberIcon fontSize="large" />
          <DialogContent>
            {translation.promoteOtherUserBeforeRemovingUser}
          </DialogContent>
        </>
      );
    }
  };

  const renderSuccessContent = () => {
    if (deleteGroupSuccess) {
      return (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>{translation.success}</DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>
              {translation.formatString(translation.groupDeletedMsg, group_name)} <br></br>{translation.homepageRedirectMsg}
            </Typography>
            <CircularProgress sx={{ mt: '2em' }} />
          </DialogContent>
        </>
      );
    } else if (leaveGroupSuccess) {
      return (
        <>
          <DialogTitle sx={{ textAlign: 'center' }}>{translation.success}</DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>
              {translation.leftGroup} <br></br>{translation.homepageRedirectMsg}
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
