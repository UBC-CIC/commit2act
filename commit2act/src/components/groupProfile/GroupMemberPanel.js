import React, { useState } from 'react';
import { Grid, Avatar, Tooltip, IconButton } from '@mui/material';
import GroupMemberPanelDialog from './GroupMemberPanelDialog';

// const GroupMemberPanel = ({ groupMembers, groupInfo, }) => {
//   const dialogDisplayInitial = {
//     promoteUserSuccess: false,
//     demoteOwnerSuccess: false,
//     removeUserSuccess: false,
//   };
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedMember, setSelectedMember] = useState();
//   const [dialogDisplay, setDialogDisplay] = useState(dialogDisplayInitial);
//   const [changed, setChanged] = useState(false);

//   const handleOpen = (member) => {
//     setOpenDialog(true);
//     setSelectedMember(member);
//   };

//   const handleClose = () => {
//     setOpenDialog(false);
//     // setDialogDisplay(dialogDisplayInitial);
//     // // window.location.reload();
//     // setChanged(!setChanged);
//   };

//   const promoteUser = async () => {
//     try {
//       await API.graphql({
//         query: promoteGroupMember,
//         variables: {
//           group_id: groupInfo.group_id,
//           user_id: selectedMember.user_id,
//         },
//       });
//       setDialogDisplay({ ...dialogDisplay, promoteUserSuccess: true });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const demoteOwner = async () => {
//     try {
//       await API.graphql({
//         query: demoteGroupOwner,
//         variables: {
//           group_id: groupInfo.group_id,
//           user_id: selectedMember.user_id,
//         },
//       });
//       setDialogDisplay({ ...dialogDisplay, demoteOwnerSuccess: true });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     console.log(groupMembers);
//   }, [groupMembers]);

//   return (
//     <>
//       {groupMembers && (
//         <Grid
//           item
//           container
//           columnSpacing={{ xs: 0, md: 1 }}
//           sx={{
//             width: '100%',
//             height: '50vh',
//             backgroundColor: '#DBE2EF',
//             borderRadius: '8px',
//             padding: '1.5em',
//             mt: '2em',
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             overflow: 'auto',
//           }}
//         >
//           {groupMembers.map((member, index) => (
//             <Grid
//               container
//               item
//               xs={6}
//               sm={4}
//               md={2}
//               sx={{ justifyContent: 'center' }}
//               key={index}
//             >
//               <Tooltip title={member.name}>
//                 <IconButton
//                   aria-label="user avatar"
//                   disableRipple={true}
//                   onClick={() => handleOpen(member)}
//                 >
//                   <Avatar
//                     variant="rounded"
//                     sx={{
//                       width: {
//                         xs: 100,
//                       },
//                       height: {
//                         xs: 100,
//                       },
//                       mb: { xs: '1.5em' },
//                       ':hover': { cursor: 'pointer' },
//                     }}
//                     src={member.avatar ? member.avatar : null}
//                   >
//                     {member.name.charAt(0)}
//                   </Avatar>
//                 </IconButton>
//               </Tooltip>
//             </Grid>
//           ))}
//           {openDialog && (
//             <Dialog
//               aria-labelledby="already-member-dialog"
//               PaperProps={{ sx: { p: '1em' } }}
//               open={openDialog}
//               onClose={handleClose}
//             >
//               {/* if there are no success messages to show, display the initial dialog menu */}
//               {Object.values(dialogDisplay).every(
//                 (value) => value === false
//               ) && (
//                 <>
//                   <DialogTitle>{selectedMember.name}</DialogTitle>
//                   <DialogContent>
//                     Role: {selectedMember.user_role}
//                   </DialogContent>
//                   <List sx={{ pt: 0 }}>
//                     <ListItem autoFocus button>
//                       <ListItemIcon>
//                         <AccountCircle />
//                       </ListItemIcon>
//                       <ListItemText>View User Profile</ListItemText>
//                     </ListItem>
//                     {selectedMember.user_role === 'member' ? (
//                       <ListItem autoFocus button onClick={promoteUser}>
//                         <ListItemIcon>
//                           <PersonAddAlt1 />
//                         </ListItemIcon>
//                         <ListItemText>
//                           Promote User to Group Organizer
//                         </ListItemText>
//                       </ListItem>
//                     ) : (
//                       <ListItem autoFocus button onClick={demoteOwner}>
//                         <ListItemIcon>
//                           <PersonRemove />
//                         </ListItemIcon>
//                         <ListItemText>Demote User to Group Member</ListItemText>
//                       </ListItem>
//                     )}

//                     <ListItem autoFocus button>
//                       <ListItemIcon>
//                         <GroupRemove />
//                       </ListItemIcon>
//                       <ListItemText>Remove User From Group</ListItemText>
//                     </ListItem>
//                   </List>
//                   <DialogActions>
//                     <Button onClick={handleClose}>Cancel</Button>
//                   </DialogActions>
//                 </>
//               )}
//               {dialogDisplay.promoteUserSuccess && (
//                 <>
//                   <DialogTitle> Success!</DialogTitle>{' '}
//                   <DialogContent>
//                     {selectedMember.name} is now a group owner
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={handleClose}>Close</Button>
//                   </DialogActions>
//                 </>
//               )}
//               {dialogDisplay.demoteOwnerSuccess && (
//                 <>
//                   <DialogTitle> Success!</DialogTitle>{' '}
//                   <DialogContent>
//                     {selectedMember.name} is now a group member
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={handleClose}>Close</Button>
//                   </DialogActions>
//                 </>
//               )}
//               {dialogDisplay.removeUserSuccess && (
//                 <>
//                   <DialogTitle> Success!</DialogTitle>{' '}
//                   <DialogContent>
//                     {selectedMember.name} has been removed from the group
//                   </DialogContent>
//                   <DialogActions>
//                     <Button onClick={handleClose}>
//                       Redirect to Group Profile Page
//                     </Button>
//                   </DialogActions>
//                 </>
//               )}
//             </Dialog>
//           )}
//         </Grid>
//       )}
//     </>
//   );
// };

// export default GroupMemberPanel;

const GroupMemberPanel = ({ groupMembers, setGroupMembers, groupInfo }) => {
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
            />
          )}
        </Grid>
      )}
    </>
  );
};

export default GroupMemberPanel;
