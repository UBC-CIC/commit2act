import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Info,
  Assessment,
  Home,
  Group,
  AccountCircle,
} from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import { connect } from 'react-redux';
import { updateMenuState } from '../../actions/menuActions';
import LandingPage from '../../pages/LandingPage';
import FindGroupPage from '../../pages/FindGroupPage';
import InfoPage from '../../pages/InfoPage';
import AccountSettingsPage from '../../pages/AccountSettingsPage';
import SelfReportMenu from '../../components/SelfReportMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  drawerPaper: {
    width: 240,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function PageContainer(props) {
  const { menuEnabled, updateMenuState } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  /*
   * Handles closing side menu if an event occurs
   * */
  const handleSideMenuClose = () => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    updateMenuState(false);
  };

  //   {
  //     /* Example side menu is provided below */
  //   }
  const list = () => (
    <div
      className={classes.drawerContainer}
      onClick={handleSideMenuClose(false)}
      onKeyDown={handleSideMenuClose(false)}
    >
      <List>
        <ListItem button key={'home'} onClick={() => navigate('/')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItem>
        <ListItem
          button
          key={'findGroup'}
          onClick={() => navigate('/find-group')}
        >
          <ListItemIcon>
            <Group />
          </ListItemIcon>
          <ListItemText primary={'Find Group'} />
        </ListItem>
        <ListItem
          button
          key={'reportAction'}
          onClick={() => navigate('/report-action')}
        >
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary={'Report Action'} />
        </ListItem>
        <ListItem button key={'info'} onClick={() => navigate('/info')}>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary={'Info'} />
        </ListItem>
        <Divider />
        <ListItem
          button
          key={'myAccount'}
          onClick={() => navigate('/account-settings')}
        >
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={'My Account'} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Grid container direction="column">
      {/* Navbar component, set side menu button parameter -->
        button updates redux state to show/hide left sidebar */}
      <Navbar showSideMenuButton={true} />
      {/* App content example below with sidebar */}
      <Grid item xs={12} className="App-header">
        {/* Side menu component */}
        <Drawer
          anchor={'left'}
          open={menuEnabled}
          onClose={handleSideMenuClose}
          style={{ zIndex: 0 }}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{ onBackdropClick: handleSideMenuClose() }}
        >
          <Toolbar />
          {/* Side menu items added for rendering */}
          {list()}
        </Drawer>
        <main className={classes.content}>
          {/* Routes are added here if you need multiple page views. otherwise this Switch can be deleted and replaced
                with your app's contents */}

          <Routes>
            <Route exact path={'/'} element={<LandingPage />} />
            <Route exact path={'/find-group'} element={<FindGroupPage />} />
            <Route exact path={'/report-action'} element={<SelfReportMenu />} />
            <Route exact path="/info" element={<InfoPage />} />
            <Route
              exact
              path="/account-settings"
              element={<AccountSettingsPage />}
            />
          </Routes>
        </main>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    menuEnabled: state.appState.showSideBar,
  };
};

const mapDispatchToProps = {
  updateMenuState,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer);
