import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { getAllGroups, getAllGroupsForUser } from '../graphql/queries';
import { API } from 'aws-amplify';
import GroupCard from '../components/GroupCard';

const FindGroup = ({ user }) => {
  const [groups, setGroups] = useState();
  const [usersGroups, setUsersGroups] = useState();
  const [input, setInput] = useState('');
  const [filteredGroups, setFilteredGroups] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const getGroups = async () => {
      const [allGroupsRes, usersGroupsRes] = await Promise.all([
        API.graphql({
          query: getAllGroups,
        }),
        API.graphql({
          query: getAllGroupsForUser,
          variables: { user_id: user.user_id },
        }),
      ]);
      setGroups(allGroupsRes.data.getAllGroups);
      setUsersGroups(usersGroupsRes.data.getAllGroupsForUser);

      const filtered = allGroupsRes.data.getAllGroups.filter((group) => {
        return group.is_public;
      });

      const sorted = filtered.sort((a, b) => {
        return b.monthly_points - a.monthly_points;
      });
      setFilteredGroups(sorted);
    };
    user && getGroups();
  }, [user]);

  useEffect(() => {
    renderFilteredGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const renderFilteredGroups = () => {
    if (groups) {
      if (input === '') {
        setError(false);
        const filtered = groups.filter((group) => {
          return group.is_public;
        });

        const sorted = filtered.sort((a, b) => {
          return b.monthly_points - a.monthly_points;
        });
        setFilteredGroups(sorted);
      } else {
        const filtered = groups.filter((group) => {
          return (
            group.is_public &&
            group.group_name.toLowerCase().includes(input.toLowerCase())
          );
        });
        setFilteredGroups(filtered);
      }
    }
  };

  const checkGroup = () => {
    if (!filteredGroups || !filteredGroups.length) {
      setError(true);
    }
  };

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Search For A Group
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: { xs: '3em' } }}>
          Enter the group name of any public group
        </Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          label="Search"
          value={input}
          sx={{ my: '2em' }}
          onChange={(e) => setInput(e.target.value)}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: <Search sx={{ mr: '1em' }} />,
            endAdornment: input && (
              <IconButton onClick={(e) => setInput('')}>
                <Clear />
              </IconButton>
            ),
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              checkGroup();
              e.preventDefault();
            }
          }}
        />
        {error && (
          <Typography variant="subtitle2">
            Your search for "{input}" did not match any public groups
          </Typography>
        )}
      </Box>

      {(() => {
        if (input === '') {
          return (
            <Typography variant="subtitle2" my={'1rem'}>
              Here are the top 5 public groups who you may want to be a part of
            </Typography>
          );
        } else {
          return (
            <Typography variant="subtitle2" my={'1rem'}>
              Search results
            </Typography>
          );
        }
      })()}

      {filteredGroups &&
        usersGroups &&
        filteredGroups.map((group, index) => (
          <GroupCard
            key={index}
            group={group}
            joinGroupOption={
              !usersGroups.some(
                (userGroup) => userGroup.group_id === group.group_id
              )
            }
            user={user}
          />
        ))}
    </>
  );
};

export default FindGroup;
