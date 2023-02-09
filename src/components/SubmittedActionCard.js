import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { rejectSubmittedAction } from '../graphql/mutations';
import { API } from 'aws-amplify';

const SubmittedActionCard = ({ action, showUnapproveButton, getActions }) => {
  const {
    action_name,
    date_of_action,
    g_co2_saved,
    is_rejected,
    points_earned,
    submitted_action_items,
    submitted_image,
    time_submitted,
    name_of_user,
  } = action;

  const rejectAction = async () => {
    await API.graphql({
      query: rejectSubmittedAction,
      variables: { sa_id: action.sa_id },
    });

    getActions();
  };

  return (
    <Card sx={{ display: 'flex', overflow: 'auto' }}>
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
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            alignItems: { xs: 'center', sm: 'stretch' },
          }}
        >
          {submitted_image && (
            <CardMedia
              component="img"
              sx={{
                width: 150,
                filter: is_rejected && 'grayscale(100%)',
              }}
              image={submitted_image}
              alt={`A submitted ${action_name} action image submitted at ${time_submitted}`}
            />
          )}
          <CardContent sx={{ ml: { xs: '0em', md: '2em' } }}>
            <Typography variant="subtitle2" sx={{ mb: '1.5em' }}>
              {date_of_action.split('T')[0]}{' '}
              {name_of_user ? `- ${name_of_user}` : ''}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: { xs: '0.5em', md: '0', color: is_rejected && '#303030' },
              }}
            >
              {action_name}
            </Typography>
            <Typography sx={{ my: 1.5, color: '#7e7e7e' }}>
              {submitted_action_items}
            </Typography>
            <Typography variant="body1">CO2 Saved: {g_co2_saved} g</Typography>
            <Typography variant="body1">
              Total Points Earned: {points_earned}
            </Typography>
          </CardContent>
        </Box>
        {showUnapproveButton && (
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              alignSelf: 'center',
              mb: { xs: '1em', sm: '0em' },
              mr: { xs: '0em', sm: '3em' },
            }}
          >
            <Button variant="outlined" startIcon={<Clear />} color={'error'} onClick={rejectAction}>
              Unapprove
            </Button>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default SubmittedActionCard;
