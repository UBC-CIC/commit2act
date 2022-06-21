import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import {
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Public, Lock, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

const GroupCard = ({ group, joinGroupOption, user }) => {
  const {
    group_id,
    group_name,
    group_description,
    group_image,
    is_public,
    total_co2,
    weekly_co2,
    total_points,
    weekly_points,
  } = group;
  const [readMore, setReadMore] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const responsive = useMediaQuery(theme.breakpoints.down('md'));
  const descriptionLength = responsive ? 100 : 250;

  const donutChartsData = [
    { groupTotal: total_co2, contribution: user.total_co2 },
    { groupTotal: weekly_co2, contribution: user.weekly_co2 },
    { groupTotal: total_points, contribution: user.total_points },
    { groupTotal: weekly_points, contribution: user.weekly_points },
  ];

  const groupStatsData = [
    { title: 'Total CO2', value: total_co2 },
    { title: 'Weekly CO2', value: weekly_co2 },
    { title: 'Total Points', value: total_points },
    { title: 'Weekly Points', value: weekly_points },
  ];

  const userContributionData = [
    {
      title: 'Total CO2',
      value: Math.round((user.total_co2 / total_co2) * 100),
    },
    {
      title: 'Weekly CO2',
      value: Math.round((user.weekly_co2 / weekly_co2) * 100),
    },
    {
      title: 'Total Points',
      value: Math.round((user.total_points / total_points) * 100),
    },
    {
      title: 'Weekly Points',
      value: Math.round((user.weekly_points / weekly_points) * 100),
    },
  ];

  const joinGroupLink =
    group &&
    '/group-profile/'.concat(
      group_name.replaceAll(' ', '%20'),
      '/add/',
      '-',
      group_id ** 2
    );

  const renderDonutCharts = () => {
    return donutChartsData.map((chart, index) => (
      <Box
        key={index}
        sx={{
          height: '50px',
          width: '200px',
        }}
      >
        <Doughnut
          data={{
            labels: ['Group Total', 'My Contribution'],
            datasets: [
              {
                data: [chart.groupTotal, chart.contribution],
                backgroundColor: ['#808080', '#91C788'],
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
          }}
          height={300}
          width={600}
        />
      </Box>
    ));
  };

  const renderGroupStatListItems = () => {
    return groupStatsData.map((stat, index) => (
      <React.Fragment key={index}>
        <Divider flexItem key={index} />
        <ListItem>
          <ListItemText primary={stat.title} />
          <span>
            <Typography variant="body1">{stat.value} g</Typography>
          </span>
        </ListItem>
      </React.Fragment>
    ));
  };

  const renderUserContributionListItems = () => {
    return userContributionData.map((stat, index) => (
      <React.Fragment key={index}>
        <Divider flexItem />
        <ListItem>
          <ListItemText primary={stat.title} />
          <span>
            <Typography variant="body1">{stat.value}%</Typography>
          </span>
        </ListItem>
      </React.Fragment>
    ));
  };

  const renderResponsiveView = () => {
    return (
      <>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="group-stats-content"
          >
            <Typography>View Group Stats</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense>{renderGroupStatListItems()}</List>
          </AccordionDetails>
        </Accordion>
        {!joinGroupOption && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="user-contributions-content"
            >
              <Typography>My Contributions</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense>{renderUserContributionListItems()}</List>
            </AccordionDetails>
          </Accordion>
        )}
      </>
    );
  };

  const renderBrowserView = () => {
    return joinGroupOption ? (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiTypography-body1': {
            m: 1,
          },
        }}
      >
        <Typography variant="body1">Total CO2: {total_co2} g</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">Weekly CO2: {weekly_co2} g </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">Total Points: {total_points}</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">Weekly Points: {weekly_points}</Typography>
      </Box>
    ) : (
      <>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="group-stats-content"
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                width: '100%',
              }}
            >
              <Typography variant="body1">Total CO2: {total_co2} g</Typography>

              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Weekly CO2: {weekly_co2} g{' '}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Total Points: {total_points}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Weekly Points: {weekly_points}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              p: 0,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',

                py: '0.5em',
                mr: '1em',
              }}
            >
              {renderDonutCharts()}
            </Box>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  return (
    <Card
      sx={{
        display: 'flex',
        mb: '1em',
        textAlign: { xs: 'center', sm: 'left' },
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          alignItems: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <Avatar
          variant="square"
          sx={{
            width: {
              xs: 100,
              sm: 150,
            },
            height: {
              xs: 100,
              sm: '100%',
            },
            alignSelf: { xs: 'center' },
            mt: { xs: '1em', sm: 0 },
          }}
          src={group_image ? group_image : null}
        >
          {group_name.charAt(0)}
        </Avatar>
        <CardContent
          sx={{
            width: { xs: '80%', sm: '100%' },
            p: '1.5em',
          }}
        >
          <Box
            component="div"
            sx={{
              borderBottom: '1px solid #3F72AF',
              mb: '0.625em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'space-between' },
              pb: '0.5em',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              {is_public ? (
                <Public fontSize="small" />
              ) : (
                <Lock fontSize="small" />
              )}
              <Typography
                onClick={() => {
                  navigate(`/group-profile/${group_name}`);
                }}
                sx={{
                  ':hover': { opacity: '0.6', cursor: 'pointer' },
                  fontSize: 22,
                  fontWeight: '400',
                  color: '#455A7F',
                }}
              >
                {group_name}
              </Typography>
            </Stack>
            {joinGroupOption && (
              <Button
                variant="outlined"
                onClick={() => {
                  navigate(joinGroupLink);
                }}
                sx={{ my: { xs: '1em' } }}
              >
                Join Group
              </Button>
            )}
          </Box>
          {/* render mobile view of group stats if screen width is less than 900px, otherwise render browser view */}
          {responsive ? renderResponsiveView() : renderBrowserView()}
          {group_description && (
            <>
              <Typography variant="subtitle1" sx={{ mt: '2em' }}>
                {readMore
                  ? group_description
                  : group_description.slice(0, descriptionLength)}
              </Typography>
              <Button
                sx={{ p: 0, mt: { xs: '1em', sm: '1.5em' }, fontSize: 13 }}
                onClick={() => setReadMore(!readMore)}
              >
                Read {readMore ? 'Less' : 'More'}
              </Button>
            </>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default GroupCard;
