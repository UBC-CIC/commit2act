import React, { useState } from 'react';
import { Box, Typography, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import useMediaQuery from '@mui/material/useMediaQuery';
import GroupValidateSearchBar from '../components/validateActions/GroupValidateSearchBar';

const ValidateActions = ({ user, userType }) => {
  const tabs = ['My Groups', 'Users Without Groups'];
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
              </TabList>
            </Box>
            <TabPanel value={tabs[0]}>
              <GroupValidateSearchBar user={user} />
            </TabPanel>
            <TabPanel value={tabs[1]}></TabPanel>
          </TabContext>
        ) : (
          <GroupValidateSearchBar user={user} />
        ))}
    </>
  );
};

export default ValidateActions;
