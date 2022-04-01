/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSingleUser = /* GraphQL */ `
  query GetSingleUser($user_id: Int!) {
    getSingleUser(user_id: $user_id) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const getSingleUserByUsername = /* GraphQL */ `
  query GetSingleUserByUsername($username: String!) {
    getSingleUserByUsername(username: $username) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const getTotalGlobalCO2 = /* GraphQL */ `
  query GetTotalGlobalCO2 {
    getTotalGlobalCO2
  }
`;
export const getAllUsers = /* GraphQL */ `
  query GetAllUsers {
    getAllUsers {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const getAllActions = /* GraphQL */ `
  query GetAllActions {
    getAllActions {
      action_id
      action_name
      page_media
      action_icon
      fallback_quiz_media
    }
  }
`;
export const getAllSubmittedActions = /* GraphQL */ `
  query GetAllSubmittedActions {
    getAllSubmittedActions {
      sa_id
      user_id
      action_id
      quiz_id
      g_co2_saved
      date_of_action
      time_sumbitted
      first_quiz_answer_correct
      quiz_answered
      is_validated
      points_earned
    }
  }
`;
export const getAllActionItems = /* GraphQL */ `
  query GetAllActionItems {
    getAllActionItems {
      action_id
      item_name
      item_description
      co2_saved_per_unit
    }
  }
`;
export const getActionItemsForAction = /* GraphQL */ `
  query GetActionItemsForAction($action_id: Int!) {
    getActionItemsForAction(action_id: $action_id) {
      action_id
      item_name
      item_description
      co2_saved_per_unit
    }
  }
`;
