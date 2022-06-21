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
import {
  getAllGroupsUserOwns,
  getAllSubmittedActionsToValidate,
} from '../../graphql/queries';
import ValidationNeededCard from './ValidationNeededCard';

const GroupValidateSearchBar = ({ user }) => {
  const [groupsOwnedByUser, setGroupsOwnedByUser] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [allActions, setAllActions] = useState();
  const [filteredActions, setFilteredActions] = useState();
  //for pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const rowsPerPage = 5;

  useEffect(() => {
    const getGroupsAndAllActions = async () => {
      const [groupRes, allActionRes] = await Promise.all([
        API.graphql({
          query: getAllGroupsUserOwns,
          variables: { user_id: user.user_id },
        }),
        API.graphql({
          query: getAllSubmittedActionsToValidate,
          variables: { user_id: user.user_id },
        }),
      ]);

      setGroupsOwnedByUser(groupRes.data.getAllGroupsUserOwns);
      setAllActions(allActionRes.data.getAllSubmittedActionsToValidate);
    };
    user && getGroupsAndAllActions();
  }, [user]);

  const getAllActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidate,
      variables: { user_id: user.user_id },
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
  //if there is no group selected, set page count to default length for all actions
  useEffect(() => {
    if (selectedGroup) {
      const filteredActionArray = allActions.filter((action) =>
        action.group_names.split(', ').includes(selectedGroup)
      );
      setFilteredActions(filteredActionArray);
      setPage(1);
    } else {
      const allActionsPageCount =
        allActions &&
        (allActions.length % 5 === 0
          ? Math.round(allActions.length / 5)
          : Math.floor(allActions.length / 5 + 1));

      setPageCount(allActionsPageCount);
      setPage(1);
    }
  }, [selectedGroup, allActions]);

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
      {!groupsOwnedByUser && <LinearProgress sx={{ mt: '3em' }} />}
      {groupsOwnedByUser && (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ mt: '3em' }}>
              Search for one of your groups to filter for group specific member
              actions
            </Typography>
          </Box>
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
        </>
      )}
      {error && (
        <Typography variant="subtitle2">
          Your search for "{input}" did not match any of your groups
        </Typography>
      )}{' '}
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
        {allActions && allActions.length === 0 && (
          <Typography
            variant="subtitle2"
            sx={{ textAlign: 'center', mt: '1em' }}
          >
            There are no actions in need of validation
          </Typography>
        )}
        <Stack spacing={2}>
          {/* if group has not been selected, display all actions */}
          {!selectedGroup &&
            allActions &&
            allActions.length > 0 &&
            allActions
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((action, index) => (
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
            filteredActions
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((action, index) => (
                <ValidationNeededCard
                  action={action}
                  key={index}
                  getAllActions={getAllActions}
                  groupsOwnedByUser={groupsOwnedByUser}
                />
              ))}
          {renderPagination()}
        </Stack>
      </Box>
    </>
  );
};

export default GroupValidateSearchBar;
