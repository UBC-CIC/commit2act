import React, { useState } from 'react';
import { Grid, Avatar, Tooltip, IconButton, Paper, Badge, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import GroupMemberPanelDialog from './GroupMemberPanelDialog';
import useTranslation from '../customHooks/translations';

const GroupMemberPanel = ({
  groupMembers,
  setGroupMembers,
  groupOwners,
  groupInfo,
  currentUserOwner,
  cognitoUser,
}) => {
  const translation = useTranslation();
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
          {groupMembers.map((member) => {
            const { avatar, user_role, user_id, name } = member;
            const userIsOwner = user_role === 'owner';
            return (
              <Tooltip
                title={`${name}${
                  userIsOwner ? translation.userNoteGroupOwner : ''
                }`}
                key={user_id}
              >
              <IconButton
                  disableRipple
                onClick={() => handleOpen(member)}
                sx={{ display: 'block', mb: { xs: '0.25em' } }}
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
                    invisible={!userIsOwner}
                >
                  <Avatar
                    variant="rounded"
                    aria-hidden="true"
                    sx={{
                      background: '#5bc1ab',
                      borderRadius: '99em',
                      boxShadow: '8px 8px 16px rgb(0 0 0 / 43%)',
                      border: '1px solid #000000',
                        cursor: 'pointer',
                      width: {
                        xs: 120,
                      },
                      height: {
                        xs: 120,
                      },
                    }}
                      src={avatar ? avatar : null}
                      alt=""
                  >
                      {name.charAt(0)}
                  </Avatar>
                </Badge>
                  <Box
                    sx={{
                  color: '#000',
                  fontSize: '0.75rem',
                  maxWidth: '80%',
                  paddingTop: '10px',
                  margin: '0 auto'
                }}
                  >
                    {name}
                </Box>
              </IconButton>
            </Tooltip>
            );
          })}
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
