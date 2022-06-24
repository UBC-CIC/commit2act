import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import GroupNameSearchBar from './GroupNameSearchBar';
import ActionNameSearchBar from './ActionNameSearchBar';
import { API } from 'aws-amplify';
import { getAllSubmittedActionsToValidate } from '../../graphql/queries';

const MyGroupsPanel = ({ user }) => {
  const [allActions, setAllActions] = useState();
  const [filterOption, setFilterOption] = useState('Group Name');

  const handleFilterChange = (event, filter) => {
    setFilterOption(filter);
  };

  const getAllActionsToValidate = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: user.user_id },
    });
    setAllActions(res.data.getAllSubmittedActionsToValidate);
  };

  useEffect(() => {
    user && getAllActionsToValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: '3em',
          gap: '1em',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="subtitle2">Search By:</Typography>
        <ToggleButtonGroup
          color="primary"
          value={filterOption}
          exclusive
          onChange={handleFilterChange}
        >
          <ToggleButton value="Group Name">Group Name</ToggleButton>
          <ToggleButton value="Action Type Name">Action Name</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {filterOption === 'Group Name' ? (
        <GroupNameSearchBar
          user={user}
          getAllActionsToValidate={getAllActionsToValidate}
          allActionsToValidate={allActions}
        />
      ) : (
        <ActionNameSearchBar
          user={user}
          getAllActionsToValidate={getAllActionsToValidate}
          allActionsToValidate={allActions}
        />
      )}
    </>
  );
};
export default MyGroupsPanel;
