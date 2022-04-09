import React, { useState } from 'react';
import {
  Typography,
  Box,
  Tab,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
} from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import { AutoGraphOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';
import { useParams } from 'react-router-dom';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: '#112D4E',
            fontWeight: 'bold',
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 50,
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const GroupProfile = () => {
  const { groupName } = useParams();
  const [selectedTab, setSelectedTab] = useState('0');

  let description =
    'UBC’s CIC is a public-private collaboration between UBC and Amazon. A CIC identifies digital transformation challenges, the problems or opportunities that matter to the community, and provides subject matter expertise and CIC leadership.';
  //need to add query to get group description and other information

  let members = [
    { name: 'Christy' },
    { name: 'John' },
    { name: 'Michael' },
    { name: 'Alex' },
    { name: 'Test' },
    { name: 'Liana' },
    { name: 'Mike' },
  ];

  const renderGroupMembers = () => {
    if (members) {
      return members.map((member, index) => (
        <Grid
          container
          item
          xs={6}
          sm={4}
          md={2}
          lg={2}
          xl={2}
          sx={{ justifyContent: 'center' }}
        >
          <Avatar
            key={index}
            variant="rounded"
            sx={{
              width: {
                xs: 100,
              },
              height: {
                xs: 100,
              },
              mb: { xs: '1.5em' },
            }}
          >
            {member.name.charAt(0)}
          </Avatar>
        </Grid>
      ));
    }
  };

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const renderGroupMemberPanel = () => {
    return (
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
        {renderGroupMembers()}
      </Grid>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        columnSpacing={{ xs: 0, md: 8 }}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mt: '2em' }}
        gap={{ xs: '2em', md: '0' }}
        textAlign={{ xs: 'center', md: 'left' }}
      >
        <Grid
          container
          item
          xs={4.5}
          width={{ xs: '70%', sm: '100%' }}
          direction={{ xs: 'column', md: 'row' }}
          gap={{ xs: '2em' }}
          alignItems="center"
          sx={{ mb: '1.5em' }}
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
              mr: { xs: 0, md: '1em' },
            }}
          >
            {groupName.charAt(0)}
          </Avatar>
          <Typography component="div" variant="h1">
            {groupName}
          </Typography>
          <Typography component="div" variant="subtitle1">
            {description}
          </Typography>
        </Grid>

        <Grid item xs={7.5}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 0, sm: 1 }}
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            sx={{
              width: '100%',
              backgroundColor: '#DBE2EF',
              borderRadius: '8px',
              padding: '1.5em',
              minHeight: '50vh',
            }}
          >
            <Grid item xs={6}>
              <Card raised={true} sx={{ p: '1em', height: { md: '25vh' } }}>
                <CardActionArea sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">CO2 Saved This Week</Typography>
                  <CardContent>
                    <Typography variant="h5">
                      <AutoGraphOutlined fontSize="large" />
                      800g
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card raised={true} sx={{ p: '1em', height: { md: '25vh' } }}>
                <CardActionArea sx={{ textAlign: 'center' }}>
                  <Typography variant="h4">Total CO2 Saved</Typography>
                  <CardContent>
                    <Typography variant="h5">1600g</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          item
          sx={{
            mt: { xs: '2em', md: '3em' },
            width: { xs: '70%', sm: '100%' },
          }}
        >
          <TabContext value={selectedTab}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                width: '100%',
                display: 'flex',
                padding: '0.5em',
              }}
            >
              <TabList
                onChange={handleTabChange}
                aria-label="group profile tabs"
                scrollButtons
                allowScrollButtonsMobile
                variant="scrollable"
              >
                <Tab label="Group Members" value="0" />
                <Tab label="Member Actions" value="1" />
                <Tab label="Group Info" value="2" />
              </TabList>
              <Button variant="outlined" sx={{ ml: 'auto', mb: '0.5em' }}>
                Join Group
              </Button>
            </Box>
            <TabPanel
              sx={{
                padding: { xs: '0' },
                width: '100%',
              }}
              value="0"
            >
              {renderGroupMemberPanel()}
            </TabPanel>
            <TabPanel value="1">Member Actions</TabPanel>
            <TabPanel value="2">Group Info</TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default GroupProfile;
