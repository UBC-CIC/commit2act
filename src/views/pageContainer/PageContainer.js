import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Drawer, Toolbar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { API, Auth } from 'aws-amplify';
import { BaseComponent } from '../../prop-types/component';
import { UserInfoContext } from '../../hooks/use-user-info-context';
import { updateMenuState } from '../../actions/menuActions';
import { getSingleUserByEmail } from '../../graphql/queries';
import { createUser } from '../../graphql/mutations';
import { usePageContainerStyles } from '../../styles/page-container';
import Navbar from '../../components/Navbar';
import { AppRoutes } from '../AppRoutes';
import { AppNav } from '../AppNav';

function PageContainer(props) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));
  const { menuEnabled, updateMenuState } = props;

  const { classes } = usePageContainerStyles();

  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userType, setUserType] = useState();

  const userIsAdmin = userType === 'Admin';

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

  // This combination of menu state overrides and useEffect is causing trouble
  // when a useCallback method is implemented. This needs to be sorted out, as
  // overriding the menu's open/closed state based on screen size will prevent
  // the user's menu button action from doing anything.
  const handleMenuNavItem = (toPath = null) => {
    if (mobileView) updateMenuState(!menuEnabled);
    if (toPath) navigate(toPath);
  };

  useEffect(() => {
    if (mobileView) {
      handleMenuNavItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileView]);

  return (
    <UserInfoContext.Provider
      value={{
        user,
        userType,
        userIsAdmin,
        setUser,
      }}
    >
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
            <AppNav handleMenuNavItem={handleMenuNavItem} />
          </Drawer>
          <main
            id="main"
            className={clsx(classes.content, {
              [classes.contentShift]: menuEnabled,
            })}
          >
            <AppRoutes />
          </main>
        </Grid>
      </Grid>
    </UserInfoContext.Provider>
  );
}

PageContainer.propTypes = {
  ...BaseComponent,
  menuEnabled: PropTypes.bool,
  updateMenuState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    menuEnabled: state.appState.showSideBar,
  };
};

const mapDispatchToProps = {
  updateMenuState,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer);
