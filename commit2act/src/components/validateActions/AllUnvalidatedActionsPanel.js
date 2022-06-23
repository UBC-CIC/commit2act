import React, { useState, useEffect } from 'react';
import { Typography, Stack, Pagination, LinearProgress } from '@mui/material';
import { API } from 'aws-amplify';
import { getAllSubmittedActionsToValidateForAdmin } from '../../graphql/queries';
import ValidationNeededCard from './ValidationNeededCard';

const AllUnvalidatedActionsPanel = () => {
  const [allActions, setAllActions] = useState();
  //for pagination
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const rowsPerPage = 5;

  const getAllActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidateForAdmin,
    });
    setAllActions(res.data.getAllSubmittedActionsToValidateForAdmin);
  };

  useEffect(() => {
    getAllActions();
  }, []);

  useEffect(() => {
    const count =
      allActions &&
      (allActions.length % 5 === 0
        ? Math.round(allActions.length / 5)
        : Math.floor(allActions.length / 5 + 1));

    setPageCount(count);
  }, [allActions]);

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
      {!allActions && <LinearProgress sx={{ mt: '3em' }} />}
      <Stack spacing={2} sx={{ mt: '2em' }}>
        {allActions &&
          (allActions.length > 0 ? (
            allActions
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((action, index) => (
                <ValidationNeededCard
                  action={action}
                  key={index}
                  getAllActions={getAllActions}
                />
              ))
          ) : (
            <Typography
              variant="subtitle2"
              sx={{ textAlign: 'center', mt: '1em' }}
            >
              There are no actions in need of validation
            </Typography>
          ))}
        {renderPagination()}
      </Stack>
    </>
  );
};

export default AllUnvalidatedActionsPanel;
