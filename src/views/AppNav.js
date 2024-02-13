import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AdminPanelSettings, Close, ExitToApp, MoreHoriz } from '@mui/icons-material';
import { BaseComponent, LinkComponent } from '../prop-types/component';
import { usePageContainerStyles } from '../styles/page-container';
import { useUserInfoContext } from '../hooks/use-user-info-context';
import useTranslation from '../components/customHooks/translations';
import { PAGE_PATHS } from '../constants/page-paths';
import { Auth } from 'aws-amplify';
import { updateLoginState } from '../actions/loginActions';
import LanguageHandler from '../components/LanguageHandler';


const NavItemIcon = ({ name }) => (
  <ListItemIcon>
    <Box
      alt=""
      component="img"
      src={`./assets/images/icon-${name}.png`}
      width="1.75rem"
    />
  </ListItemIcon>
);

NavItemIcon.propTypes = {
  name: PropTypes.string.isRequired,
};

const NavItem = ({
  className = '',
  iconName = '',
  icon = null,
  label,
  to,
  onClick,
}) => (
  <ListItem sx={{ margin: 0, padding: 0 }}>
    <ListItemButton
      className={className}
      component={Link}
      onClick={onClick}
      to={to}
    >
      {icon && icon}
      {iconName && <NavItemIcon name={iconName} />}
      <ListItemText primary={label} />
    </ListItemButton>
  </ListItem>
);

NavItem.propTypes = {
  ...LinkComponent,
  iconName: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
};

export const mainNavItems = [
  { name: 'logAction', iconName: 'log', pathName: 'LOG_ACTION' },
  { name: 'dashboard', iconName: 'home', pathName: 'DASHBOARD' },
  { name: 'actions', iconName: 'validate', pathName: 'ACTIONS' },
  { name: 'myGroups', iconName: 'create-group', pathName: 'MY_GROUPS' },
  { name: 'findGroup', iconName: 'find', pathName: 'FIND_GROUP' },
  { name: 'createGroup', iconName: 'create-group', pathName: 'CREATE_GROUP' },
  {
    name: 'validateActions',
    iconName: 'validate',
    pathName: 'VALIDATE_ACTIONS',
  },
];

const mobileNavItems = [
  { name: 'home', iconName: 'home', pathName: 'DASHBOARD' },
  { name: 'actions', iconName: 'validate', pathName: 'ACTIONS' },
  { name: 'logActionMobile', iconName: 'plus', pathName: 'LOG_ACTION' },
  { name: 'groups', iconName: 'create-group', pathName: 'MY_GROUPS' },
];

const mobileDrawerItems = [
  { name: 'findGroup', iconName: 'find', pathName: 'FIND_GROUP' },
  { name: 'createGroup', iconName: 'create-group', pathName: 'CREATE_GROUP' },
  {
    name: 'validateActions',
    iconName: 'validate',
    pathName: 'VALIDATE_ACTIONS',
  },
];


export const AppNav = ({ handleMenuNavItem }) => {
  const [ menuEnabled, setMenuEnabled ] = useState(false);
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));
  const [loadingBackdrop, setLoadingBackdrop] = React.useState(false);
  const { userIsAdmin } = useUserInfoContext();
  const { classes } = usePageContainerStyles();
  const t = useTranslation();
  const navigate = useNavigate();
  const translation = useTranslation();

  const handleMoreMenu = () => {
    setMenuEnabled(!menuEnabled)
  };
  
  async function onSignOut() {
    updateLoginState('signIn');
    navigate('/');
    await Auth.signOut();
  }

  const handleLogout = async () => {
    setLoadingBackdrop(true);
    await new Promise((r) => setTimeout(r, 1000));
    await onSignOut();
    setLoadingBackdrop(false);
  };

  return (
    <>
    {!mobileView ?
      <List>
        {mainNavItems.map(({ name, iconName, pathName }) => (
          <NavItem
            className={classes[name]}
            iconName={iconName}
            key={name}
            label={t[name]}
            onClick={handleMenuNavItem}
            to={PAGE_PATHS[pathName]}
          />
        ))}
        <ListItem
          sx={{ padding: 0, margin: 0, display: 'block' }}
          aria-hidden="true"
          role="presentation"
        >
          <Divider />
        </ListItem>
        {userIsAdmin && (
          <NavItem
            label={t.adminDashboard}
            to={PAGE_PATHS.ADMIN_DASHBOARD}
            onClick={handleMenuNavItem}
            icon={
              <ListItemIcon>
                <AdminPanelSettings />
              </ListItemIcon>
            }
          />
        )}
        <NavItem
          label={t.myAccount}
          to={PAGE_PATHS.MY_ACCOUNT}
          onClick={handleMenuNavItem}
          iconName="my-account"
        />
      </List>
      :
      <>
        <List className={classes.mobileNav}>
          {mobileNavItems.map(({ name, iconName, pathName }) => (
            <NavItem
              className={classes[name]}
              iconName={iconName}
              key={name}
              label={t[name]}
              onClick={handleMenuNavItem}
              to={PAGE_PATHS[pathName]}
            />
          ))}
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="Toggle menu drawer"
              onClick={handleMoreMenu}
            >
              <MoreHoriz />
              <span>More</span>
            </IconButton>
        </List>
        <Drawer
          anchor={'right'}
          open={menuEnabled}
          onClose={handleMoreMenu}
          ModalProps={{
            keepMounted: true,
          }}
          >
            <div className={classes.moreDrawer}>
              <IconButton
                className={classes.drawerClose}
                onClick={handleMoreMenu}
                size='large'
              >
                <Close />
              </IconButton>
              <List>
                {mobileDrawerItems.map(({ name, pathName }) => (
                  <NavItem
                    className={classes[name]}
                    key={name}
                    label={t[name]}
                    onClick={ () => { handleMenuNavItem(); handleMoreMenu();} }
                    to={PAGE_PATHS[pathName]}
                  />
                ))}
              </List>
              <label htmlFor="language" className={classes.languageLabel}>
                {translation.changeLanguage}
              </label>
              <LanguageHandler />
              <MenuItem className={classes.logOut} onClick={handleLogout}>
                <span>{translation.logout}</span>
                <ExitToApp/>
              </MenuItem>
            </div>
        </Drawer>
      </>
    }
    </>
  );
};

AppNav.propTypes = {
  ...BaseComponent,
  handleMenuNavItem: PropTypes.func,
};
