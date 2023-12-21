import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tab,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Link,
  Divider,
  ListItem,
  ListItemText,
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { getAllGroups, getUserStatsForGroup } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { AutoGraph, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { SortLeaderboard } from '../SortLeaderboard';
import UserContributionDonutChart from '../UserContributionDonutChart';
import { useNavigate } from 'react-router-dom';
import useTranslation from "../customHooks/translations";

const StyledTableBody = styled(TableBody)`
  td {
    color: #33AF99;
    font-weight: 600;
  }
  .currentGroupOrUser {
    background: linear-gradient(91.49deg, #56C573 0.29%, #5BC0AC 100%);
    th,td {
      color: #000;
    }
    a {
      color: #000;
    }
  }
`;

const GroupPageLeaderboard = ({ currentGroup, groupMembers, userId, user }) => {
  const navigate = useNavigate();
  const translation = useTranslation();
  const tabs = [
    translation.groupMembers,
    translation.globalGroups,
  ];
  const filters = [
    { name: translation.totalCO2Saved, property: 'total_co2' },
    { name: translation.weeklyCO2Saved, property: 'weekly_co2' },
    { name: translation.totalPoints, property: 'total_points' },
    { name: translation.weeklyPoints, property: 'weekly_points' },
  ];
  const [groups, setGroups] = useState();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [filteredGroups, setFilteredGroups] = useState();
  const [filteredMembers, setFilteredMembers] = useState();
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userStats, setUserStats] = useState();
  const [donutChartsData, setDonutChartsData] = useState();
  const [userContributionPercentages, setUserContributionPercentages] =
    useState();

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const hideCharts = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (userStats) {
      const donutData = [
        {
          groupTotal: currentGroup.total_co2 - userStats.total_co2,
          contribution: userStats.total_co2,
          title: translation.totalCO2,
        },
        {
          groupTotal: currentGroup.weekly_co2 - userStats.weekly_co2,
          contribution: userStats.weekly_co2,
          title: translation.weeklyCO2,
        },
        {
          groupTotal: currentGroup.total_points - userStats.total_points,
          contribution: userStats.total_points,
          title: translation.totalPoints,
        },
        {
          groupTotal: currentGroup.weekly_points - userStats.weekly_points,
          contribution: userStats.weekly_points,
          title: translation.weeklyPoints,
        },
      ];
      setDonutChartsData(donutData);

      const percentageData = [
        {
          title: translation.totalCO2,
          value: Math.round(
            (userStats.total_co2 / currentGroup.total_co2) * 100
          ),
        },
        {
          title: translation.weeklyCO2,
          value: Math.round(
            (userStats.weekly_co2 / currentGroup.weekly_co2) * 100
          ),
        },
        {
          title: translation.totalPoints,
          value: Math.round(
            (userStats.total_points / currentGroup.total_points) * 100
          ),
        },
        {
          title: translation.weeklyPoints,
          value: Math.round(
            (userStats.weekly_points / currentGroup.weekly_points) * 100
          ),
        },
      ];
      setUserContributionPercentages(percentageData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStats]);

  // avoid a layout jump in the table when reaching the last page with empty rows
  let emptyRows =
    page <= 0
      ? 0
      : selectedTab === tabs[1]
        ? Math.max(0, (1 + page) * rowsPerPage - groups.length)
        : selectedTab === tabs[0]
          ? Math.max(0, (1 + page) * rowsPerPage - groupMembers.length)
          : 0;

  useEffect(() => {
    const getUserStats = async () => {
      const res = await API.graphql({
        query: getUserStatsForGroup,
        variables: { user_id: user.user_id, group_id: currentGroup.group_id },
      });
      setUserStats(res.data.getUserStatsForGroup);
    };

    const getGroups = async () => {
      const res = await API.graphql({
        query: getAllGroups,
      });
      setGroups(res.data.getAllGroups);
    };

    currentGroup && user && getUserStats();
    getGroups();
  }, []);

  //filters groups when group state is initially set, filters groups and group members every time a new filter is selected
  useEffect(() => {
    if (groups && groupMembers) {
      handleFilterSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, groupMembers, selectedFilter]);

  //sets filter back to default (total co2) and sets page back to first page on tab change
  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
    setSelectedFilter(filters[0]);
    setPage(0);
  };

  /** functions for filter menu */
  const handleClick = (e) => {
    setFilterMenuAnchor(e.currentTarget);
    setOpenFilterMenu(true);
  };

  const handleClose = () => {
    setFilterMenuAnchor(null);
    setOpenFilterMenu(false);
  };

  const handleFilterSelection = () => {
    const propertySelected = selectedFilter.property;
    //if Global Group tab is selected, apply the selected filter to all groups
    if (selectedTab === tabs[1] && groups) {
      //make a mutable copy of the groups array, sort that array and update the in state version of groups
      let groupsArrayCopy = [...groups];
      let sortedByFilter = groupsArrayCopy.sort(
        (a, b) => b[propertySelected] - a[propertySelected]
      );
      setFilteredGroups(sortedByFilter);
    }
    //if Group Members tab is selected, apply the selected filter to all users
    if (selectedTab === tabs[0] && groupMembers) {
      //make a mutable copy of the groupMembers array, sort that array and update the in state version of groupMembers
      let groupMemberArrayCopy = [...groupMembers];
      let sortedByFilter = groupMemberArrayCopy.sort(
        (a, b) => b[propertySelected] - a[propertySelected]
      );
      setFilteredMembers(sortedByFilter);
    }
    handleClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderUserContributionListItems = () => {
    return userContributionPercentages.map((stat, index) => (
      <React.Fragment key={index}>
        <Divider flexItem />
        <ListItem>
          <ListItemText primary={stat.title} />
          <span>
            <Typography variant="body1">
              {stat.value ? stat.value : 0}%
            </Typography>
          </span>
        </ListItem>
      </React.Fragment>
    ));
  };

  /** function for displaying the leaderboard tables */

  const renderTable = () => {
    return (
      <>
        {/* if Global Groups tab is selected, render group current place */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: { xs: '2em', sm: '0' },
          }}
        >
          {filteredGroups && selectedTab === tabs[1] && (
            <Typography
              variant="h3"
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {translation.currentPlace}
              <Typography variant="h1" sx={{ mt: '0.2em' }}>
                <AutoGraph />
                {filteredGroups.findIndex(
                  (group) => group.group_name === currentGroup.group_name
                ) + 1}{' '}
                / {filteredGroups.length}
              </Typography>
            </Typography>
          )}
          {/* if Group Members tab is selected, check if user is a group member, then render user's current place. If user doesn't belong to the group, don't render current place */}
          {filteredMembers &&
            selectedTab === tabs[0] &&
            groupMembers.findIndex((member) => member.user_id === userId) !==
            -1 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: hideCharts ? 'column' : 'row',
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  {translation.currentPlace}
                  <Typography
                    variant="h1"
                    sx={{
                      mt: '0.2em',
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <AutoGraph />
                    {filteredMembers.findIndex(
                      (member) => member.user_id === userId
                    ) + 1}{' '}
                    / {groupMembers.length}
                  </Typography>
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}
                >
                  {hideCharts ? (
                    <Accordion sx={{ my: '1.5em' }}>
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
                  ) : (
                    donutChartsData.map((data) => (
                      <UserContributionDonutChart
                        data={data}
                        displayTitles={true}
                      />
                    ))
                  )}
                </Box>
              </Box>
            )}
        </Box>
        <TableContainer component={Paper} sx={{ mt: '1em' }}>
          <Table stickyHeader aria-label="group leaderboard">
            <caption>
              {translation.formatString(translation.leaderboardDisplaying, { tab: selectedTab })}{selectedFilter.name}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>{translation.rank}</TableCell>
                <TableCell align="left">{translation.name}</TableCell>
                <TableCell align="right">{translation.totalCO2}</TableCell>
                <TableCell align="right">{translation.totalPoints}</TableCell>
                <TableCell align="right">{translation.weeklyCO2}</TableCell>
                <TableCell align="right">{translation.weeklyPoints}</TableCell>
              </TableRow>
            </TableHead>
            <StyledTableBody>
              {/* if Global Groups tab is selected, display all groups data in table body*/}
              {selectedTab === tabs[1] &&
                filteredGroups &&
                (rowsPerPage > 0
                  ? filteredGroups.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : filteredGroups
                ).map((group, index) => (
                  <TableRow
                    key={group.group_id}
                    className={
                      currentGroup.group_name === group.group_name
                        ? 'currentGroupOrUser'
                        : ''
                    }
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {/* if on page 1, add 1 to the index to get item rankings starting from 1. On further pages, add the number of items on all the pages prior to the item's index + 1 value to get the correct ranking */}
                      {page > 0 ? rowsPerPage * page + index + 1 : index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link
                        onClick={() => {
                          navigate(`/group-profile/${encodeURI(group.group_name)}`);
                        }}
                        sx={{
                          color: '#fff',
                          fontSize: '1.1em',
                          textDecorationColor: '#33AF99',
                          ':hover': { opacity: '0.6', cursor: 'pointer' },
                        }}
                      >
                        {group.group_name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{Math.ceil(group.total_co2)}</TableCell>
                    <TableCell align="right">{group.total_points}</TableCell>
                    <TableCell align="right">{Math.ceil(group.weekly_co2)}</TableCell>
                    <TableCell align="right">{group.weekly_points}</TableCell>
                  </TableRow>
                ))}

              {/* if Group Members tab is selected, display all member data in table body*/}
              {selectedTab === tabs[0] &&
                filteredMembers &&
                (rowsPerPage > 0
                  ? filteredMembers.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  : filteredMembers
                ).map((member, index) => (
                  <TableRow
                    key={member.user_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    className={
                      userId === member.user_id && 'currentGroupOrUser'
                    }
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      {page > 0 ? rowsPerPage * page + index + 1 : index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {member.name}
                    </TableCell>
                    <TableCell align="right">{Math.ceil(member.total_co2)}</TableCell>
                    <TableCell align="right">{member.total_points}</TableCell>
                    <TableCell align="right">{Math.ceil(member.weekly_co2)}</TableCell>
                    <TableCell align="right">{member.weekly_points}</TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </StyledTableBody>
          </Table>
        </TableContainer>
        {/* render the correct pagination options for each table */}
        {selectedTab === tabs[1] && groups && (
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={groups && groups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
            labelRowsPerPage={translation.labelRowsPerPage}
            labelDisplayedRows={
              ({ from, to, count }) => {
                return '' + from + ' - ' + to + ' ' + translation.of + ' ' + count
              }
            }
          />
        )}
        {selectedTab === tabs[0] && groupMembers && (
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={groupMembers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
            labelRowsPerPage={translation.labelRowsPerPage}
            labelDisplayedRows={
              ({ from, to, count }) => {
                return '' + from + ' - ' + to + ' ' + translation.of + ' ' + count
              }
            }
          />
        )}
      </>
    );
  };

  return (
    <>
      {groups && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'space-between' },
              alignItems: 'center',
              gap: { xs: '1em', sm: '0' },
              mb: '1em',
              width: '100%',
            }}
          >
            <Typography variant="h2">{translation.leaderboards}</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SortLeaderboard
                onSelectSort={handleClick}
                selectedSort={selectedFilter}
              />
              <Menu
                id="filter-menu"
                open={openFilterMenu}
                anchorEl={filterMenuAnchor}
                onClose={handleClose}
              >
                {filters.map((filter, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
          <TabContext value={tabs.indexOf(selectedTab) !== -1 ? selectedTab : tabs[0]}>
            <Box
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                width: '100%',
                display: { xs: 'contents', sm: 'flex' },
                padding: '0.5em',
              }}
            >
              <TabList
                orientation={mobileView ? 'horizontal' : 'vertical'}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                onChange={handleTabChange}
                aria-label="Leaderboard tabs"
                sx={{
                  borderTop: { xs: 1, sm: 1 },
                  borderRight: { xs: 0, sm: 1 },
                  borderBottom: { xs: 1, sm: 1 },
                  borderTopColor: { xs: 'divider', sm: 'transparent' },
                  borderRightColor: { xs: 'transparent', sm: 'divider' },
                  borderBottomColor: { xs: 'divider', sm: 'transparent' },
                }}
              >
                <Tab label={translation.groupMembers} value={tabs[0]} />
                <Tab label={translation.globalGroups} value={tabs[1]} />
              </TabList>
              <TabPanel
                value={tabs[0]}
                sx={{ width: '100%', padding: { xs: '0', sm: '1.5em' } }}
              >
                {renderTable()}
              </TabPanel>
              <TabPanel
                value={tabs[1]}
                sx={{ width: '100%', padding: { xs: '0', sm: '1.5em' } }}
              >
                {renderTable()}
              </TabPanel>
            </Box>
          </TabContext>
        </>
      )}
    </>
  );
};

export default GroupPageLeaderboard;
