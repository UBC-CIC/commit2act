import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin } from '../../graphql/queries';
import ActionNameSearchBar from './ActionNameSearchBar';

const UsersWithoutGroupPanel = ({ user }) => {
  const [allActions, setAllActions] = useState();

  const getAllUserWithoutGroupActions = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin,
    });
    setAllActions(
      res.data.getAllSubmittedActionsOfUsersWithoutGroupToValidateForAdmin
    );
  };

  useEffect(() => {
    getAllUserWithoutGroupActions();
  }, []);

  return (
    <ActionNameSearchBar
      user={user}
      getAllActionsToValidate={getAllUserWithoutGroupActions}
      allActionsToValidate={allActions}
    />
  );
};

export default UsersWithoutGroupPanel;
