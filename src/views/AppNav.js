import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
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

export const AppNav = ({ handleMenuNavItem }) => {
  const { userIsAdmin } = useUserInfoContext();
  const { classes } = usePageContainerStyles();
  const t = useTranslation();

  return (
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
  );
};
