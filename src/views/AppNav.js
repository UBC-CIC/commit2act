import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AdminPanelSettings } from '@mui/icons-material';
import { usePageContainerStyles } from '../styles/page-container';
import { useUserInfoContext } from '../hooks/use-user-info-context';
import useTranslation from '../components/customHooks/translations';
import { PAGE_PATHS } from '../constants/page-paths';

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

const NavItem = ({
  className = '',
  iconName = '',
  icon = null,
  label,
  to,
  onClick,
}) => (
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
);

const mainNavItems = [
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
  { name: 'dashboard', iconName: 'home', pathName: 'DASHBOARD' },
  { name: 'actions', iconName: 'validate', pathName: 'ACTIONS' },
  { name: 'logActionMobile', iconName: 'log', pathName: 'LOG_ACTION' },
  { name: 'myGroups', iconName: 'create-group', pathName: 'MY_GROUPS' },
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
  const { menuEnabled, updateMenuState } = useState();
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('md'));
  const { userIsAdmin } = useUserInfoContext();
  const { classes } = usePageContainerStyles();
  const t = useTranslation();

  const handleSideMenu = () => {
    updateMenuState(!menuEnabled);
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
        <Divider />
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
              onClick={handleSideMenu}
            >
              More
            </IconButton>
        </List>
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
        </Drawer>
      </>
    }
    </>
  );
};
