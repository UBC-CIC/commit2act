import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PAGE_PATHS } from '../constants/page-paths';
import { useUserInfoContext } from '../hooks/use-user-info-context';
import LogAction from '../pages/LogAction';
import Actions from '../pages/Actions';
import Landing from '../pages/Landing';
import MyGroups from '../pages/MyGroups';
import FindGroup from '../pages/FindGroup';
import CreateGroup from '../pages/CreateGroup';
import GroupProfile from '../pages/GroupProfile';
import PrivateRoute from './pageContainer/PrivateRoute';
import JoinGroup from '../pages/JoinGroup';
import ValidateActions from '../pages/ValidateActions';
import CreateAction from '../pages/CreateAction';
import AccountSettings from '../pages/AccountSettings';
import UserProfile from '../pages/UserProfile';
import AdminDashboard from '../pages/AdminDashboard';

export const AppRoutes = () => {
  const { userIsAdmin } = useUserInfoContext();
  return (
    <Routes>
      <Route path={PAGE_PATHS.LOG_ACTION} element={<LogAction />}>
        <Route
          path={PAGE_PATHS.LOG_ACTION_ADD_ACTION}
          element={<LogAction />}
        />
      </Route>
      <Route exact path={PAGE_PATHS.ACTIONS} element={<Actions />} />
      <Route exact path={PAGE_PATHS.DASHBOARD} element={<Landing />} />
      <Route exact path={PAGE_PATHS.MY_GROUPS} element={<MyGroups />} />
      <Route exact path={PAGE_PATHS.FIND_GROUP} element={<FindGroup />} />
      <Route exact path={PAGE_PATHS.CREATE_GROUP} element={<CreateGroup />} />
      <Route path={PAGE_PATHS.GROUP_PROFILE} element={<GroupProfile />} />
      <Route
        path={PAGE_PATHS.GROUP_PROFILE_ADD_USER}
        element={
          <PrivateRoute>
            <JoinGroup />
          </PrivateRoute>
        }
      />
      <Route
        exact
        path={PAGE_PATHS.VALIDATE_ACTIONS}
        element={<ValidateActions />}
      />
      {userIsAdmin && (
        <Route
          exact
          path={PAGE_PATHS.CREATE_ACTION}
          element={<CreateAction />}
        />
      )}
      <Route exact path={PAGE_PATHS.MY_ACCOUNT} element={<AccountSettings />} />
      <Route exact path={PAGE_PATHS.USER_PROFILE} element={<UserProfile />} />
      <Route
        exact
        path={PAGE_PATHS.ADMIN_DASHBOARD}
        element={<AdminDashboard />}
      />
    </Routes>
  );
};
