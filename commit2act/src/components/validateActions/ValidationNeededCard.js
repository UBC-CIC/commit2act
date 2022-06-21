import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { Done, Clear } from '@mui/icons-material';
import {
  approveSubmittedAction,
  rejectSubmittedAction,
} from '../../graphql/mutations';
import { API } from 'aws-amplify';

const ValidationNeededCard = ({ action, getAllActions, groupsOwnedByUser }) => {
  const [displayedGroups, setDisplayedGroups] = useState();

  const approveAction = async () => {
    await API.graphql({
      query: approveSubmittedAction,
      variables: { sa_id: action.sa_id },
    });
    getAllActions();
  };

  const rejectAction = async () => {
    await API.graphql({
      query: rejectSubmittedAction,
      variables: { sa_id: action.sa_id },
    });

    getAllActions();
  };

  //filter submitted action's group names to only show the groups that match groupsOwnedByUser
  useEffect(() => {
    const submittedGroupNames = action.group_names.split(', ');
    const usersGroupNames = groupsOwnedByUser.map((group) => group.group_name);
    const filteredGroups = submittedGroupNames.filter((name) =>
      usersGroupNames.includes(name)
    );
    const filteredGroupString = filteredGroups.join(', ');
    setDisplayedGroups(filteredGroupString);
  }, [action.group_names, groupsOwnedByUser]);

  return (
    <Card sx={{ display: 'flex', overflow: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          alignItems: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            alignItems: { xs: 'center', sm: 'stretch' },
          }}
        >
          {action.submitted_image && (
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={action.submitted_image}
              alt="user submitted image"
            />
          )}
          <CardContent
            sx={{
              ml: { xs: '0em', sm: '1.5em' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: '1.5em' }}>
              {action.date_of_action.split('T')[0]} - {action.name_of_user}
            </Typography>
            <Typography variant="h2" sx={{ mt: { xs: '0.5em', sm: '0' } }}>
              {action.action_name}
            </Typography>
            <Typography sx={{ my: 1.5, color: '#7e7e7e' }}>
              {action.submitted_action_items}
            </Typography>
            <Typography variant="body1">
              CO2 Saved: {action.g_co2_saved} g
            </Typography>
            <Typography variant="body1">
              Total Points Earned: {action.points_earned}
            </Typography>
            {displayedGroups && (
              <Typography variant="body1">
                Submitted in: {displayedGroups}
              </Typography>
            )}
          </CardContent>
        </Box>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            alignSelf: 'center',
            mb: { xs: '1em', sm: '0em' },
            mr: { xs: '0em', sm: '3em' },
          }}
        >
          <Stack spacing={2} direction={{ xs: 'row', sm: 'column' }}>
            <Button startIcon={<Done />} onClick={approveAction}>
              Accept
            </Button>
            <Button startIcon={<Clear />} onClick={rejectAction}>
              Reject
            </Button>
          </Stack>
        </CardActions>
      </Box>
    </Card>
  );
};

export default ValidationNeededCard;
