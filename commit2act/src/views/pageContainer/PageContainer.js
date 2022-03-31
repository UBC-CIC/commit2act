import React, { useEffect, useState } from 'react';
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
  Assessment,
  Home,
  Group,
  AccountCircle,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import { Info as InfoIcon } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import { connect } from 'react-redux';
import { updateMenuState } from '../../actions/menuActions';
import Landing from '../../pages/Landing';
import FindGroup from '../../pages/FindGroup';
import Info from '../../pages/Info';
import AccountSettings from '../../pages/AccountSettings';
import SelfReportMenu from '../../components/SelfReportMenu';
import ValidateActions from '../../pages/ValidateActions';
import { Auth } from 'aws-amplify';
import CreateGroup from '../../pages/CreateGroup';
import GroupProfile from '../../pages/GroupProfile';
import { API } from 'aws-amplify';
import { getSingleUserByUsername } from '../../graphql/queries';

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
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
    padding: theme.spacing(8),
  },
}));

function PageContainer(props) {
  const { menuEnabled, updateMenuState } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  // const [userType, setUserType] = useState();
  const [user, setUser] = useState();

  const getUserInfo = async () => {
    const user = await Auth.currentAuthenticatedUser();
    const id = user.attributes['custom:id'];
    //if theres no userId attribute in cognito already (user is logging in for first time), call getUserId() function
    if (!id) {
      getUserId(user);
    } else {
      setUser(user.attributes);
    }
  };

  //gets user_id from database
  const getUserId = async (user) => {
    const username = user.attributes.preferred_username;
    const userInfo = await API.graphql({
      query: getSingleUserByUsername,
      variables: { username: username },
    });

    const id = userInfo.data.getSingleUserByUsername.user_id;
    updateUserId(id, user);
  };

  //updates the cognito user_id custom attribute
  const updateUserId = async (id, user) => {
    const idString = id.toString();
    await Auth.updateUserAttributes(user, {
      'custom:id': idString,
    });
    setUser(user.attributes);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // const getUserType = async () => {
  //   const user = await Auth.currentUserInfo();
  //   const type = user.attributes['custom:user_type'];
  //   setUserType(type);
  // };

  // useEffect(() => {
  //   getUserType();
  // }, []);

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
          key={'logAction'}
          onClick={() => navigate('/log-action')}
        >
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary={'Log Action'} />
        </ListItem>

        <ListItem
          button
          key={'validateActions'}
          onClick={() => navigate('/validate-actions')}
        >
          <ListItemIcon>
            <AssignmentTurnedIn />
          </ListItemIcon>
          <ListItemText primary={'Validate Actions'} />
        </ListItem>

        <ListItem button key={'info'} onClick={() => navigate('/info')}>
          <ListItemIcon>
            <InfoIcon />
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
            <Route exact path={'/'} element={<Landing />} />
            <Route exact path={'/find-group'} element={<FindGroup />} />
            <Route exact path={'/log-action'} element={<SelfReportMenu />} />
            <Route exact path={'/info'} element={<Info />} />
            <Route exact path={'/create-group'} element={<CreateGroup />} />
            <Route
              path="/group-profile/:groupName"
              element={<GroupProfile />}
            />

            <Route
              exact
              path={'/validate-actions'}
              element={<ValidateActions />}
            />
            <Route
              exact
              path={'/account-settings'}
              element={<AccountSettings user={user} />}
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
