import React, { useEffect, useState } from 'react';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import { API } from 'aws-amplify';
import { getAllValidatedSubmittedActionsInGroup } from '../../graphql/queries';
import SubmittedActionCard from '../SubmittedActionCard';

import useTranslation from '../customHooks/translations';

const MemberActionsPanel = ({ groupInfo, cognitoUser }) => {
  const translation = useTranslation();
  const [actions, setActions] = useState();
  const [showMore, setShowMore] = useState(false);

  const getActions = async () => {
    const res = await API.graphql({
      query: getAllValidatedSubmittedActionsInGroup,
      variables: { group_id: groupInfo.group_id },
    });
    setActions(res.data.getAllValidatedSubmittedActionsInGroup);
  };

  useEffect(() => {
    getActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderActionCards = () => {
    if (actions) {
      return showMore
        ? actions.map((action, index) => (
            <SubmittedActionCard
              key={index}
              action={action}
              showUnapproveButton={
                cognitoUser.attributes['custom:type'] === 'Admin'
              }
              getActions={getActions}
            />
          ))
        : actions
            .slice(0, 3)
            .map((action, index) => (
              <SubmittedActionCard
                key={index}
                action={action}
                showUnapproveButton={
                  cognitoUser.attributes['custom:type'] === 'Admin'
                }
                getActions={getActions}
              />
            ));
    }
  };

  return (
    <Box sx={{ overflow: 'auto', padding: '0.25em', mt: '1.5em' }}>
      <Stack spacing={2}>
        {renderActionCards()}
        {!actions ? (
          <LinearProgress />
        ) : actions && actions.length > 0 ? (
          <Button
            sx={{ mt: '3em' }}
            variant="outlined"
            onClick={() => setShowMore(!showMore)}
          >
            {translation.view} {showMore ? translation.less : translation.more}
          </Button>
        ) : (
          <Typography variant="subtitle2">
            {translation.noActions}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default MemberActionsPanel;
