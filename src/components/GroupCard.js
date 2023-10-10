import React, { useState, useEffect } from 'react';
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
import UserContributionDonutChart from './UserContributionDonutChart';
import { API } from 'aws-amplify';
import { getUserStatsForGroup } from '../graphql/queries';

import useTranslation from "../components/customHooks/translations";

const GroupCard = ({ group, joinGroupOption, user }) => {
  const translation = useTranslation();
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
  const [userStats, setUserStats] = useState();
  const [donutChartsData, setDonutChartsData] = useState();
  const [userContributionPercentages, setUserContributionPercentages] =
    useState();
  const navigate = useNavigate();
  const theme = useTheme();
  const responsive = useMediaQuery(theme.breakpoints.down('md'));
  const descriptionLength = responsive ? 100 : 250;

  useEffect(() => {
    const getUserStats = async () => {
      const res = await API.graphql({
        query: getUserStatsForGroup,
        variables: { user_id: user.user_id, group_id: group_id },
      });
      setUserStats(res.data.getUserStatsForGroup);
    };

    group && user && getUserStats();
  }, [group, group_id, user, user.user_id]);

  useEffect(() => {
    if (userStats) {
      const donutData = [
        {
          groupTotal: total_co2 - userStats.total_co2,
          contribution: userStats.total_co2,
          title: translation.totalCO2,
        },
        {
          groupTotal: weekly_co2 - userStats.weekly_co2,
          contribution: userStats.weekly_co2,
          title: translation.weeklyCO2,
        },
        {
          groupTotal: total_points - userStats.total_points,
          contribution: userStats.total_points,
          title: translation.totalPoints,
        },
        {
          groupTotal: weekly_points - userStats.weekly_points,
          contribution: userStats.weekly_points,
          title: translation.weeklyPoints,
        },
      ];
      setDonutChartsData(donutData);

      const percentageData = [
        {
          title: translation.totalCO2,
          value: Math.round((userStats.total_co2 / total_co2) * 100),
        },
        {
          title: translation.weeklyCO2,
          value: Math.round((userStats.weekly_co2 / weekly_co2) * 100),
        },
        {
          title: translation.totalPoints,
          value: Math.round((userStats.total_points / total_points) * 100),
        },
        {
          title: translation.weeklyPoints,
          value: Math.round((userStats.weekly_points / weekly_points) * 100),
        },
      ];
      setUserContributionPercentages(percentageData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStats]);

  const groupStatsData = [
    { title: translation.totalCO2, value: Math.ceil(total_co2) },
    { title: translation.weeklyCO2, value: Math.ceil(weekly_co2) },
    { title: translation.totalPoints, value: total_points },
    { title: translation.weeklyPoints, value: weekly_points },
  ];

  const joinGroupLink =
    group &&
    '/group-profile/'.concat(
      encodeURIComponent(group_name),
      '/add/',
      '-',
      group_id ** 2
    );

  const renderGroupStatListItems = () => {
    return groupStatsData.map((stat, index) => (
      <React.Fragment key={index}>
        <Divider flexItem key={index} />
        <ListItem>
          <ListItemText primary={stat.title} />
          <span>
            <Typography variant="body1" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{stat.value} g</Typography>
          </span>
        </ListItem>
      </React.Fragment>
    ));
  };

  const renderUserContributionListItems = () => {
    return (
      userContributionPercentages &&
      userContributionPercentages.map((stat, index) => (
        <React.Fragment key={index}>
          <Divider flexItem />
          <ListItem>
            <ListItemText primary={stat.title} />
            <span>
              <Typography variant="body1" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{stat.value}%</Typography>
            </span>
          </ListItem>
        </React.Fragment>
      ))
    );
  };

  const renderResponsiveView = () => {
    return (
      <>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="group-stats-content"
          >
            <Typography>{translation.viewGroupStats}</Typography>
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
              <Typography>{translation.myContributions}</Typography>
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
        <Typography variant="body1">{translation.totalCO2Colon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{Math.ceil(total_co2)} g{' '}</Box></Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">{translation.weeklyCO2Colon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{Math.ceil(weekly_co2)} g{' '}</Box></Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">{translation.totalPointsColon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{total_points}</Box></Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body1">{translation.weeklyPointsColon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{weekly_points}</Box></Typography>
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
              <Typography variant="body1">
                {translation.totalCO2Colon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{Math.ceil(total_co2)} g</Box>
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                {translation.weeklyCO2Colon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{Math.ceil(weekly_co2)} g</Box>
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                {translation.totalPointsColon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{total_points}</Box>
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                {translation.weeklyPointsColon} <Box component="span" sx={{ color: theme.palette.tertiary.main, fontWeight: '600' }}>{weekly_points}</Box>
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
              {donutChartsData &&
                donutChartsData.map((data, index) => (
                  <UserContributionDonutChart
                    key={index}
                    data={data}
                    displayTitles={false}
                  />
                ))}
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
          aria-hidden="true"
          sx={{
            width: {
              xs: 150,
              sm: 220,
            },
            height: {
              xs: 100,
              sm: '100%',
            },
            alignSelf: { xs: 'center' },
            mt: { xs: '1em', sm: 0 },
            backgroundColor: '#fff',
          }}
          src={group_image ? group_image : null}
        >
          {group_name.charAt(0)}
        </Avatar>
        <CardContent
          sx={{
            width: { xs: '80%', sm: '100%' },
            p: '.5em 1.5em 1.5em 1.5em',
          }}
        >
          <Box
            component="div"
            sx={{
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
                  navigate(`/group-profile/${encodeURIComponent(group_name)}`);
                }}
                sx={{
                  ':hover': { opacity: '0.6', cursor: 'pointer' },
                  fontSize: 22,
                  fontWeight: '400',
                }}
              >
                {group_name}
              </Typography>
            </Stack>
            {joinGroupOption && (
              <Button
                variant="contained"
                onClick={() => {
                  navigate(joinGroupLink);
                }}
                sx={{ my: { xs: '1em' } }}
              >
                {translation.joinGroup}
              </Button>
            )}
          </Box>
          {/* render mobile view of group stats if screen width is less than 900px, otherwise render browser view */}
          {responsive ? renderResponsiveView() : renderBrowserView()}
          {group_description && (
            <Box sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              <Typography variant="subtitle1" sx={{ mt: '2em' }}>
                {readMore
                  ? group_description
                  : group_description.slice(0, descriptionLength)}
              </Typography>
              {group_description.length > descriptionLength ? (
                <Button
                  sx={{ p: 0, mt: { xs: '1em', sm: '1.5em' }, fontSize: 13 }}
                  onClick={() => setReadMore(!readMore)}
                >
                  {translation.read} {readMore ? translation.less : translation.more}
                </Button>
              ) : null}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default GroupCard;
