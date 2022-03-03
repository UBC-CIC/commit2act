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
import {
  Menu,
  Group,
  Home,
  Assessment,
  Info,
  ChevronLeft,
  ExpandLess,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider, styled } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: 'black',
            fontWeight: 100,
          },
        },
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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const StyledNavLink = styled(NavLink)({
  textDecoration: 'none',
});

const Navbar = () => {
  const drawerWidth = useMediaQuery('(min-width:600px') ? 240 : '100%';
  const drawerAnchor = useMediaQuery('(min-width:600px') ? 'left' : 'top';
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky">
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
          <Typography variant="h2" color="inherit" component="div">
            Commit2Act
          </Typography>
          <Avatar>A</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={drawerAnchor}
        variant="persistent"
        open={openDrawer}
        PaperProps={{
          sx: { width: drawerWidth },
        }}
      >
        <DrawerHeader>
          <IconButton
            onClick={() => setOpenDrawer(false)}
            sx={{ paddingRight: '20px' }}
          >
            {drawerAnchor === 'left' ? <ChevronLeft /> : <ExpandLess />}
          </IconButton>
        </DrawerHeader>
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
