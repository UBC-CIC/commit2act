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
} from '../graphql/mutations';
import { API } from 'aws-amplify';

const ValidationNeededCard = ({ action, getAllActions, groupsOwnedByUser }) => {
  console.log(action);
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

  //filter group names from each action to show the groups that match groupsOwnedByUsers

  return (
    <Card sx={{ display: 'flex', overflow: 'scroll' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            alignItems: { xs: 'center', md: 'stretch' },
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
              ml: { xs: '0em', md: '1.5em' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: '1.5em' }}>
              {action.date_of_action.split('T')[0]} - {action.name_of_user}
            </Typography>
            <Typography variant="h2" sx={{ mt: { xs: '0.5em', md: '0' } }}>
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
            <Typography variant="body1">
              Submitted in: {action.group_names}{' '}
            </Typography>
          </CardContent>
        </Box>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            alignSelf: 'center',
            mb: { xs: '1em', md: '0em' },
            mr: { xs: '0em', md: '3em' },
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
