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
export const createSubmittedAction = /* GraphQL */ `
  mutation CreateSubmittedAction(
    $user_id: Int!
    $action_id: Int!
    $quiz_id: Int
    $g_co2_saved: Float!
    $time_sumbitted: String
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
      time_sumbitted: $time_sumbitted
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
      time_sumbitted
      first_quiz_answer_correct
      quiz_answered
      is_validated
      points_earned
    }
  }
`;
