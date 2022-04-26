import React, { useState } from 'react';
import { Grid, Avatar, Tooltip, IconButton } from '@mui/material';
import GroupMemberPanelDialog from './GroupMemberPanelDialog';

const GroupMemberPanel = ({
  groupMembers,
  setGroupMembers,
  groupInfo,
  currentUserOwner,
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
        <Grid
          item
          container
          columnSpacing={{ xs: 0, md: 1 }}
          sx={{
            width: '100%',
            height: '50vh',
            backgroundColor: '#DBE2EF',
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
                      mb: { xs: '1.5em' },
                      ':hover': { cursor: 'pointer' },
                    }}
                    src={member.avatar ? member.avatar : null}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
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
              setGroupMembers={setGroupMembers}
              currentUserOwner={currentUserOwner}
            />
          )}
        </Grid>
      )}
    </>
  );
};

export default GroupMemberPanel;
