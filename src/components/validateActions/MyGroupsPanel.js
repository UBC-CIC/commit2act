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

import useTranslation from '../customHooks/translations';

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

  const translation = useTranslation();

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
          mt: '4em',
          gap: '1em',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography variant="subtitle2">{translation.searchByC}</Typography>
        <ToggleButtonGroup
          color="primary"
          value={filterOption}
          exclusive
          onChange={handleFilterChange}
        >
          <ToggleButton value="Group Name">{translation.groupName}</ToggleButton>
          <ToggleButton value="Action Type Name">{translation.actionName}</ToggleButton>
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
