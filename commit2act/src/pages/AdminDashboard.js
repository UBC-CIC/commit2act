import React, { useState } from 'react';
import { Box, Typography, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CreateAction from './CreateAction';
import ViewAndEditActions from './ViewAndEditActions';

const AdminDashboard = () => {
  const tabs = ['Dashboard', 'Create Action', 'View/Edit Actions'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <TabContext value={selectedTab}>
      <Box
        sx={{
          mt: { xs: 0, md: '-64px' },
          mx: { xs: 0, md: '-64px' },
          mb: '2em',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            width: '100%',
            display: 'flex',
          }}
        >
          <TabList
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            scrollButtons
            allowScrollButtonsMobile
            variant="scrollable"
          >
            <Tab label={tabs[0]} value={tabs[0]} />
            <Tab label={tabs[1]} value={tabs[1]} />
            <Tab label={tabs[2]} value={tabs[2]} />
          </TabList>
        </Box>
      </Box>
      <TabPanel value={tabs[0]}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h1" sx={{ mt: { xs: '1.5em', md: '0' } }}>
            Admin Dashboard
          </Typography>
        </Box>
      </TabPanel>
      <TabPanel value={tabs[1]}>
        <CreateAction />
      </TabPanel>
      <TabPanel value={tabs[2]}>
        <ViewAndEditActions />
      </TabPanel>
    </TabContext>
  );
};

export default AdminDashboard;
