import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import { getSingleGroup, getAllMembersInGroup } from '../graphql/queries';
import { addGroupUser } from '../graphql/mutations';
import { Auth } from 'aws-amplify';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const JoinGroup = () => {
  const { groupName, addUserLink } = useParams();
  const [userId, setUserId] = useState();
  const [group, setGroup] = useState();
  const [alreadyInGroup, setAlreadyInGroup] = useState(false);
  const [addPublicMember, setAddPublicMember] = useState(false);
  const [addPrivateMember, setAddPrivateMember] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [privateGroupForm, setPrivateGroupForm] = useState({ password: '' });
  const navigate = useNavigate();

  const getUserInfo = async () => {
    //get user id of current cognito user
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const id = cognitoUser.attributes['custom:id'];
    setUserId(Number(id));
  };

  const renderAddMemberPanel = async () => {
    if (userId) {
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
          query: getAllMembersInGroup,
          variables: { group_id: groupId },
        }),
      ]);
      const groupInfo = groupInfoRes.data.getSingleGroup;
      setGroup(groupInfo);
      const groupMemberData = groupMemberRes.data.getAllMembersInGroup;
      const groupMemberIds = groupMemberData.map((member) => member.user_id);
      if (groupMemberIds.includes(userId)) {
        setAlreadyInGroup(true);
      } else if (!groupMemberIds.includes(userId) && groupInfo.is_public) {
        //if group is public, load add member view
        setAddPublicMember(true);
        //if group is private, load add member with password view
      } else if (!groupMemberIds.includes(userId) && !groupInfo.is_public) {
        setAddPrivateMember(true);
      }
    }
  };

  useEffect(() => {
    renderAddMemberPanel();
  }, [userId]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const updateForm = (e) => {
    setPrivateGroupForm({
      ...privateGroupForm,
      [e.target.name]: e.target.value,
    });
  };

  const redirectUser = () => {
    //if user has been successfully added to group, redirect to group profile page, otherwise redirect to landing page
    if (userAdded) {
      navigate(`/group-profile/${groupName}`);
    } else {
      navigate('/');
    }
  };

  const addUser = async () => {
    if (group.is_public) {
      const res = await API.graphql({
        query: addGroupUser,
        variables: {
          group_id: group.group_id,
          user_id: userId,
          user_role: 'member',
        },
      });
      console.log(res);
    } else {
      //if group is private, check that user inputted password matches group private_password field
    }

    setUserAdded(true);
  };

  return (
    <div>
      {alreadyInGroup && (
        <Dialog
          aria-labelledby="already-member-dialog"
          open={true}
          sx={{ textAlign: 'center' }}
        >
          <DialogTitle>You are already a member of this group!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Select Cancel to be redirected to home page
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={redirectUser}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
      {addPublicMember && (
        <Dialog aria-labelledby="add-public-member-dialog" open={true}>
          <DialogTitle>You have been invited to join {groupName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please confirm by selecting Join. Select Cancel to be redirected
              to the home page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={redirectUser}>Cancel</Button>
            <Button onClick={addUser}>Join</Button>
          </DialogActions>
        </Dialog>
      )}
      {addPrivateMember && (
        <Dialog aria-labelledby="add-private-member-dialog" open={true}>
          <DialogTitle>You have been invited to join {groupName}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To join this group, please enter the group password and select
              Join. Select Cancel to be redirected to the home page.
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={redirectUser}>Cancel</Button>
            <Button onClick={addUser}>Join</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default JoinGroup;
