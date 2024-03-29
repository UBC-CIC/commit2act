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
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Divider,
  ListItem,
  ListItemText,
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { getAllGroups, getUserStatsForGroup } from '../../graphql/queries';
import { API } from 'aws-amplify';
import FilterListIcon from '@mui/icons-material/FilterList';
import { AutoGraph, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import UserContributionDonutChart from '../UserContributionDonutChart';

const StyledTableBody = styled(TableBody)`
  .currentGroupOrUser {
    background-color: #f6f6f6;
  }
`;

const GroupPageLeaderboard = ({ currentGroup, groupMembers, userId, user }) => {
  const tabs = ['Global Groups', 'Group Members'];
  const filters = [
    { name: 'Total CO2 Saved', property: 'total_co2' },
    { name: 'Weekly CO2 Saved', property: 'weekly_co2' },
    { name: 'Total Points', property: 'total_points' },
    { name: 'Weekly Points', property: 'weekly_points' },
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
          title: 'Total CO2',
        },
        {
          groupTotal: currentGroup.weekly_co2 - userStats.weekly_co2,
          contribution: userStats.weekly_co2,
          title: 'Weekly CO2',
        },
        {
          groupTotal: currentGroup.total_points - userStats.total_points,
          contribution: userStats.total_points,
          title: 'Total Points',
        },
        {
          groupTotal: currentGroup.weekly_points - userStats.weekly_points,
          contribution: userStats.weekly_points,
          title: 'Weekly Points',
        },
      ];
      setDonutChartsData(donutData);

      const percentageData = [
        {
          title: 'Total CO2',
          value: Math.round(
            (userStats.total_co2 / currentGroup.total_co2) * 100
          ),
        },
        {
          title: 'Weekly CO2',
          value: Math.round(
            (userStats.weekly_co2 / currentGroup.weekly_co2) * 100
          ),
        },
        {
          title: 'Total Points',
          value: Math.round(
            (userStats.total_points / currentGroup.total_points) * 100
          ),
        },
        {
          title: 'Weekly Points',
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
      : selectedTab === tabs[0]
      ? Math.max(0, (1 + page) * rowsPerPage - groups.length)
      : selectedTab === tabs[1]
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
    if (selectedTab === tabs[0] && groups) {
      //make a mutable copy of the groups array, sort that array and update the in state version of groups
      let groupsArrayCopy = [...groups];
      let sortedByFilter = groupsArrayCopy.sort(
        (a, b) => b[propertySelected] - a[propertySelected]
      );
      setFilteredGroups(sortedByFilter);
    }
    //if Group Members tab is selected, apply the selected filter to all users
    if (selectedTab === tabs[1] && groupMembers) {
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
          {filteredGroups && selectedTab === tabs[0] && (
            <Typography
              variant="h3"
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              Current Place
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
            selectedTab === tabs[1] &&
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
                  Current Place
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
                        <Typography>My Contributions</Typography>
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
              Leaderboard displaying {selectedTab} ranked by{' '}
              {selectedFilter.name}
            </caption>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="right">Total CO2</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">Weekly CO2</TableCell>
                <TableCell align="right">Weekly Points</TableCell>
              </TableRow>
            </TableHead>
            <StyledTableBody>
              {/* if Global Groups tab is selected, display all groups data in table body*/}
              {selectedTab === tabs[0] &&
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
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      {/* if on page 1, add 1 to the index to get item rankings starting from 1. On further pages, add the number of items on all the pages prior to the item's index + 1 value to get the correct ranking  */}
                      {page > 0 ? rowsPerPage * page + index + 1 : index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {group.group_name}
                    </TableCell>
                    <TableCell align="right">{group.total_co2}</TableCell>
                    <TableCell align="right">{group.total_points}</TableCell>
                    <TableCell align="right">{group.weekly_co2}</TableCell>
                    <TableCell align="right">{group.weekly_points}</TableCell>
                  </TableRow>
                ))}

              {/* if Group Members tab is selected, display all member data in table body*/}
              {selectedTab === tabs[1] &&
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
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      {page > 0 ? rowsPerPage * page + index + 1 : index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {member.name}
                    </TableCell>
                    <TableCell align="right">{member.total_co2}</TableCell>
                    <TableCell align="right">{member.total_points}</TableCell>
                    <TableCell align="right">{member.weekly_co2}</TableCell>
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
        {selectedTab === tabs[0] && groups && (
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
          />
        )}
        {selectedTab === tabs[1] && groupMembers && (
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
            <Typography variant="h2">Leaderboards</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" component="div">
                {selectedFilter.name}
              </Typography>
              <Tooltip title="Apply Filter">
                <IconButton onClick={handleClick}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
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
          <TabContext value={selectedTab}>
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
                <Tab label="Global Groups" value={tabs[0]} />
                <Tab label="Group Members" value={tabs[1]} />
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
