const LOG_ACTION = '/log-action';
const GROUP_PROFILE = '/group-profile/:groupName';

export const PAGE_PATHS = {
  DASHBOARD: '/',
  LOG_ACTION,
  LOG_ACTION_ADD_ACTION: LOG_ACTION + '/:actionId',
  ACTIONS: '/actions',
  MY_GROUPS: '/my-groups',
  FIND_GROUP: '/find-group',
  CREATE_GROUP: '/create-group',
  VALIDATE_ACTIONS: '/validate-actions',
  MY_ACCOUNT: '/account-settings',
  GROUP_PROFILE,
  GROUP_PROFILE_ADD_USER: GROUP_PROFILE + '/add/:addUserLink',
  CREATE_ACTION: '/create-action',
  USER_PROFILE: '/user-profile/:userId',
  ADMIN_DASHBOARD: '/admin-dashboard',
};
