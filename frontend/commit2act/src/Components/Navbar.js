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
  ListItemText,
  ListItem,
} from '@mui/material';
import { Menu } from '@mui/icons-material';

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
          {['Home', 'Find Groups', 'Report Actions', 'Info'].map(
            (text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text}></ListItemText>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default Navbar;
