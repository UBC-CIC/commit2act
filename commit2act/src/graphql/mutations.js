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
