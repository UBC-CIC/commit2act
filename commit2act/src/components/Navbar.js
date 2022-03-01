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
import { createTheme, ThemeProvider, styled } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: 15,
            color: 'black',
            paddingLeft: 5,
          },
        },
      ],
    },
  },
});

const StyledNavLink = styled(NavLink)({
  textDecoration: 'none',
});

const Navbar = () => {
  const drawerWidth = 240;
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <ThemeProvider theme={theme}>
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
          <StyledNavLink to="/">
            <ListItem button>
              <IconButton>
                <Home />
                <Typography variant="subtitle1">Home</Typography>
              </IconButton>
            </ListItem>
          </StyledNavLink>
          <StyledNavLink to="/find-group">
            <ListItem button>
              <IconButton>
                <Group />
                <Typography variant="subtitle1">Find Group</Typography>
              </IconButton>
            </ListItem>
          </StyledNavLink>
          <StyledNavLink to="/report-action">
            <ListItem button>
              <IconButton>
                <Assessment />
                <Typography variant="subtitle1">Report Action</Typography>
              </IconButton>
            </ListItem>
          </StyledNavLink>
          <StyledNavLink to="/info">
            <ListItem button>
              <IconButton>
                <Info />
                <Typography variant="subtitle1">Info</Typography>
              </IconButton>
            </ListItem>
          </StyledNavLink>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;
