import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
import {
  getSingleGroup,
  getAllUsersInGroup,
  isPrivateGroupPasswordCorrect,
} from '../graphql/queries';
import { addGroupMember } from '../graphql/mutations';
import {
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledDialog = styled(Dialog)`
  text-align: center;
  .MuiDialog-paper {
    justify-content: center;
    align-items: center;
    padding: 1em;
  }
`;

const JoinGroup = ({ user }) => {
  const { groupName, addUserLink } = useParams();
  const [group, setGroup] = useState();
  const [alreadyInGroup, setAlreadyInGroup] = useState(false);
  const [addPublicMember, setAddPublicMember] = useState(false);
  const [addPrivateMember, setAddPrivateMember] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [privateGroupForm, setPrivateGroupForm] = useState({ password: '' });
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const renderAddMemberView = async () => {
    if (user.user_id) {
      //decode group id
      const hashedId = addUserLink.split('-').pop();
      const groupId = Math.sqrt(hashedId);
      //get group info, see if user already belongs to group by getting array of all member ids, then checking to see if array includes the current user id
      const [groupInfoRes, groupMemberRes] = await Promise.all([
        API.graphql({
          query: getSingleGroup,
          variables: { group_id: groupId },
        }),
        await API.graphql({
          query: getAllUsersInGroup,
          variables: { group_id: groupId },
        }),
      ]);
      const groupInfo = groupInfoRes.data.getSingleGroup;
      setGroup(groupInfo);
      const groupMemberData = groupMemberRes.data.getAllUsersInGroup;
      const groupMemberIds = groupMemberData.map((member) => member.user_id);
      if (groupMemberIds.includes(user.user_id)) {
        setAlreadyInGroup(true);
      } else if (
        !groupMemberIds.includes(user.user_id) &&
        groupInfo.is_public
      ) {
        //if group is public, load add member view
        setAddPublicMember(true);
        //if group is private, load add member with password view
      } else if (
        !groupMemberIds.includes(user.user_id) &&
        !groupInfo.is_public
      ) {
        setAddPrivateMember(true);
      }
    }
  };

  useEffect(() => {
    user && renderAddMemberView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateForm = (e) => {
    setPrivateGroupForm({
      ...privateGroupForm,
      [e.target.name]: e.target.value,
    });
  };

  //redirect user to landing page
  const redirectHome = () => {
    navigate('/');
  };

  //redirect user to group profile page
  const redirectProfile = () => {
    navigate(`/group-profile/${groupName}`);
  };

  //if group is private, checks that user inputted password matches group private_password field
  const checkPassword = async () => {
    if (!group.is_public) {
      const passwordRes = await API.graphql({
        query: isPrivateGroupPasswordCorrect,
        variables: {
          group_id: group.group_id,
          private_password: privateGroupForm.password,
        },
      });
      let passwordsMatch = passwordRes.data.isPrivateGroupPasswordCorrect;
      if (passwordsMatch) {
        addUser();
      } else {
        setPasswordError(true);
      }
    }
  };

  const addUser = async () => {
    try {
      const res = await API.graphql({
        query: addGroupMember,
        variables: {
          group_id: group.group_id,
          user_id: user.user_id,
        },
      });
      console.log(res);
      setUserAdded(true);
      setTimeout(() => {
        redirectProfile();
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {alreadyInGroup && (
        <StyledDialog aria-labelledby="already-member-dialog" open={true}>
          <DialogTitle>You are already a member of this group!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select Cancel to be redirected to home page
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={redirectHome}>Cancel</Button>
          </DialogActions>
        </StyledDialog>
      )}
      {addPublicMember && (
        <StyledDialog aria-labelledby="add-public-member-dialog" open={true}>
          <DialogTitle>You have been invited to join {groupName}</DialogTitle>
          {userAdded ? (
            <>
              <DialogContent>
                <CircularProgress />
                <Alert severity="success" sx={{ mt: '1em' }}>
                  Success! Redirecting to {groupName}'s profile page
                </Alert>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogContent>
                <DialogContentText>
                  Please confirm by selecting Join. <br></br>Select Cancel to be
                  redirected to the home page.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={redirectHome}>Cancel</Button>
                <Button onClick={addUser}>Join</Button>
              </DialogActions>
            </>
          )}
        </StyledDialog>
      )}
      {addPrivateMember && (
        <StyledDialog aria-labelledby="add-private-member-dialog" open={true}>
          <DialogTitle>You have been invited to join {groupName}</DialogTitle>
          {userAdded ? (
            <>
              <DialogContent>
                <CircularProgress />
                <Alert severity="success" sx={{ mt: '1em' }}>
                  Success! Redirecting to {groupName}'s profile page
                </Alert>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogContent>
                <DialogContentText>
                  To join this group, please enter the group password and select
                  Join. <br></br> Select Cancel to be redirected to the home
                  page.
                </DialogContentText>
                <TextField
                  autoFocus
                  id="group-password"
                  label="Group Password"
                  name="password"
                  fullWidth
                  variant="standard"
                  value={privateGroupForm.password}
                  onChange={updateForm}
                  sx={{ mt: '1em' }}
                />
              </DialogContent>
              {passwordError && (
                <Alert severity="error">Incorrect Password</Alert>
              )}
              <DialogActions>
                <Button onClick={redirectHome}>Cancel</Button>
                <Button onClick={checkPassword}>Join</Button>
              </DialogActions>
            </>
          )}
        </StyledDialog>
      )}
    </div>
  );
};

export default JoinGroup;
