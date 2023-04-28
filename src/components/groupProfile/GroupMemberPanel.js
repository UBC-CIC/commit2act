import React, { useState } from 'react';
import { Grid, Avatar, Tooltip, IconButton, Paper, Badge, Box } from '@mui/material';
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
            minHeight: '50vh',
            borderRadius: '8px',
            padding: '1.5em',
            mt: '2em',
            alignItems: 'center',
            flexWrap: 'wrap'
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
                  sx={{ mb: { xs: '0.25em' } }}
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
                      aria-hidden="true"
                      sx={{
                        background: '#5bc1ab',
                        // padding: '20px',
                        borderRadius: '99em',
                        boxShadow: '8px 8px 16px rgb(0 0 0 / 43%)',
                        border: '1px solid #000000',
                        width: {
                          xs: 120,
                        },
                        height: {
                          xs: 120,
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
              <Box component="span" sx={{
                      color: '#000',
                      fontSize: '0.75rem',
                      padding: '1em',
                    }}
                      >
                      {member.name}
                    </Box>
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
