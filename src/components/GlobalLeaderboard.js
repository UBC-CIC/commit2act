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
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { getAllGroups, getAllUsers } from '../graphql/queries';
import { API } from 'aws-amplify';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

const StyledTableBody = styled(TableBody)`
  .currentGroupOrUser {
    background-color: #f6f6f6;
  }
`;

const GlobalLeaderboard = () => {
  const tabs = ['Global Groups', 'Global Users'];
  const filters = [
    { name: 'Total CO2 Saved', property: 'total_co2' },
    { name: 'Weekly CO2 Saved', property: 'weekly_co2' },
    { name: 'Total Points', property: 'total_points' },
    { name: 'Weekly Points', property: 'weekly_points' },
  ];
  const [groups, setGroups] = useState();
  const [users, setUsers] = useState();
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [filteredGroups, setFilteredGroups] = useState();
  const [filteredUsers, setFilteredUsers] = useState();
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

  // avoid a layout jump in the table when reaching the last page with empty rows
  let emptyRows =
    page <= 0
      ? 0
      : selectedTab === tabs[0]
      ? Math.max(0, (1 + page) * rowsPerPage - groups.length)
      : selectedTab === tabs[1]
      ? Math.max(0, (1 + page) * rowsPerPage - users.length)
      : 0;

  useEffect(() => {
    const getTableData = async () => {
      const [userRes, groupRes] = await Promise.all([
        API.graphql({ query: getAllUsers }),
        API.graphql({ query: getAllGroups }),
      ]);
      setUsers(userRes.data.getAllUsers);
      setGroups(groupRes.data.getAllGroups);
    };

    getTableData();
  }, []);

  //filters groups when group state is initially set, filters groups and group members every time a new filter is selected
  useEffect(() => {
    if (groups && users) {
      handleFilterSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups, users, selectedFilter]);

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
    if (selectedTab === tabs[1] && users) {
      //make a mutable copy of the users array, sort that array and update the in state version of users
      let usersArrayCopy = [...users];
      let sortedByFilter = usersArrayCopy.sort(
        (a, b) => b[propertySelected] - a[propertySelected]
      );
      setFilteredUsers(sortedByFilter);
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

  /** function for displaying the leaderboard tables */

  const renderTable = () => {
    return (
      <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: { xs: '2em', sm: '0' },
          }}
        ></Box>
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

              {/* if Global Users tab is selected, display all user data in table body*/}
              {selectedTab === tabs[1] &&
                filteredUsers &&
                (rowsPerPage > 0
                  ? filteredUsers.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredUsers
                ).map((user, index) => (
                  <TableRow
                    key={user.user_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      {page > 0 ? rowsPerPage * page + index + 1 : index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell align="right">{user.total_co2}</TableCell>
                    <TableCell align="right">{user.total_points}</TableCell>
                    <TableCell align="right">{user.weekly_co2}</TableCell>
                    <TableCell align="right">{user.weekly_points}</TableCell>
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
        {selectedTab === tabs[1] && users && (
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={users.length}
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
                <Tab label={tabs[0]} value={tabs[0]} />
                <Tab label={tabs[1]} value={tabs[1]} />
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

export default GlobalLeaderboard;
