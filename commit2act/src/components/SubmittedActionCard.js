import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

const SubmittedActionCard = ({ action }) => {
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
        {action.submitted_image && (
          <CardMedia
            component="img"
            sx={{ width: 150, height: '100%' }}
            image={action.submitted_image}
            alt="user submitted image"
          />
        )}
        <CardContent sx={{ ml: { xs: '0em', md: '2em' } }}>
          <Typography variant="subtitle2">
            {action.date_of_action.split('T')[0]}
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
        </CardContent>
      </Box>
    </Card>
  );
};

export default SubmittedActionCard;
