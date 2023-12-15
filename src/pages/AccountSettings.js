import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Avatar } from '@mui/material';
import { API } from 'aws-amplify';
import { getSingleUser } from '../graphql/queries';
import EditAccountInfo from '../components/accountSettings/EditAccountInfo';
import useTranslation from '../components/customHooks/translations';
import UserActions from '../components/UserActions';
import { useUserInfoContext } from '../hooks/use-user-info-context';

const AccountSettings = () => {
  const { user, setUser } = useUserInfoContext();
  const [editUser, setEditUser] = useState(false);
  const translation = useTranslation();

  const getCurrentDatabaseUser = async (id) => {
    const userRes = await API.graphql({
      query: getSingleUser,
      variables: { user_id: id },
    });
    setUser(userRes.data.getSingleUser);
  };

  return (
    <>
      {user && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{ mt: { xs: '1.5em', md: '0' }, mb: '1.5em' }}
            >
              {translation.myAccount}
            </Typography>
            <Grid
              container
              sx={{
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
              }}
            >
              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={user.avatar + '?' + new Date()}
                    sx={{
                      width: 120,
                      height: 120,
                    }}
                  ></Avatar>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={9}
                sx={{
                  width: '100%',
                  borderRadius: '5px',
                  padding: '1.5em',
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'space-between' },
                  flexFlow: { xs: 'none', md: 'row wrap' },
                  flexDirection: { xs: 'column' },
                  alignItems: { xs: 'center', md: 'flex-start' },
                  overflow: 'auto',
                  mt: { xs: '1em', md: '0em' },
                }}
              >
                <Box>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      {translation.nameC}
                    </Typography>
                    {user.name}
                  </Typography>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      {translation.emailC}
                    </Typography>
                    {user.email}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  sx={{ alignSelf: { md: 'flex-start' } }}
                  onClick={() => setEditUser(true)}
                >
                  {translation.editInfo}
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h2" sx={{ mt: '1em', mb: '0.5em' }}>
              {translation.myActions}
            </Typography>
            <UserActions databaseUser={user} />
            <EditAccountInfo
              open={editUser}
              databaseUser={user}
              setEditUser={setEditUser}
              editUser={editUser}
              getCurrentDatabaseUser={getCurrentDatabaseUser}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default AccountSettings;
