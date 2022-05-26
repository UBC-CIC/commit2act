import React, { useEffect, useState } from 'react';
import { Box, Button, LinearProgress, Stack } from '@mui/material';
import { API } from 'aws-amplify';
import { getAllValidatedSubmittedActionsInGroup } from '../../graphql/queries';
import SubmittedActionCard from '../SubmittedActionCard';

const MemberActionsPanel = ({ groupInfo }) => {
  const [actions, setActions] = useState();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const getActions = async () => {
      const res = await API.graphql({
        query: getAllValidatedSubmittedActionsInGroup,
        variables: { group_id: groupInfo.group_id },
      });
      setActions(res.data.getAllValidatedSubmittedActionsInGroup);
    };
    getActions();
  }, [groupInfo.group_id]);

  const renderActionCards = () => {
    if (actions) {
      return showMore
        ? actions.map((action, index) => (
            <SubmittedActionCard key={index} action={action} />
          ))
        : actions
            .slice(0, 3)
            .map((action, index) => (
              <SubmittedActionCard key={index} action={action} />
            ));
    } else {
      return <LinearProgress />;
    }
  };

  return (
    <Box sx={{ overflow: 'auto', padding: '0.25em', mt: '1.5em' }}>
      <Stack spacing={2}>
        {renderActionCards()}
        <Button
          sx={{ mt: '3em' }}
          variant="outlined"
          onClick={() => setShowMore(!showMore)}
        >
          View {showMore ? 'Less' : 'More'}
        </Button>
      </Stack>
    </Box>
  );
};

export default MemberActionsPanel;
