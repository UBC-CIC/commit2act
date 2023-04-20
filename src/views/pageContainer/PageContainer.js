import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
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
  Box
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
import { makeStyles } from 'tss-react/mui';
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
import { API, Auth, autoShowTooltip } from 'aws-amplify';
import { getSingleUserByEmail } from '../../graphql/queries';
import { createUser } from '../../graphql/mutations';
import PrivateRoute from './PrivateRoute';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


import useTranslation from '../../components/customHooks/translations';
const drawerWidth = 312;

const useStyles = makeStyles()((theme) => {
  return {
    drawerContainer: {
      overflow: 'auto',
      backgroundColor: '#303839',
      height: '100%',
      width: drawerWidth,
      '& .MuiListItem-button': {
        paddingTop: 16,
        paddingBottom: 16,
      },
      '& svg': {
        fontSize: 30,
      }
    },
    content: {
      flexGrow: 1,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
      },
      padding: theme.spacing(8),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    logAction: {
      background: 'linear-gradient(274.34deg, #33AF99 6.31%, #56C573 77.35%)',
      marginBottom: 10,
      marginTop: 5,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 5,
      width: 'auto',
      '& span': {
        color: '#000',
        fontWeight: 500,
      },
      '& img': {
        fontSize: 30,
        color: '#000',
        filter: 'invert(1)'
      },
    }
  };
});


function PageContainer (props) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { menuEnabled, updateMenuState } = props;

  const { classes } = useStyles();

  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userType, setUserType] = useState();

  const translation = useTranslation();

  //gets currently authenticated cognito user
  const getCognitoUser = async () => {
    const cognitoUserEntry = await Auth.currentAuthenticatedUser();
    //on user's first login, create user entry in database, then update custom firstLogin attribute to false
    const firstLogin = cognitoUserEntry.attributes['custom:firstLogin'];
    if (firstLogin !== "false") {
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
    const email = cognitoUserEntry.attributes.email;
    const res = await API.graphql({
      query: getSingleUserByEmail,
      variables: { email: email },
    });
    const databaseUserEntry = res.data.getSingleUserByEmail;

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

  const handleSideMenu = () => {
    updateMenuState(!menuEnabled);
  };

  useEffect(() => {
    if (mobileView) {
      handleSideMenu();
    }
  }, [mobileView]);

  const handleChangePage = (event, newPage) => {
    handleSideMenu();
  }; 
  //   {
  //     /* Example side menu is provided below */
  //   }
  const list = () => (
    <div
      className={classes.drawerContainer}
      // onClick={handleSideMenuClose(false)}
      // onKeyDown={handleSideMenuClose(false)}
    >
      <List>
        <ListItem
          button
          key={'logAction'}
          onClick={() => navigate('/log-action')}
          className={classes.logAction}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-log.png' />
          </ListItemIcon>
          <ListItemText primary={translation.logAction} />
        </ListItem>
        <ListItem button key={'home'} onClick={() => navigate('/')}>
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-home.png' />
          </ListItemIcon>
          <ListItemText primary={translation.dashboard} />
        </ListItem>
        <ListItem
          button
          key={'findGroup'}
          onClick={() => navigate('/find-group')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-find.png' />
          </ListItemIcon>
          <ListItemText primary={translation.findGroup} />
        </ListItem>

        <ListItem
          button
          key={'createGroup'}
          onClick={() => navigate('/create-group')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-create-group.png' />
          </ListItemIcon>
          <ListItemText primary={translation.createGroup} />
        </ListItem>

        <ListItem
          button
          key={'validateActions'}
          onClick={() => navigate('/validate-actions')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-validate.png' />
          </ListItemIcon>
          <ListItemText primary={translation.validateActions} />
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
              <ListItemText primary={translation.adminDashboard} />
            </ListItem>
          </>
        )}
        <Divider
          sx={{
            margin: '15px 0',
          }}
        />
        <ListItem
          button
          key={'myAccount'}
          onClick={() => navigate(`/account-settings`)}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src='./assets/images/icon-my-account.png' />
          </ListItemIcon>
          <ListItemText primary={translation.myAccount} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Grid container direction="column">
      {/* Navbar component, set side menu button parameter -->
        button updates redux state to show/hide left sidebar */}
      <Navbar showSideMenuButton={true} 
      sx={{ position: 'sticky' }} 
      />
      {/* App content example below with sidebar */}
      <Grid item xs={12} className="App-header">
        {/* Side menu component */}
        <Drawer
          anchor={'left'}
          open={menuEnabled}
          // onClose={handleSideMenuClose}
          variant="persistent"
          style={{ zIndex: 2 }}
          sx={{
            width: 312,
            color: 'success.main',
          }}
        >
          <Toolbar />
          {/* Side menu items added for rendering */}
          {list()}
        </Drawer>
        <main className={clsx(classes.content, {
          [classes.contentShift]: menuEnabled,
        })}>
          {/* Routes are added here if you need multiple page views. otherwise this Switch can be deleted and replaced
                with your app's contents */}

          <Routes>
            <Route
              exact
              path={'/log-action'}
              element={<SelfReportMenu user={user} />}
            />
            <Route
              exact
              path={'/'}
              element={<Landing user={user} userType={userType} />}
            />
            <Route
              exact
              path={'/find-group'}
              element={<FindGroup user={user} />}
            />
            <Route
              exact
              path={'/create-group'}
              element={<CreateGroup user={user} />}
            />
            <Route
              path="/group-profile/:groupName"
              element={<GroupProfile user={user} />}
            />
            <Route
              path="/group-profile/:groupName/add/:addUserLink"
              element={<PrivateRoute Component={JoinGroup} user={user} />}
            />
            <Route
              exact
              path={'/validate-actions'}
              element={<ValidateActions user={user} userType={userType} />}
            />
            {userType === 'Admin' && (
              <Route exact path={'/create-action'} element={<CreateAction />} />
            )}
            <Route
              exact
              path={'/account-settings'}
              element={
                <AccountSettings
                  databaseUser={user}
                  setUser={setUser}
                  userType={userType}
                />
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
