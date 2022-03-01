import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Drawer,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import { Menu, Group, Home, Assessment, Info } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const drawerWidth = 240;
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpenDrawer((openDrawer) => !openDrawer)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Commit2Act
          </Typography>
          <Avatar>A</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="persistant"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: drawerWidth } }}
      >
        <Divider />
        <List>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <IconButton>
                <Home />
                <Typography variant="subtitle1">Home</Typography>
              </IconButton>
            </ListItem>
          </NavLink>
          <NavLink to="/find-group" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <IconButton>
                <Group />
                <Typography variant="subtitle1">Find Group</Typography>
              </IconButton>
            </ListItem>
          </NavLink>
          <NavLink to="/report-action" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <IconButton>
                <Assessment />
                <Typography variant="subtitle1">Report Action</Typography>
              </IconButton>
            </ListItem>
          </NavLink>
          <NavLink to="/info" style={{ textDecoration: 'none' }}>
            <ListItem button>
              <IconButton>
                <Info />
                <Typography variant="subtitle1">Info</Typography>
              </IconButton>
            </ListItem>
          </NavLink>
        </List>
      </Drawer>
    </div>
  );
};

export default Navbar;
