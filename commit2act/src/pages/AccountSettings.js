import React, { useEffect, useState } from 'react';
import SubmittedActionCard from '../components/SubmittedActionCard';
import {
  Box,
  Button,
  Stack,
  Typography,
  Grid,
  Avatar,
  Tab,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { API } from 'aws-amplify';
import {
  getAllSubmittedActionsForUser,
  getSingleUser,
} from '../graphql/queries';
import useMediaQuery from '@mui/material/useMediaQuery';
import EditAccountInfo from '../components/EditAccountInfo';

const AccountSettings = ({ databaseUser, setUser }) => {
  const [showMore, setShowMore] = useState({
    validated: false,
    unvalidated: false,
    failed: false,
  });
  const [validatedActions, setValidatedActions] = useState();
  const [unvalidatedActions, setUnvalidatedActions] = useState();
  const [failedActions, setFailedActions] = useState();
  const tabs = ['Validated', 'Awaiting Validation', 'Did Not Pass Validation'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [editUser, setEditUser] = useState(false);

  const scrollableTabs = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    if (databaseUser) {
      getUserActions(databaseUser.user_id);
    }
  }, [databaseUser]);

  const getCurrentDatabaseUser = async (id) => {
    const userRes = await API.graphql({
      query: getSingleUser,
      variables: { user_id: id },
    });
    setUser(userRes.data.getSingleUser);
  };

  const getUserActions = async (id) => {
    const actionRes = await API.graphql({
      query: getAllSubmittedActionsForUser,
      variables: { user_id: id },
    });
    const allActions = actionRes.data.getAllSubmittedActionsForUser;
    //filter for all validated actions
    const validated = allActions.filter((action) => action.is_validated);
    setValidatedActions(validated);
    //filter for all unvalidated actions
    const unvalidated = allActions.filter(
      (action) => !action.is_validated && !action.is_rejected
    );
    setUnvalidatedActions(unvalidated);
    //filter for all failed actions
    const failed = allActions.filter((action) => action.is_rejected);
    setFailedActions(failed);
  };

  const renderValidatedActionCards = () => {
    //return if validatedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(validatedActions) && validatedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.validated
              ? validatedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : validatedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            {validatedActions.length > 3 && (
              <Button
                sx={{ mt: '3em' }}
                variant="outlined"
                onClick={() =>
                  setShowMore((prev) => ({
                    ...prev,
                    validated: !showMore.validated,
                  }))
                }
              >
                View {showMore.validated ? 'Less' : 'More'}
              </Button>
            )}
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            There are no validated actions to show
          </Typography>
        </Box>
      );
    }
  };

  const renderUnvalidatedActionCards = () => {
    //return if unvalidatedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(unvalidatedActions) && unvalidatedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.unvalidated
              ? unvalidatedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : unvalidatedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            {unvalidatedActions.length > 3 && (
              <Button
                sx={{ mt: '3em' }}
                variant="outlined"
                onClick={() =>
                  setShowMore((prev) => ({
                    ...prev,
                    unvalidated: !showMore.unvalidated,
                  }))
                }
              >
                View {showMore.unvalidated ? 'Less' : 'More'}
              </Button>
            )}
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            There are no unvalidated actions to show
          </Typography>
        </Box>
      );
    }
  };

  const renderFailedActionCards = () => {
    //return if failedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(failedActions) && failedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '110vh',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.failed
              ? failedActions.map((action, index) => (
                  <SubmittedActionCard key={index} action={action} />
                ))
              : failedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard key={index} action={action} />
                  ))}
            {failedActions.length > 3 && (
              <Button
                sx={{ mt: '3em' }}
                variant="outlined"
                onClick={() =>
                  setShowMore((prev) => ({
                    ...prev,
                    failed: !showMore.failed,
                  }))
                }
              >
                View {showMore.failed ? 'Less' : 'More'}
              </Button>
            )}
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            There are no failed actions to show
          </Typography>
        </Box>
      );
    }
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      {databaseUser && (
        <>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{ mt: { xs: '1.5em', md: '0' }, mb: '1.5em' }}
            >
              My Account
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
                    src={databaseUser.avatar + '?' + new Date()}
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
                  outline: '2px solid #3F72AF',
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
                      Name:
                    </Typography>
                    {databaseUser.name}
                  </Typography>
                  <Typography variant="h7" component="div">
                    <Typography
                      variant="h3"
                      component="span"
                      sx={{ mr: '1em' }}
                    >
                      Email:
                    </Typography>
                    {databaseUser.email}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  sx={{ alignSelf: { md: 'flex-start' } }}
                  onClick={() => setEditUser(true)}
                >
                  Edit Info
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h2" sx={{ m: '3.5em 0 1.25em' }}>
              Logged Actions
            </Typography>
            <TabContext value={selectedTab}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  maxWidth: { xs: 320, sm: '100%' },
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="view user action tabs"
                  scrollButtons
                  allowScrollButtonsMobile
                  variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
                  centered={!scrollableTabs}
                >
                  <Tab label={tabs[0]} value={tabs[0]} />
                  <Tab label={tabs[1]} value={tabs[1]} />
                  <Tab label={tabs[2]} value={tabs[2]} />
                </TabList>
              </Box>
              <TabPanel value={tabs[0]}>
                {renderValidatedActionCards()}
              </TabPanel>
              <TabPanel value={tabs[1]}>
                {renderUnvalidatedActionCards()}
              </TabPanel>
              <TabPanel value={tabs[2]}>{renderFailedActionCards()}</TabPanel>
            </TabContext>
            <EditAccountInfo
              open={editUser}
              databaseUser={databaseUser}
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
