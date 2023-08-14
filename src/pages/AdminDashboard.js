import React, { useState } from 'react';
import { Box, Typography, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CreateAction from './CreateAction';
import ManageActions from '../components/adminDashboard/ManageActions';
import ManageQuizzes from '../components/adminDashboard/ManageQuizzes';
import Dashboard from '../components/adminDashboard/Dashboard';
import useTranslation from "../components/customHooks/translations";

const AdminDashboard = () => {
  const translation = useTranslation();
  const tabs = [
    'Dashboard',
    'Create Action',
    'Manage Actions',
    'Manage Quiz Questions',
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <TabContext value={selectedTab}>
      <Box
        sx={{
          mt: { xs: 0, lg: '-64px' },
          mx: { xs: 0, lg: '-64px' },
          mb: '2em',
          display: { xs: 'flex', sm: 'block' },
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            maxWidth: { xs: 320, sm: '100%' },
          }}
        >
          <TabList
            onChange={handleTabChange}
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label={tabs[0]} value={tabs[0]} />
            <Tab label={tabs[1]} value={tabs[1]} />
            <Tab label={tabs[2]} value={tabs[2]} />
            <Tab label={tabs[3]} value={tabs[3]} />
          </TabList>
        </Box>
      </Box>
      <TabPanel value={tabs[0]}>
        <Dashboard />
      </TabPanel>
      <TabPanel value={tabs[1]}>
        <CreateAction />
      </TabPanel>
      <TabPanel value={tabs[2]} sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ mb: '2em' }}>
          Select an action to view and edit
        </Typography>
        <ManageActions />
      </TabPanel>
      <TabPanel value={tabs[3]} sx={{ textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ mb: '2em' }}>
          Select an action to view and add quiz questions
        </Typography>
        <ManageQuizzes />
      </TabPanel>
    </TabContext>
  );
};

export default AdminDashboard;
