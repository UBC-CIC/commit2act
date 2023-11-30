import React, { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Grid,
  CircularProgress,
  Backdrop,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { ExitToApp, More } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Auth } from 'aws-amplify';
import { connect } from 'react-redux';
import { updateLoginState } from '../actions/loginActions';
import { updateMenuState } from '../actions/menuActions';
import LanguageHandler from './LanguageHandler';
import useTranslation from './customHooks/translations';

const useStyles = makeStyles()((theme) => {
  return {
    grow: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      position: 'sticky',
      top: '0',
    },
    topBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: '#262a2c',
      boxShadow: 'none',
    },
    languageLabel: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'inline',
      },
    },
    menuButton: {
      color: '#fff',
      background: '#000',
      marginRight: 5,
      [theme.breakpoints.up('sm')]: {
        marginRight: 22,
      },
    },
    title: {
      fontSize: '1.1em',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
        fontSize: '1.25em',
      },
    },
    avatar: {
      background: 'linear-gradient(274.34deg, #33AF99 6.31%, #56C573 77.35%)',
    },
    logo: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      paddingLeft: '15px',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: 'pink',
    },
    logOut: {
      color: '#ff8512',
    },
  };
});

function Navbar(props) {
  const {
    updateLoginState,
    updateMenuState,
    loginState,
    menuEnabled,
    showSideMenuButton,
  } = props;

  const { classes } = useStyles();

  const navigate = useNavigate();
  const translation = useTranslation();

  const [user, setUser] = useState('');
  const [loadingBackdrop, setLoadingBackdrop] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    navigate('/account-settings');
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    setLoadingBackdrop(true);
    handleMenuClose();
    await new Promise((r) => setTimeout(r, 1000));
    await onSignOut();
    setLoadingBackdrop(false);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem className={classes.logOut} onClick={handleLogout}>
        <span>{translation.logout} </span>
        <ExitToApp color={'error'} />
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem disabled>
        <Avatar>{user.charAt(0).toUpperCase()}</Avatar>
      </MenuItem>
      <MenuItem className={classes.logOut} onClick={handleLogout}>
        <span>{translation.logout} </span>
        <ExitToApp color={'error'} />
      </MenuItem>
    </Menu>
  );

  useEffect(() => {
    async function retrieveUser() {
      try {
        const returnedUser = await Auth.currentAuthenticatedUser();
        setUser(returnedUser.attributes.email);
      } catch (e) {}
    }
    retrieveUser();
  }, [loginState]);

  const handleSideMenu = () => {
    updateMenuState(!menuEnabled);
  };

  async function onSignOut() {
    updateLoginState('signIn');
    navigate('/');
    await Auth.signOut();
  }

  return (
    <Grid item xs={12} className={classes.appBar}>
      <AppBar position="static" className={classes.topBar}>
        <Toolbar>
          {showSideMenuButton ? (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Toggle menu drawer"
              onClick={handleSideMenu}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Box
            component="img"
            sx={{
              height: 36,
              width: 36,
              marginRight: 1,
            }}
            alt=""
            src={`${process.env.PUBLIC_URL}/icon-192x192.png`}
          />

          <Typography
            className={classes.title}
            variant="h6"
            component={'span'}
            noWrap
          >
            Commit2Act
          </Typography>

          <div className={classes.grow} />
          <div>
            <label htmlFor="language" className={classes.languageLabel}>
              {translation.changeLanguage}
            </label>
            <LanguageHandler />
          </div>
          <div className={classes.sectionDesktop}>
            <MenuItem className={classes.logOut} onClick={handleLogout}>
              <span>{translation.logout} </span>
              <ExitToApp color={'error'} />
            </MenuItem>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar className={classes.avatar}>
                {user.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <More />
            </IconButton>
            {renderMobileMenu}
          </div>
        </Toolbar>
      </AppBar>
      <Backdrop className={classes.backdrop} open={loadingBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    loginState: state.loginState.currentState,
    menuEnabled: state.appState.showSideBar,
  };
};

const mapDispatchToProps = {
  updateLoginState,
  updateMenuState,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
