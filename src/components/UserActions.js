import React, { useEffect, useMemo, useState } from 'react';
import SubmittedActionCard from '../components/SubmittedActionCard';
import {
  Box,
  Button,
  Stack,
  Typography,
  Tab,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { API } from 'aws-amplify';
import {
  getAllSubmittedActionsForUser,
  getSingleUser,
} from '../graphql/queries';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useTranslation from './customHooks/translations';
import { useLanguageContext } from "./contexts/LanguageContext";

const UserActions = ({ databaseUser, setUser, userType }) => {
  const [showMore, setShowMore] = useState({
    validated: false,
    unvalidated: false,
    failed: false,
  });
  const [validatedActions, setValidatedActions] = useState();
  const [unvalidatedActions, setUnvalidatedActions] = useState();
  const [failedActions, setFailedActions] = useState();
  const translation = useTranslation();
  const tabs = useMemo(() => [
    translation.validated,
    translation.awaitingValidation,
    translation.notPassValidation,
  ], [translation.awaitingValidation, translation.notPassValidation, translation.validated]);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { language } = useLanguageContext();

  useEffect(() => {
    if (databaseUser) {
      getUserActions(databaseUser.user_id);
    }

    setSelectedTab(tabs[0]);
  }, [databaseUser, tabs, language]);

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

  const updateValidatedActions = async () => {
    const actionRes = await API.graphql({
      query: getAllSubmittedActionsForUser,
      variables: { user_id: databaseUser.user_id },
    });
    const allActions = actionRes.data.getAllSubmittedActionsForUser;
    //filter for all validated actions
    const validated = allActions.filter((action) => action.is_validated);
    setValidatedActions(validated);
  };

  const renderValidatedActionCards = () => {
    //return if validatedActions is not null or undefined and contains at least 1 item
    if (Array.isArray(validatedActions) && validatedActions.length !== 0) {
      return (
        <Box
          sx={{
            height: '100%',
            overflow: 'auto',
            padding: '0.25em',
          }}
        >
          <Stack spacing={2}>
            {showMore.validated
              ? validatedActions.map((action, index) => (
                  <SubmittedActionCard
                    key={index}
                    action={action}
                    showUnapproveButton={userType === 'Admin'}
                    getActions={updateValidatedActions}
                  />
                ))
              : validatedActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <SubmittedActionCard
                      key={index}
                      action={action}
                      showUnapproveButton={userType === 'Admin'}
                      getActions={updateValidatedActions}
                    />
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
            {translation.noValidatedActions}
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
            height: '100%',
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
                {translation.view} {showMore.unvalidated ? translation.less : translation.more}
              </Button>
            )}
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            {translation.noUnvalidatedActions}
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
                {translation.view} {showMore.failed ? translation.less : translation.more}
              </Button>
            )}
          </Stack>
        </Box>
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">
            {translation.noFailedActions}
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
        <>
          <Box sx={{ textAlign: { xs: 'center'} }}>
            <TabContext value={tabs.indexOf(selectedTab) !== -1 ? selectedTab : tabs[0]}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderTop: 1,
                  borderColor: 'divider',
                  maxWidth: { sm: '100%' },
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="view user action tabs"
                  variant='fullWidth'
                  orientation={mobileView ? 'vertical' : 'horizontal'}
                >
                  <Tab label={tabs[0]} value={tabs[0]} />
                  <Tab label={tabs[1]} value={tabs[1]} />
                  <Tab label={tabs[2]} value={tabs[2]} />
                </TabList>
              </Box>
              <TabPanel
                value={tabs[0]}
                sx={{
                  height:{xs: '500px', md: 'auto'},
                }}
              >
                {renderValidatedActionCards()}
              </TabPanel>
              <TabPanel
                value={tabs[1]}
                sx={{
                  height:{xs: '500px', md: 'auto'},
                }}
              >
                {renderUnvalidatedActionCards()}
              </TabPanel>
              <TabPanel
                value={tabs[2]}
                sx={{
                  height:{xs: '500px', md: 'auto'},
                }}
              >
                {renderFailedActionCards()}</TabPanel>
            </TabContext>
          </Box>
        </>
    </>
  );
};

export default UserActions;
