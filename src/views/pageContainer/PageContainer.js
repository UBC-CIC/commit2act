import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Drawer,
  Toolbar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
} from '@mui/material';
import { AdminPanelSettings } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from 'tss-react/mui';
import { API, Auth } from 'aws-amplify';
import Navbar from '../../components/Navbar';
import { updateMenuState } from '../../actions/menuActions';
import { getSingleUserByEmail } from '../../graphql/queries';
import { createUser } from '../../graphql/mutations';

import useTranslation from '../../components/customHooks/translations';
import { AppRoutes } from '../AppRoutes';

const drawerWidth = 312;

const useStyles = makeStyles()((theme) => {
  return {
    menuClosed: {
      pointerEvents: 'none',
    },
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
      },
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
      maxWidth: '100%',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      maxWidth: '100%',
      [theme.breakpoints.up('md')]: {
        maxWidth: '70%',
      },
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
        filter: 'invert(1)',
      },
    },
    skip_button: {
      position: 'absolute',
      background: '#fff',
      color: '#262a2c',
      textDecoration: 'none',
      borderRadius: '0.25em',
      padding: '0.5em 1em',
      margin: '0.25em',
      transform: 'translateY(-150%)',
      transition: 'transform 0.3s',
      '&:focus': {
        transform: 'translateY(0%)',
        zIndex: '2000',
      },
    },
  };
});

function PageContainer(props) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));
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
    if (firstLogin !== 'false') {
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

  const handleMenuNavItem = (toPath = null) => {
    if (mobileView) updateMenuState(!menuEnabled);
    if (toPath) navigate(toPath);
  };

  useEffect(() => {
    if (mobileView) {
      handleMenuNavItem();
    }
  }, [mobileView]);

  const list = () => (
    <div className={classes.drawerContainer}>
      <List>
        <ListItemButton
          key="logAction"
          className={classes.logAction}
          component={Link}
          onClick={handleMenuNavItem}
          to="/log-action"
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-log.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.logAction} />
        </ListItemButton>
        <ListItemButton key={'home'} onClick={() => handleMenuNavItem('/')}>
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-home.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.dashboard} />
        </ListItemButton>
        <ListItem
          button
          key={'Actions'}
          onClick={() => handleMenuNavItem('/actions')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-validate.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.actions} />
        </ListItem>
        <ListItem
          button
          key={'mygroups'}
          onClick={() => handleMenuNavItem('/my-groups')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-create-group.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.myGroups} />
        </ListItem>
        <ListItem
          button
          key={'findGroup'}
          onClick={() => handleMenuNavItem('/find-group')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-find.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.findGroup} />
        </ListItem>

        <ListItem
          button
          key={'createGroup'}
          onClick={() => handleMenuNavItem('/create-group')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-create-group.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.createGroup} />
        </ListItem>

        <ListItem
          button
          key={'validateActions'}
          onClick={() => handleMenuNavItem('/validate-actions')}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-validate.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.validateActions} />
        </ListItem>

        {userType === 'Admin' && (
          <>
            <ListItem
              button
              key={'adminDashboard'}
              onClick={() => handleMenuNavItem('/admin-dashboard')}
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
          onClick={() => handleMenuNavItem(`/account-settings`)}
        >
          <ListItemIcon>
            <Box
              component="img"
              sx={{
                width: 28,
              }}
              alt=""
              src="./assets/images/icon-my-account.png"
            />
          </ListItemIcon>
          <ListItemText primary={translation.myAccount} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Grid container direction="column">
      <a className={classes.skip_button} href="#main">
        Skip to Content
      </a>
      {/* Navbar component, set side menu button parameter -->
        button updates redux state to show/hide left sidebar */}
      <Navbar showSideMenuButton={true} sx={{ position: 'sticky' }} />
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
          className={clsx(classes.drawer, {
            [classes.menuClosed]: !menuEnabled,
          })}
        >
          <Toolbar />
          {/* Side menu items added for rendering */}
          {list()}
        </Drawer>
        <main
          id="main"
          className={clsx(classes.content, {
            [classes.contentShift]: menuEnabled,
          })}
        >
          <AppRoutes user={user} userType={userType} setUser={setUser} />
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
