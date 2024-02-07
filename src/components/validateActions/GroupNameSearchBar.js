import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Stack,
  Pagination,
  LinearProgress,
} from '@mui/material';
import { API } from 'aws-amplify';
import { Search } from '@mui/icons-material';
import { getAllGroupsUserOwns } from '../../graphql/queries';
import ValidationNeededCard from './ValidationNeededCard';

import useTranslation from '../customHooks/translations';

const GroupNameSearchBar = ({
  user,
  getAllActionsToValidate,
  allActionsToValidate,
}) => {
  const [groupsOwnedByUser, setGroupsOwnedByUser] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filteredActions, setFilteredActions] = useState();
  //for pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const rowsPerPage = 5;

  const translation = useTranslation();

  useEffect(() => {
    const getGroupsAndAllActions = async () => {
      const groupRes = await API.graphql({
        query: getAllGroupsUserOwns,
        variables: { user_id: user.user_id },
      });
      setGroupsOwnedByUser(groupRes.data.getAllGroupsUserOwns);
    };
    user && getGroupsAndAllActions();
  }, [user]);

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
  //if there is no group selected, set page count to default length for all actions
  useEffect(() => {
    if (selectedGroup) {
      const filteredActionArray = allActionsToValidate.filter((action) =>
        action.group_names.split(', ').includes(selectedGroup)
      );
      setFilteredActions(filteredActionArray);
      setPage(1);
    } else {
      const allActionsPageCount =
        allActionsToValidate &&
        (allActionsToValidate.length % 5 === 0
          ? Math.round(allActionsToValidate.length / 5)
          : Math.floor(allActionsToValidate.length / 5 + 1));

      setPageCount(allActionsPageCount);
      setPage(1);
    }
  }, [selectedGroup, allActionsToValidate]);

  useEffect(() => {
    const filteredActionsPageCount =
      filteredActions &&
      (filteredActions.length % 5 === 0
        ? Math.round(filteredActions.length / 5)
        : Math.floor(filteredActions.length / 5 + 1));

    setPageCount(filteredActionsPageCount);
  }, [filteredActions]);

  const renderPagination = () => {
    return (
      <Pagination
        showFirstButton
        showLastButton
        count={pageCount}
        page={page}
        onChange={(e, newPage) => setPage(newPage)}
        sx={{
          '&.MuiPagination-root': { mt: '3em', alignSelf: 'center' },
        }}
        size="large"
      />
    );
  };

  return (
    <>
      {!groupsOwnedByUser && (
        <LinearProgress aria-label="loading groups search" sx={{ mt: '3em' }} />
      )}
      {groupsOwnedByUser && (
        <>
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
                label={translation.search}
                sx={{ my: '3em' }}
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
        </>
      )}
      {error && (
        <Typography variant="subtitle2">
          {translation.formatString(translation.groupNameSearchEmptySearch, input)}
        </Typography>
      )}
      <Box sx={{ mt: '1.5em' }}>
        {!error && groupsOwnedByUser && groupsOwnedByUser.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="div" variant="subtitle2">
              {translation.groupNameSearchNoGroups}
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
              {translation.filteringBy}&nbsp;
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ color: '#7e7e7e', fontWeight: 500 }}
              >
                {!selectedGroup ? translation.groupNameSearchAllFilter : selectedGroup}
              </Typography>
            </Typography>
          )
        )}
        {((allActionsToValidate && allActionsToValidate.length === 0) ||
          (filteredActions && filteredActions.length === 0)) && (
          <Typography
            component="p"
            variant="subtitle2"
            sx={{ textAlign: 'center', mt: '1em' }}
          >
            {translation.validateActionsNoActions}
          </Typography>
        )}
        <Stack spacing={2}>
          {/* if group has not been selected, display all actions */}
          {!selectedGroup &&
            allActionsToValidate &&
            allActionsToValidate.length > 0 &&
            allActionsToValidate
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((action, index) => (
                <ValidationNeededCard
                  action={action}
                  key={index}
                  getAllActions={getAllActionsToValidate}
                  groupsOwnedByUser={groupsOwnedByUser}
                />
              ))}
          {/* if group has been selected, display only actions from that group */}
          {selectedGroup &&
            filteredActions &&
            filteredActions
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((action, index) => (
                <ValidationNeededCard
                  action={action}
                  key={index}
                  getAllActions={getAllActionsToValidate}
                  groupsOwnedByUser={groupsOwnedByUser}
                />
              ))}
          {renderPagination()}
        </Stack>
      </Box>
    </>
  );
};

export default GroupNameSearchBar;
