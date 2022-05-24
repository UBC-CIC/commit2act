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
  const [groupsOwnedByUser, setGroupsOwnedByUser] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [allActions, setAllActions] = useState();
  const [filteredActions, setFilteredActions] = useState();
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

    setGroupsOwnedByUser(groupRes.data.getAllGroupsUserOwns);
    setAllActions(allActionRes.data.getAllSubmittedActionsToValidate);
  };

  useEffect(() => {
    getCognitoUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: userId },
    });
    setAllActions(res.data.getAllSubmittedActionsToValidate);
  };

  const checkGroup = () => {
    if (!groupsOwnedByUser.some((group) => group.group_name === input)) {
      setError(true);
    }
  };

  const handleInputChange = (value) => {
    if (
      value === '' ||
      groupsOwnedByUser.some((group) => group.group_name === value)
    ) {
      setError(false);
    }
    setInput(value);
  };

  //every time a group is selected, get all the actions in need of validation from users in that group only
  useEffect(() => {
    if (selectedGroup) {
      const filteredActionArray = allActions.filter((action) =>
        action.group_names.split(', ').includes(selectedGroup)
      );
      setFilteredActions(filteredActionArray);
    }
  }, [selectedGroup, allActions]);

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Validate Actions
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: '2.5em' }}>
          Search for one of your groups to filter for specific actions
        </Typography>
        {!groupsOwnedByUser && <CircularProgress sx={{ mt: '1em' }} />}
        {groupsOwnedByUser && (
          <Autocomplete
            freeSolo
            options={groupsOwnedByUser.map((group) => group.group_name)}
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
      <Box sx={{ mt: '1.5em' }}>
        {!error && groupsOwnedByUser && groupsOwnedByUser.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="div" variant="subtitle2">
              You currently do not own any groups
            </Typography>
          </Box>
        ) : (
          groupsOwnedByUser && (
            <Typography
              component="div"
              variant="subtitle2"
              sx={{
                mb: '1.5em',
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              Filtering By:&nbsp;
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ color: '#7e7e7e', fontWeight: 500 }}
              >
                {!selectedGroup ? 'All' : selectedGroup}
              </Typography>
            </Typography>
          )
        )}
        <Stack spacing={2}>
          {/* if group has not been selected, display all actions */}
          {!selectedGroup &&
            allActions &&
            allActions.map((action, index) => (
              <ValidationNeededCard
                action={action}
                key={index}
                getAllActions={getAllActions}
                groupsOwnedByUser={groupsOwnedByUser}
              />
            ))}
          {/* if group has been selected, display only actions from that group */}
          {selectedGroup &&
            filteredActions &&
            filteredActions.map((action, index) => (
              <ValidationNeededCard
                action={action}
                key={index}
                getAllActions={getAllActions}
                groupsOwnedByUser={groupsOwnedByUser}
              />
            ))}
        </Stack>
      </Box>
    </>
  );
};

export default ValidateActions;
