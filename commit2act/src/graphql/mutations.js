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
export const createSubmittedActionItems = /* GraphQL */ `
  mutation CreateSubmittedActionItems(
    $sa_id: Int!
    $submitted_action_items: [SubmittedActionItemInput!]!
  ) {
    createSubmittedActionItems(
      sa_id: $sa_id
      submitted_action_items: $submitted_action_items
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
export const createActionItems = /* GraphQL */ `
  mutation CreateActionItems(
    $action_id: Int!
    $action_items: [ActionItemInput!]!
  ) {
    createActionItems(action_id: $action_id, action_items: $action_items) {
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $group_name: String!
    $group_description: String
    $group_image: String
    $is_public: Boolean!
    $private_password: String
  ) {
    createGroup(
      group_name: $group_name
      group_description: $group_description
      group_image: $group_image
      is_public: $is_public
      private_password: $private_password
    ) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const createGroupAndOwner = /* GraphQL */ `
  mutation CreateGroupAndOwner(
    $owner_user_id: Int!
    $group_name: String!
    $group_description: String
    $group_image: String
    $is_public: Boolean!
    $private_password: String
  ) {
    createGroupAndOwner(
      owner_user_id: $owner_user_id
      group_name: $group_name
      group_description: $group_description
      group_image: $group_image
      is_public: $is_public
      private_password: $private_password
    ) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $group_id: Int!
    $group_name: String
    $group_description: String
    $group_image: String
    $is_public: Boolean
    $private_password: String
  ) {
    updateGroup(
      group_id: $group_id
      group_name: $group_name
      group_description: $group_description
      group_image: $group_image
      is_public: $is_public
      private_password: $private_password
    ) {
      group_id
      group_name
      group_description
      group_image
      is_public
      private_password
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup($group_id: Int!) {
    deleteGroup(group_id: $group_id)
  }
`;
export const addGroupUser = /* GraphQL */ `
  mutation AddGroupUser(
    $group_id: Int!
    $user_id: Int!
    $user_role: UserRoleInGroup!
  ) {
    addGroupUser(
      group_id: $group_id
      user_id: $user_id
      user_role: $user_role
    ) {
      group_id
      user_id
      user_role
    }
  }
`;
export const addGroupOwner = /* GraphQL */ `
  mutation AddGroupOwner($group_id: Int!, $user_id: Int!) {
    addGroupOwner(group_id: $group_id, user_id: $user_id) {
      group_id
      user_id
      user_role
    }
  }
`;
export const addGroupMember = /* GraphQL */ `
  mutation AddGroupMember($group_id: Int!, $user_id: Int!) {
    addGroupMember(group_id: $group_id, user_id: $user_id) {
      group_id
      user_id
      user_role
    }
  }
`;
export const demoteGroupOwner = /* GraphQL */ `
  mutation DemoteGroupOwner($group_id: Int!, $user_id: Int!) {
    demoteGroupOwner(group_id: $group_id, user_id: $user_id) {
      group_id
      user_id
      user_role
    }
  }
`;
export const promoteGroupMember = /* GraphQL */ `
  mutation PromoteGroupMember($group_id: Int!, $user_id: Int!) {
    promoteGroupMember(group_id: $group_id, user_id: $user_id) {
      group_id
      user_id
      user_role
    }
  }
`;
export const removeGroupMember = /* GraphQL */ `
  mutation RemoveGroupMember($group_id: Int!, $user_id: Int!) {
    removeGroupMember(group_id: $group_id, user_id: $user_id)
  }
`;
