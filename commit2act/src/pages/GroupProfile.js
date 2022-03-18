import React from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Box,
} from '@mui/material';
import { AutoGraphOutlined } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';

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
  let group = {
    name: 'UBC CIC',
    description:
      'UBC’s CIC is a public-private collaboration between UBC and Amazon. A CIC identifies digital transformation challenges, the problems or opportunities that matter to the community, and provides subject matter expertise and CIC leadership.',
    is_public: true,
  };
  let groupUsers = [{ name: 'Christy' }, { name: 'John' }, { name: 'Michael' }];

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography component="div" item xs={12} variant="h1">
            {group.name}
          </Typography>
        </Grid>
        <Grid
          columnSpacing={10}
          container
          alignItems="flex-start"
          sx={{ mt: '2em' }}
        >
          <Grid item xs={3}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: {
                    xs: '19vw',
                    sm: '22vw',
                    md: '15vw',
                    xl: '9vw',
                  },
                  height: {
                    xs: '10vh',
                    sm: '12vh',
                    md: '28vh',
                    xl: '18vh',
                  },
                }}
              >
                {group.name.charAt(0)}
              </Avatar>
              <Button variant="outlined" sx={{ mt: '2em' }}>
                Join Group
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={9}>
            <Typography variant="subtitle1">{group.description}</Typography>
            <Grid
              container
              spacing={1}
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                width: '100%',
                minHeight: '50vh',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
                mt: '2em',
              }}
            >
              <Grid item xs={4}>
                <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">CO2 Saved This Week</Typography>
                    <CardContent>
                      <Typography variant="h5">
                        <AutoGraphOutlined fontSize="large" />
                        150g
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Total CO2 Saved</Typography>
                    <CardContent>
                      <Typography variant="h5">800g</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs>
                <Card raised="true" sx={{ p: '1em', height: '28vh' }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Recent Actions</Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ mt: '3em' }}>
              Groups Members
            </Typography>
            <Grid
              container
              spacing={1}
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                width: '100%',
                minHeight: '50vh',
                backgroundColor: '#DBE2EF',
                borderRadius: '8px',
                padding: '1.5em',
                mt: '2em',
              }}
            ></Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default GroupProfile;
