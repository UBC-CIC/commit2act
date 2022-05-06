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
  Tabs,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { getAllGroups } from '../graphql/queries';
import { API } from 'aws-amplify';
import FilterListIcon from '@mui/icons-material/FilterList';

const Leaderboard = () => {
  const [groups, setGroups] = useState();
  const [selectedTab, setSelectedTab] = useState('0');
  const [filteredGroups, setFilteredGroups] = useState();
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  const filters = [
    { name: 'Total CO2 Saved', property: 'total_co2' },
    { name: 'Weekly CO2 Saved', property: 'weekly_co2' },
    { name: 'Total Points', property: 'total_points' },
    { name: 'Weekly Points', property: 'weekly_points' },
  ];

  useEffect(() => {
    const getGroups = async () => {
      const res = await API.graphql({
        query: getAllGroups,
      });
      setGroups(res.data.getAllGroups);
    };
    getGroups();
  }, []);

  useEffect(() => {
    if (groups) {
      handleFilterSelection(filters[0]);
    }
  }, groups);

  const handleTabChange = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFilterSelection = (filter) => {
    const propertySelected = filter.property;
    const sortedByFilter = groups.sort(
      (a, b) => b[propertySelected] - a[propertySelected]
    );
    setFilteredGroups(sortedByFilter);
  };

  const handleClick = (e) => {
    setFilterMenuAnchor(e.currentTarget);
    setOpenFilterMenu(true);
  };

  const handleClose = () => {
    setFilterMenuAnchor(null);
    setOpenFilterMenu(false);
  };

  const renderGroupTable = () => {
    return (
      <>
        <Tooltip title="Filter list">
          <IconButton onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="filter-menu"
          open={openFilterMenu}
          anchorEl={filterMenuAnchor}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {filters.map((filter, index) => (
            <MenuItem key={index} onClick={() => handleFilterSelection(filter)}>
              {filter.name}
            </MenuItem>
          ))}
        </Menu>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="group leaderboard">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell align="right">Group Name</TableCell>
                <TableCell align="right">Total CO2</TableCell>
                <TableCell align="right">Total Points</TableCell>
                <TableCell align="right">Weekly CO2</TableCell>
                <TableCell align="right">Weekly Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGroups &&
                filteredGroups.map((group, index) => (
                  <TableRow
                    key={group.group_id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
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
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={groups.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </>
    );
  };

  return (
    <>
      {groups && (
        <Box sx={{ mt: '2.5em' }}>
          <Typography variant="h2" sx={{ mb: '1em' }}>
            Leaderboard
          </Typography>
          <TabContext value={selectedTab}>
            <Box
              sx={{
                borderTop: 1,
                borderColor: 'divider',
                width: '100%',
                display: 'flex',
                padding: '0.5em',
              }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="Leaderboard tab options"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Global Groups" value="0" />
                <Tab label="Group Members" value="1" />
              </Tabs>
              <TabPanel value="0" sx={{ width: '100%' }}>
                {renderGroupTable()}
              </TabPanel>
              <TabPanel value="1">Item Two</TabPanel>
              <TabPanel value="2">Item Three</TabPanel>
            </Box>
          </TabContext>
        </Box>
      )}
    </>
  );
};

export default Leaderboard;
