import React from 'react';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
} from '@mui/material';
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

  let description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque eros, dignissim quis lobortis quis, luctus a libero. Sed in lectus ut odio porta pharetra. Maecenas at congue tellus. Suspendisse interdum suscipit feugiat. Curabitur ultricies quis lorem eu aliquam. Duis et elit facilisis, finibus dolor nec, euismod eros.';
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

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography component="div" item xs={12} variant="h1">
            {groupName}
          </Typography>
        </Grid>
        <Grid
          columnSpacing={10}
          container
          alignItems="flex-start"
          sx={{ mt: '2em' }}
        >
          <Grid item xs={12} lg={3}>
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
                    xs: '24vw',
                    sm: '22vw',
                    md: '20vw',
                    lg: '15vw',
                    xl: '15vw',
                  },
                  height: {
                    xs: '12vh',
                    md: '22vh',
                    lg: '24vh',
                    xl: '26vh',
                  },
                }}
              >
                {groupName.charAt(0)}
              </Avatar>
              <Button
                variant="outlined"
                sx={{ mt: '2em', mb: { xs: '2em', lg: '0em' } }}
              >
                Join Group
              </Button>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            lg={9}
            sx={{ textAlign: { xs: 'center', lg: 'left' } }}
          >
            <Typography variant="subtitle1">{description}</Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1 }}
              direction={{ xs: 'column', lg: 'row' }}
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
                <Card raised={true} sx={{ p: '1em', height: '28vh' }}>
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
                <Card raised={true} sx={{ p: '1em', height: '28vh' }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Total CO2 Saved</Typography>
                    <CardContent>
                      <Typography variant="h5">800g</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs>
                <Card raised={true} sx={{ p: '1em', height: '28vh' }}>
                  <CardActionArea sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">Recent Actions</Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
            <Typography variant="h2" sx={{ mt: '3em' }}>
              Group Members
            </Typography>
            <Grid
              container
              columnSpacing={1}
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
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default GroupProfile;
