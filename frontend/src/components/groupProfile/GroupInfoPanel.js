import React, { useState } from 'react';
import {
  Typography,
  Tooltip,
  Box,
  Grid,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const GroupInfoPanel = ({ groupOwners, groupInfo }) => {
  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setOwnerDialogOpen(false);
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
        <Grid
          item
          xs={12}
          sm={7}
          sx={{ wordWrap: 'break-word', whiteSpace: 'pre-line' }}
        >
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            About
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: 'center', lg: 'flex-start' }}
            sx={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}
          >
            <Typography component="div" variant="subtitle2">
              {groupInfo.group_description
                ? groupInfo.group_description
                : 'This group currently does not have a description.'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography component="div" variant="h2" sx={{ mb: '1em' }}>
            Group Owners
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={{ xs: 'center', lg: 'flex-start' }}
          >
            <AvatarGroup
              max={4}
              onClick={() => setOwnerDialogOpen(true)}
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
        <Dialog
          open={ownerDialogOpen}
          PaperProps={{
            sx: {
              p: '1em',
              textAlign: 'center',
              minWidth: '30%',
            },
          }}
        >
          <IconButton sx={{ alignSelf: 'flex-end' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <DialogTitle>Group Owners</DialogTitle>
          <DialogContent>
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
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default GroupInfoPanel;
