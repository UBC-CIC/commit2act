import React, { useState } from 'react';
import { Box, Typography, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useMediaQuery from '@mui/material/useMediaQuery';
import UsersWithoutGroupPanel from '../components/validateActions/UsersWithoutGroupPanel';
import AllUnvalidatedActionsPanel from '../components/validateActions/AllUnvalidatedActionsPanel';
import MyGroupsPanel from '../components/validateActions/MyGroupsPanel';

const ValidateActions = ({ user, userType }) => {
  const tabs = ['My Groups', 'Users Without Groups', 'All Unvalidated Actions'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const scrollableTabs = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box sx={{ textAlign: { xs: 'center' } }}>
        <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
          Validate Actions
        </Typography>
      </Box>
      {/* render tab view if user is an Admin, render single page search bar view if user is not */}
      {userType &&
        (userType === 'Admin' ? (
          <TabContext value={selectedTab}>
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
                <Tab label={tabs[0]} value={tabs[0]} />
                <Tab label={tabs[1]} value={tabs[1]} />
                <Tab label={tabs[2]} value={tabs[2]} />
              </TabList>
            </Box>
            <TabPanel value={tabs[0]}>
              <MyGroupsPanel user={user} />
            </TabPanel>
            <TabPanel value={tabs[1]}>
              <UsersWithoutGroupPanel user={user} />
            </TabPanel>
            <TabPanel value={tabs[2]}>
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
