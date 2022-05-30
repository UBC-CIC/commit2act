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
  AdminPanelSettings,
  Create,
} from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import { connect } from 'react-redux';
import { updateMenuState } from '../../actions/menuActions';
import Landing from '../../pages/Landing';
import FindGroup from '../../pages/FindGroup';
import AccountSettings from '../../pages/AccountSettings';
import SelfReportMenu from '../../pages/SelfReportMenu';
import ValidateActions from '../../pages/ValidateActions';
import CreateGroup from '../../pages/CreateGroup';
import GroupProfile from '../../pages/GroupProfile';
import CreateAction from '../../pages/CreateAction';
import JoinGroup from '../../pages/JoinGroup';
import UserProfile from '../../pages/UserProfile';
import AdminDashboard from '../../pages/AdminDashboard';
import { API, Auth } from 'aws-amplify';
import { getSingleUserByUsername } from '../../graphql/queries';
import { createUser } from '../../graphql/mutations';

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
  const [user, setUser] = useState();
  const [userType, setUserType] = useState();

  //gets currently authenticated cognito user
  const getCognitoUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    //on user's first login, create user entry in database, then update custom firstLogin attribute to false
    const firstLogin = cognitoUserEntry.attributes['custom:firstLogin'];
    if (firstLogin === 'true') {
      await API.graphql({
        query: createUser,
        variables: {
          name: cognitoUserEntry.attributes.name,
          username: cognitoUserEntry.attributes.preferred_username,
          email: cognitoUserEntry.attributes.email,
        },
      });
      await Auth.updateUserAttributes(cognitoUserEntry, {
        'custom:firstLogin': 'false',
      });
    }
    const id = cognitoUserEntry.attributes['custom:id'];
    const type = cognitoUserEntry.attributes['custom:type'];
    setUserType(type);
    getUserInfo(cognitoUserEntry, id);
  };

  //gets database entry for cognito user
  const getUserInfo = async (cognitoUserEntry, id) => {
    const username = cognitoUserEntry.attributes.preferred_username;
    const res = await API.graphql({
      query: getSingleUserByUsername,
      variables: { username: username },
    });
    const databaseUserEntry = res.data.getSingleUserByUsername;

    //if the cognito user has no id attribute (first time logging in), set the id attribute to the user_id field from the database entry
    if (!id) {
      const idString = databaseUserEntry.user_id.toString();
      await Auth.updateUserAttributes(cognitoUserEntry, {
        'custom:id': idString,
      });
    }
    setUser(databaseUserEntry);
  };

  useEffect(() => {
    getCognitoUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          key={'createGroup'}
          onClick={() => navigate('/create-group')}
        >
          <ListItemIcon>
            <Create />
          </ListItemIcon>
          <ListItemText primary={'Create Group'} />
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

        {userType === 'Admin' && (
          <>
            <ListItem
              button
              key={'adminDashboard'}
              onClick={() => navigate('/admin-dashboard')}
            >
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
              <ListItemText primary={'Admin Dashboard'} />
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem
          button
          key={'myAccount'}
          onClick={() => navigate(`/account-settings`)}
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
          style={{ zIndex: 2 }}
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
            <Route exact path={'/'} element={<Landing user={user} />} />
            <Route exact path={'/find-group'} element={<FindGroup />} />
            <Route
              exact
              path={'/log-action'}
              element={<SelfReportMenu user={user} />}
            />
            <Route
              exact
              path={'/create-group'}
              element={<CreateGroup user={user} />}
            />
            <Route
              path="/group-profile/:groupName"
              element={<GroupProfile />}
            />
            <Route
              path="/group-profile/:groupName/add/:addUserLink"
              element={<JoinGroup />}
            />
            <Route
              exact
              path={'/validate-actions'}
              element={<ValidateActions />}
            />
            {userType === 'Admin' && (
              <Route exact path={'/create-action'} element={<CreateAction />} />
            )}
            <Route
              exact
              path={'/account-settings'}
              element={
                <AccountSettings databaseUser={user} setUser={setUser} />
              }
            />
            <Route
              exact
              path={'/user-profile/:userId'}
              element={<UserProfile />}
            />
            <Route
              exact
              path={'/admin-dashboard'}
              element={<AdminDashboard />}
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
