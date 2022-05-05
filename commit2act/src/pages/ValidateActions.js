import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Stack,
  CircularProgress,
} from '@mui/material';
import { API, Auth } from 'aws-amplify';
import { Search } from '@mui/icons-material';
import {
  getAllGroupsUserOwns,
  getAllSubmittedActionsToValidate,
} from '../graphql/queries';
import ValidationNeededCard from '../components/ValidationNeededCard';

const ValidateActions = () => {
  const [groups, setGroups] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [allActions, setAllActions] = useState();
  const [changed, setChanged] = useState();
  const [userId, setUserId] = useState();

  const getCognitoUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    const id = cognitoUserEntry.attributes['custom:id'];
    setUserId(id);
    getGroupsAndAllActions(id);
  };

  const getGroupsAndAllActions = async (id) => {
    const [groupRes, allActionRes] = await Promise.all([
      API.graphql({
        query: getAllGroupsUserOwns,
        variables: { user_id: id },
      }),
      API.graphql({
        query: getAllSubmittedActionsToValidate,
        variables: { user_id: id },
      }),
    ]);

    setGroups(groupRes.data.getAllGroupsUserOwns);
    setAllActions(allActionRes.data.getAllSubmittedActionsToValidate);
  };

  useEffect(() => {
    getCognitoUser();
  }, []);

  const getAllActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: userId },
    });
    setAllActions(res.data.getAllSubmittedActionsToValidate);
  };

  useEffect(() => {
    if (userId) {
      getAllActions();
    }
  }, [changed]);

  const checkGroup = () => {
    if (!groups.some((group) => group.group_name === input)) {
      setError(true);
    }
  };

  const handleInputChange = (value) => {
    if (value === '' || groups.some((group) => group.group_name === value)) {
      setError(false);
    }
    setInput(value);
  };

  //every time a group is selected, get all the actions in need of validation from users in that group
  // useEffect(() => {
  //   if (selectedGroup) {
  //   }
  // }, [selectedGroup]);

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Validate Actions
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: '2.5em' }}>
          Search for one of your groups to filter for specific actions
        </Typography>
        {!groups && <CircularProgress sx={{ mt: '1em' }} />}
        {groups && (
          <Autocomplete
            freeSolo
            options={groups.map((group) => group.group_name)}
            value={selectedGroup}
            onChange={(e, newValue) => {
              setSelectedGroup(newValue);
            }}
            inputValue={input}
            onInputChange={(e, newInputValue) =>
              handleInputChange(newInputValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                label="Search"
                sx={{ my: '2em' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search sx={{ mr: '1em' }} />
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    checkGroup();
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
        )}
        {error && (
          <Typography variant="subtitle2">
            Your search for "{input}" did not match any of your groups
          </Typography>
        )}
      </Box>
      <Box sx={{ mt: '3em' }}>
        <Stack spacing={2}>
          {allActions &&
            allActions.map((action, index) => (
              <ValidationNeededCard
                action={action}
                key={index}
                changed={changed}
                setChanged={setChanged}
              />
            ))}
        </Stack>
      </Box>
    </>
  );
};

export default ValidateActions;
