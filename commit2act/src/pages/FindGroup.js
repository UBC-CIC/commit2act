import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAllGroups } from '../graphql/queries';
import { API } from 'aws-amplify';
import GroupCard from '../components/GroupCard';

const FindGroup = () => {
  const [groups, setGroups] = useState();
  const [input, setInput] = useState('');
  const [filteredGroups, setFilteredGroups] = useState();

  const getGroups = async () => {
    const res = await API.graphql({
      query: getAllGroups,
    });
    setGroups(res.data.getAllGroups);
  };

  useEffect(() => {
    getGroups();
  }, []);

  useEffect(() => {
    renderFilteredGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const renderFilteredGroups = () => {
    if (groups) {
      if (input === '') {
        setFilteredGroups([]);
      } else {
        const filtered = groups.filter((group) => {
          return group.group_name.toLowerCase().includes(input.toLowerCase());
        });
        setFilteredGroups(filtered);
      }
    }
  };

  return (
    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
      <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
        Search For A Group
      </Typography>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Search"
        value={input}
        sx={{ my: '2em' }}
        onChange={(e) => setInput(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton>
              <Search />
            </IconButton>
          ),
        }}
      />
      {filteredGroups &&
        filteredGroups.map((group, index) => (
          <GroupCard key={index} group={group} />
        ))}
    </Box>
  );
};

export default FindGroup;
