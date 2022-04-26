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
export const getSingleSubmittedAction = /* GraphQL */ `
  query GetSingleSubmittedAction($sa_id: Int!) {
    getSingleSubmittedAction(sa_id: $sa_id) {
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
export const getSingleSubmittedActionWithItems = /* GraphQL */ `
  query GetSingleSubmittedActionWithItems($sa_id: Int!) {
    getSingleSubmittedActionWithItems(sa_id: $sa_id) {
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
      submitted_action_items {
        item_name
        sa_id
        input_value
      }
    }
  }
`;
export const getSingleActionWithLabels = /* GraphQL */ `
  query GetSingleActionWithLabels($action_id: Int!) {
    getSingleActionWithLabels(action_id: $action_id) {
      action_id
      action_name
      page_media
      action_icon
      fallback_quiz_media
      validation_label
    }
  }
`;
export const getTotalGlobalCO2 = /* GraphQL */ `
  query GetTotalGlobalCO2 {
    getTotalGlobalCO2
  }
`;
export const getUsersTotalCO2 = /* GraphQL */ `
  query GetUsersTotalCO2($user_id: Int!) {
    getUsersTotalCO2(user_id: $user_id)
  }
`;
export const getGroupsTotalCO2 = /* GraphQL */ `
  query GetGroupsTotalCO2($group_id: Int!) {
    getGroupsTotalCO2(group_id: $group_id)
  }
`;
export const getUsersWeekCO2 = /* GraphQL */ `
  query GetUsersWeekCO2($user_id: Int!) {
    getUsersWeekCO2(user_id: $user_id)
  }
`;
export const getGroupsWeekCO2 = /* GraphQL */ `
  query GetGroupsWeekCO2($group_id: Int!) {
    getGroupsWeekCO2(group_id: $group_id)
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
export const getAllSubmittedActionsForUser = /* GraphQL */ `
  query GetAllSubmittedActionsForUser($user_id: Int!) {
    getAllSubmittedActionsForUser(user_id: $user_id) {
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
      submitted_action_items
      action_name
    }
  }
`;
export const getAllGroups = /* GraphQL */ `
  query GetAllGroups {
    getAllGroups {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getSingleGroup = /* GraphQL */ `
  query GetSingleGroup($group_id: Int!) {
    getSingleGroup(group_id: $group_id) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getSingleGroupByName = /* GraphQL */ `
  query GetSingleGroupByName($group_name: String!) {
    getSingleGroupByName(group_name: $group_name) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getAllUsersInGroup = /* GraphQL */ `
  query GetAllUsersInGroup($group_id: Int) {
    getAllUsersInGroup(group_id: $group_id) {
      user_id
      username
      name
      email
      avatar
      user_role
    }
  }
`;
export const getAllOwnersInGroup = /* GraphQL */ `
  query GetAllOwnersInGroup($group_id: Int) {
    getAllOwnersInGroup(group_id: $group_id) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const getAllMembersInGroup = /* GraphQL */ `
  query GetAllMembersInGroup($group_id: Int) {
    getAllMembersInGroup(group_id: $group_id) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const getAllValidatedSubmittedActionsInGroup = /* GraphQL */ `
  query GetAllValidatedSubmittedActionsInGroup($group_id: Int) {
    getAllValidatedSubmittedActionsInGroup(group_id: $group_id) {
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
      submitted_action_items
      action_name
    }
  }
`;
export const getAllGroupsForUser = /* GraphQL */ `
  query GetAllGroupsForUser($user_id: Int) {
    getAllGroupsForUser(user_id: $user_id) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getAllGroupsUserOwns = /* GraphQL */ `
  query GetAllGroupsUserOwns($user_id: Int) {
    getAllGroupsUserOwns(user_id: $user_id) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getAllGroupsUserIsAMember = /* GraphQL */ `
  query GetAllGroupsUserIsAMember($user_id: Int) {
    getAllGroupsUserIsAMember(user_id: $user_id) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const getGroupTotalCO2 = /* GraphQL */ `
  query GetGroupTotalCO2($group_id: Int!) {
    getGroupTotalCO2(group_id: $group_id)
  }
`;
export const isPrivateGroupPasswordCorrect = /* GraphQL */ `
  query IsPrivateGroupPasswordCorrect(
    $group_id: Int!
    $private_password: String!
  ) {
    isPrivateGroupPasswordCorrect(
      group_id: $group_id
      private_password: $private_password
    )
  }
`;
