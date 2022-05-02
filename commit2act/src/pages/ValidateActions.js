import React, { useState, useEffect } from 'react';
import { Box, Typography, Autocomplete, TextField } from '@mui/material';
import { API } from 'aws-amplify';
import { Search } from '@mui/icons-material';
import { getAllGroupsUserOwns } from '../graphql/queries';
import { useParams } from 'react-router-dom';

const ValidateActions = () => {
  const { userId } = useParams();
  const [groups, setGroups] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  const getGroups = async () => {
    const res = await API.graphql({
      query: getAllGroupsUserOwns,
      variables: { user_id: userId },
    });
    setGroups(res.data.getAllGroupsUserOwns);
  };

  useEffect(() => {
    getGroups();
  }, []);

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

  return (
    <Box sx={{ textAlign: { xs: 'center' } }}>
      <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
        Validate Actions
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: '1.5em' }}>
        Search for one of your groups to begin validating group member actions
      </Typography>
      {groups && (
        <Autocomplete
          freeSolo
          options={groups.map((group) => group.group_name)}
          value={selectedGroup}
          onChange={(e, newValue) => {
            setSelectedGroup(newValue);
          }}
          inputValue={input}
          onInputChange={(e, newInputValue) => handleInputChange(newInputValue)}
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
  );
};

export default ValidateActions;
