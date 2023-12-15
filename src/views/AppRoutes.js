import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PAGE_PATHS } from '../constants/page-paths';
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

export const AppRoutes = ({ user, userType, setUser }) => {
  return (
    <Routes>
      <Route path={PAGE_PATHS.LOG_ACTION} element={<LogAction user={user} />}>
        <Route
          path={PAGE_PATHS.LOG_ACTION_ADD_ACTION}
          element={<LogAction user={user} />}
        />
      </Route>
      <Route
        exact
        path={PAGE_PATHS.ACTIONS}
        element={<Actions user={user} userType={userType} />}
      />
      <Route
        exact
        path={PAGE_PATHS.DASHBOARD}
        element={<Landing user={user} userType={userType} />}
      />
      <Route
        exact
        path={PAGE_PATHS.MY_GROUPS}
        element={<MyGroups user={user} />}
      />
      <Route
        exact
        path={PAGE_PATHS.FIND_GROUP}
        element={<FindGroup user={user} />}
      />
      <Route
        exact
        path={PAGE_PATHS.CREATE_GROUP}
        element={<CreateGroup user={user} />}
      />
      <Route
        path={PAGE_PATHS.GROUP_PROFILE}
        element={<GroupProfile user={user} />}
      />
      <Route
        path={PAGE_PATHS.GROUP_PROFILE_ADD_USER}
        element={<PrivateRoute Component={JoinGroup} user={user} />}
      />
      <Route
        exact
        path={PAGE_PATHS.VALIDATE_ACTIONS}
        element={<ValidateActions user={user} userType={userType} />}
      />
      {userType === 'Admin' && (
        <Route
          exact
          path={PAGE_PATHS.CREATE_ACTION}
          element={<CreateAction />}
        />
      )}
      <Route
        exact
        path={PAGE_PATHS.MY_ACCOUNT}
        element={
          <AccountSettings user={user} setUser={setUser} userType={userType} />
        }
      />
      <Route exact path={PAGE_PATHS.USER_PROFILE} element={<UserProfile />} />
      <Route
        exact
        path={PAGE_PATHS.ADMIN_DASHBOARD}
        element={<AdminDashboard />}
      />
    </Routes>
  );
};
