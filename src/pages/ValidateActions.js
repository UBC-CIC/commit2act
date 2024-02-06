import React, { useEffect, useState } from 'react';
import { Box, Typography, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useMediaQuery from '@mui/material/useMediaQuery';
import UsersWithoutGroupPanel from '../components/validateActions/UsersWithoutGroupPanel';
import AllUnvalidatedActionsPanel from '../components/validateActions/AllUnvalidatedActionsPanel';
import MyGroupsPanel from '../components/validateActions/MyGroupsPanel';
import { useLanguageContext } from '../components/contexts/LanguageContext';
import useTranslation from '../components/customHooks/translations';
import { useUserInfoContext } from '../hooks/use-user-info-context';

export const actionsTabKeys = [
  'myGroups',
  'validateActionsUsersWithoutGroupsTab',
  'validateActionsAllUnvalidatedActionsTab',
];

const ValidateActions = () => {
  const { user, userType } = useUserInfoContext();
  const translation = useTranslation();
  const [selectedTab, setSelectedTab] = useState(actionsTabKeys[0]);
  const scrollableTabs = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { language } = useLanguageContext();

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    setSelectedTab(actionsTabKeys[0]);
  }, [language]);

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          {translation.validateActions}
        </Typography>
      </Box>
      {/* render tab view if user is an Admin, render single page search bar view if user is not */}
      {userType &&
        (userType === 'Admin' ? (
          <TabContext
            value={
              actionsTabKeys.indexOf(selectedTab) !== -1
                ? selectedTab
                : actionsTabKeys[0]
            }
          >
            <Box
              sx={{
                mt: '4em',
                display: { xs: 'flex', sm: 'block' },
                justifyContent: 'center',
                borderBottom: 1,
                borderTop: 1,
                borderColor: 'divider',
                maxWidth: { xs: 320, sm: '100%' },
              }}
            >
              <TabList
                onChange={handleTabChange}
                aria-label="admin dashboard tabs"
                scrollButtons
                allowScrollButtonsMobile
                variant={scrollableTabs ? 'scrollable' : 'fullWidth'}
                centered={!scrollableTabs}
              >
                <Tab
                  label={translation[actionsTabKeys[0]]}
                  value={actionsTabKeys[0]}
                />
                <Tab
                  label={translation[actionsTabKeys[1]]}
                  value={actionsTabKeys[1]}
                />
                <Tab
                  label={translation[actionsTabKeys[2]]}
                  value={actionsTabKeys[2]}
                />
              </TabList>
            </Box>
            <TabPanel value={actionsTabKeys[0]}>
              <MyGroupsPanel user={user} />
            </TabPanel>
            <TabPanel value={actionsTabKeys[1]}>
              <UsersWithoutGroupPanel user={user} />
            </TabPanel>
            <TabPanel value={actionsTabKeys[2]}>
              <AllUnvalidatedActionsPanel user={user} />
            </TabPanel>
          </TabContext>
        ) : (
          <MyGroupsPanel user={user} />
        ))}
    </>
  );
};

export default ValidateActions;
