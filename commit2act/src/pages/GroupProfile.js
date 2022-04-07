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
  const [selectedTab, setSelectedTab] = useState('Group Members');

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
          xs={6}
          sm={6}
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
                xs: '28vw',
                sm: '22vw',
                md: '10vw',
                lg: '10vw',
                xl: '10vw',
              },
              height: {
                xs: '12vh',
                md: '22vh',
                lg: '18vh',
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
      <Grid item xs={12} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
        <Typography variant="h2" sx={{ mt: '1em' }}>
          Group Members
        </Typography>
        <Grid
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
      </Grid>
    );
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid
          columnSpacing={8}
          container
          alignItems="flex-start"
          sx={{ mt: '2em' }}
        >
          <Grid item xs={5}>
            <Grid
              container
              direction="row"
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
                  mr: '1em',
                }}
              >
                {groupName.charAt(0)}
              </Avatar>
              {/* <Button
                variant="outlined"
                sx={{ mt: '2em', mb: { xs: '2em', lg: '0em' } }}
              >
                Leave Group
              </Button> */}
              <Typography component="div" variant="h1">
                {groupName}
              </Typography>
            </Grid>
            <Typography variant="subtitle1">{description}</Typography>
          </Grid>
          <Grid
            item
            xs={7}
            sx={{
              textAlign: { xs: 'center', lg: 'left' },
            }}
          >
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 0, md: 1 }}
              direction={{ xs: 'column', lg: 'row' }}
              sx={{
                width: '100%',
                minHeight: '50vh',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
              }}
            >
              <Grid item xs={6}>
                <Card raised={true} sx={{ p: '1em', height: '28vh' }}>
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
                <Card raised={true} sx={{ p: '1em', height: '28vh' }}>
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

          <Grid item xs={12}>
            <TabContext value={selectedTab}>
              <Box
                sx={{
                  mt: '3em',
                  borderBottom: 1,
                  borderColor: 'divider',
                  width: '100%',
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="group profile tabs"
                >
                  <Tab label="Group Members" value="Group Members" />
                  <Tab label="Member Actions" value="Member Actions" />
                  <Tab label="Group Info" value="Group Info" />
                </TabList>
              </Box>
              <TabPanel value="Group Members">
                {renderGroupMemberPanel()}
              </TabPanel>
              <TabPanel value="Member Actions">Member Actions</TabPanel>
              <TabPanel value="Group Info">Group Info</TabPanel>
            </TabContext>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default GroupProfile;
