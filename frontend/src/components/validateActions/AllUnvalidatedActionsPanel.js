import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { getAllSubmittedActionsToValidateForAdmin } from '../../graphql/queries';
import ActionNameSearchBar from './ActionNameSearchBar';

const AllUnvalidatedActionsPanel = ({ user }) => {
  const [allActions, setAllActions] = useState();

  const getAllActionsForAdmin = async () => {
    const res = await API.graphql({
      query: getAllSubmittedActionsToValidateForAdmin,
    });
    setAllActions(res.data.getAllSubmittedActionsToValidateForAdmin);
  };

  useEffect(() => {
    getAllActionsForAdmin();
  }, []);

  return (
    <ActionNameSearchBar
      user={user}
      getAllActionsToValidate={getAllActionsForAdmin}
      allActionsToValidate={allActions}
    />
  );
};

export default AllUnvalidatedActionsPanel;
