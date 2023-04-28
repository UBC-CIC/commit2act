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
import { getAllActions, getAllGroupsUserOwns } from '../../graphql/queries';
import ValidationNeededCard from './ValidationNeededCard';

import useTranslation from '../customHooks/translations';

const ActionNameSearchBar = ({
  user,
  getAllActionsToValidate,
  allActionsToValidate,
}) => {
  const [allActionTypes, setAllActionTypes] = useState();
  const [groupsOwnedByUser, setGroupsOwnedByUser] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [selectedActionName, setSelectedActionName] = useState('');
  const [filteredActions, setFilteredActions] = useState();
  //for pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const rowsPerPage = 5;

  const translation = useTranslation();

  useEffect(() => {
    const getActionNamesAndAllActions = async () => {
      const [groupRes, allActionTypeRes] = await Promise.all([
        API.graphql({
          query: getAllGroupsUserOwns,
          variables: { user_id: user.user_id },
        }),
        API.graphql({
          query: getAllActions,
        }),
      ]);

      setGroupsOwnedByUser(groupRes.data.getAllGroupsUserOwns);
      setAllActionTypes(allActionTypeRes.data.getAllActions);
    };
    user && getActionNamesAndAllActions();
  }, [user]);

  const checkGroup = () => {
    if (!allActionTypes.some((action) => action.action_name === input)) {
      setError(true);
    }
  };

  const handleInputChange = (value) => {
    if (
      value === '' ||
      allActionTypes.some((action) => action.action_name === value)
    ) {
      setError(false);
    }
    setInput(value);
  };

  //every time an action type is selected, get all the actions in need of validation from users in that group only
  //if there is no action type selected, set page count to default length for all actions
  useEffect(() => {
    if (selectedActionName) {
      const filteredActionArray = allActionsToValidate.filter(
        (action) => action.action_name === selectedActionName
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
  }, [selectedActionName, allActionsToValidate]);

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
      {!allActionTypes && <LinearProgress sx={{ mt: '3em' }} />}
      {allActionTypes && (
        <>
          <Autocomplete
            freeSolo
            options={allActionTypes.map((action) => action.action_name)}
            value={selectedActionName}
            onChange={(e, newValue) => {
              setSelectedActionName(newValue);
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
          {translation.formatString(translation.actionNameSearchEmptySearch, input)}
        </Typography>
      )}
      <Box sx={{ mt: '1.5em' }}>
        {!error && allActionTypes && allActionTypes.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography component="div" variant="subtitle2">
              {translation.actionNameSearchNoActions}
            </Typography>
          </Box>
        ) : (
          allActionTypes && (
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
                {!selectedActionName ? translation.actionNameSearchAllFilter : selectedActionName}
              </Typography>
            </Typography>
          )
        )}
        {((allActionsToValidate && allActionsToValidate.length === 0) ||
          (filteredActions && filteredActions.length === 0)) && (
          <Typography
            variant="subtitle2"
            sx={{ textAlign: 'center', mt: '1em' }}
          >
            {translation.validateActionsNoActions}
          </Typography>
        )}
        <Stack spacing={2}>
          {/* if an action name has not been selected, display all actions */}
          {!selectedActionName &&
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
          {/* if an action name has been selected, display only actions with that name */}
          {selectedActionName &&
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

export default ActionNameSearchBar;
