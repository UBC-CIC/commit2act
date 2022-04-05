/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $username: String!
    $name: String!
    $email: String!
    $avatar: String
  ) {
    createUser(
      username: $username
      name: $name
      email: $email
      avatar: $avatar
    ) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $user_id: Int!
    $name: String
    $email: String
    $avatar: String
  ) {
    updateUser(user_id: $user_id, name: $name, email: $email, avatar: $avatar) {
      user_id
      username
      name
      email
      avatar
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($user_id: Int!) {
    deleteUser(user_id: $user_id)
  }
`;
export const createSubmittedAction = /* GraphQL */ `
  mutation CreateSubmittedAction(
    $user_id: Int!
    $action_id: Int!
    $quiz_id: Int
    $g_co2_saved: Float!
    $date_of_action: String!
    $first_quiz_answer_correct: Boolean!
    $quiz_answered: Boolean!
    $is_validated: Boolean!
    $points_earned: Int!
  ) {
    createSubmittedAction(
      user_id: $user_id
      action_id: $action_id
      quiz_id: $quiz_id
      g_co2_saved: $g_co2_saved
      date_of_action: $date_of_action
      first_quiz_answer_correct: $first_quiz_answer_correct
      quiz_answered: $quiz_answered
      is_validated: $is_validated
      points_earned: $points_earned
    ) {
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
export const createSubmittedActionItem = /* GraphQL */ `
  mutation CreateSubmittedActionItem(
    $sa_id: Int!
    $item_name: String!
    $input_value: Float!
  ) {
    createSubmittedActionItem(
      sa_id: $sa_id
      item_name: $item_name
      input_value: $input_value
    ) {
      item_name
      sa_id
      input_value
    }
  }
`;
export const createAction = /* GraphQL */ `
  mutation CreateAction(
    $action_name: String!
    $page_media: String
    $action_icon: String
    $fallback_quiz_media: String
  ) {
    createAction(
      action_name: $action_name
      page_media: $page_media
      action_icon: $action_icon
      fallback_quiz_media: $fallback_quiz_media
    ) {
      action_id
      action_name
      page_media
      action_icon
      fallback_quiz_media
    }
  }
`;
export const createActionItem = /* GraphQL */ `
  mutation CreateActionItem(
    $action_id: Int!
    $action_items: [ActionItemInput!]!
  ) {
    createActionItem(action_id: $action_id, action_items: $action_items) {
      action_id
      item_name
      item_description
      co2_saved_per_unit
    }
  }
`;
export const deleteAction = /* GraphQL */ `
  mutation DeleteAction($action_id: Int!) {
    deleteAction(action_id: $action_id)
  }
`;
export const createActionWithItems = /* GraphQL */ `
  mutation CreateActionWithItems(
    $action_name: String!
    $page_media: String
    $action_icon: String
    $fallback_quiz_media: String
    $action_items: [ActionItemInput!]!
  ) {
    createActionWithItems(
      action_name: $action_name
      page_media: $page_media
      action_icon: $action_icon
      fallback_quiz_media: $fallback_quiz_media
      action_items: $action_items
    ) {
      action_id
      action_name
      page_media
      action_icon
      fallback_quiz_media
    }
  }
`;
