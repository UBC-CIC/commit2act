import React, { useState } from 'react';
import {
  Typography,
  Tooltip,
  Box,
  Grid,
  Button,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GroupInfoPanel = ({ groupOwners, groupInfo }) => {
  const [organizerDialogOpen, setOrganizerDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOrganizerDialogOpen(false);
  };

  return (
    <>
      <Grid
        container
        sx={{
          overflow: 'auto',
          padding: '0.25em',
        }}
        columnSpacing={12}
        rowSpacing={4}
      >
        <Grid item xs={12} sm={7}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            About
          </Typography>
          <Typography component="div" variant="subtitle2">
            {groupInfo.group_description
              ? groupInfo.group_description
              : 'This group currently does not have a description.'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            Group Organizers
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: 'center', lg: 'flex-start' }}
          >
            <AvatarGroup
              max={4}
              onClick={() => setOrganizerDialogOpen(true)}
              sx={{ ':hover': { cursor: 'pointer', opacity: '0.8' } }}
            >
              {groupOwners &&
                groupOwners.map((owner, index) => (
                  <Tooltip title={owner.name} key={index}>
                    <Avatar
                      alt={owner.name}
                      src={owner.avatar ? owner.avatar : null}
                      sx={{ width: 60, height: 60 }}
                    >
                      {owner.name.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
            </AvatarGroup>
          </Box>
        </Grid>
      </Grid>
      {groupOwners && (
        <Dialog open={organizerDialogOpen}>
          <DialogTitle>Group Organizers</DialogTitle>
          <List sx={{ pt: 0 }}>
            {groupOwners.map((groupOwner, index) => (
              <ListItem
                button
                onClick={() => {
                  navigate(`/user-profile/${groupOwner.user_id}`);
                  handleClose();
                }}
                key={index}
              >
                <ListItemAvatar>
                  <Avatar src={groupOwner.avatar}>
                    {groupOwner.name.charAt[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={groupOwner.name} />
              </ListItem>
            ))}
          </List>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default GroupInfoPanel;
