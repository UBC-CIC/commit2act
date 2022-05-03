import React from 'react';
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
import { Done, Clear, ErrorOutline } from '@mui/icons-material';

const ValidationNeededCard = ({ action }) => {
  return (
    <Card sx={{ display: 'flex' }}>
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
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {action.date_of_action.split('T')[0]} - {action.name_of_user}
            </Typography>
            <Typography variant="h2" sx={{ mt: { xs: '0.5em', md: '0' } }}>
              {action.action_name}
            </Typography>
            <Typography sx={{ my: 1.5 }}>
              {action.submitted_action_items}
            </Typography>
            <Typography variant="body1">
              CO2 Saved: {action.g_co2_saved} g
            </Typography>
            <Typography variant="body1">
              Total Points Earned: {action.points_earned}
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
            <Button startIcon={<Done />}>Accept</Button>
            <Button startIcon={<Clear />}>Reject</Button>
          </Stack>
        </CardActions>
      </Box>
    </Card>
  );
};

export default ValidationNeededCard;
