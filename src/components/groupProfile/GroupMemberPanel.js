import React, { useState } from 'react';
import { Grid, Avatar, Tooltip, IconButton, Paper, Badge } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import GroupMemberPanelDialog from './GroupMemberPanelDialog';

const GroupMemberPanel = ({
  groupMembers,
  setGroupMembers,
  groupOwners,
  groupInfo,
  currentUserOwner,
  cognitoUser,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState();

  const handleOpen = (member) => {
    setOpenDialog(true);
    setSelectedMember(member);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      {groupMembers && (
        <Paper
          component={Grid}
          item
          container
          columnSpacing={{ xs: 0, md: 1 }}
          sx={{
            width: '100%',
            backgroundColor: '#DBE2EF',
            height: '50vh',
            borderRadius: '8px',
            padding: '1.5em',
            mt: '2em',
            alignItems: 'center',
            flexWrap: 'wrap',
            overflow: 'auto',
          }}
        >
          {groupMembers.map((member, index) => (
            <Grid
              container
              item
              xs={6}
              sm={4}
              md={2}
              sx={{ justifyContent: 'center' }}
              key={index}
            >
              <Tooltip title={member.name}>
                <IconButton
                  aria-label="user avatar"
                  disableRipple={true}
                  onClick={() => handleOpen(member)}
                  sx={{ mb: { xs: '1.5em' } }}
                >
                  <Badge
                    overlap="rectangular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <StarIcon
                        sx={{ color: '#d4b24c' }}
                        stroke="white"
                        strokeWidth={1}
                      />
                    }
                    invisible={member.user_role === 'member'}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: {
                          xs: 100,
                        },
                        height: {
                          xs: 100,
                        },
                        ':hover': { cursor: 'pointer' },
                      }}
                      src={member.avatar ? member.avatar : null}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                  </Badge>
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
          {openDialog && (
            <GroupMemberPanelDialog
              openDialog={openDialog}
              handleClose={handleClose}
              selectedMember={selectedMember}
              groupInfo={groupInfo}
              groupMembers={groupMembers}
              groupOwners={groupOwners}
              setGroupMembers={setGroupMembers}
              currentUserOwner={currentUserOwner}
              cognitoUser={cognitoUser}
            />
          )}
        </Paper>
      )}
    </>
  );
};

export default GroupMemberPanel;
