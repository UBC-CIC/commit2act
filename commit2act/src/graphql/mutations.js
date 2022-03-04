/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
      id
      name
      description
      image
      userID
      users {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
      id
      name
      description
      image
      userID
      users {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
      id
      name
      description
      image
      userID
      users {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar
      role
      PlantBasedMealActions {
        items {
          id
          number_of_plant_based_meals
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      WaterActions {
        items {
          id
          ml_tap_water
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      TransportationActions {
        items {
          id
          km_walked
          km_biked
          km_transited
          date_of_action
          image
          points_received
          g_co2_save
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      GroupsOwned {
        items {
          id
          name
          description
          image
          userID
          users {
            items {
              id
              groupID
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      JoinedGroups {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar
      role
      PlantBasedMealActions {
        items {
          id
          number_of_plant_based_meals
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      WaterActions {
        items {
          id
          ml_tap_water
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      TransportationActions {
        items {
          id
          km_walked
          km_biked
          km_transited
          date_of_action
          image
          points_received
          g_co2_save
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      GroupsOwned {
        items {
          id
          name
          description
          image
          userID
          users {
            items {
              id
              groupID
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      JoinedGroups {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      avatar
      role
      PlantBasedMealActions {
        items {
          id
          number_of_plant_based_meals
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      WaterActions {
        items {
          id
          ml_tap_water
          date_of_action
          image
          points_received
          g_co2_saved
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      TransportationActions {
        items {
          id
          km_walked
          km_biked
          km_transited
          date_of_action
          image
          points_received
          g_co2_save
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      GroupsOwned {
        items {
          id
          name
          description
          image
          userID
          users {
            items {
              id
              groupID
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      JoinedGroups {
        items {
          id
          groupID
          userID
          group {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          user {
            id
            username
            email
            avatar
            role
            PlantBasedMealActions {
              nextToken
              startedAt
            }
            WaterActions {
              nextToken
              startedAt
            }
            TransportationActions {
              nextToken
              startedAt
            }
            GroupsOwned {
              nextToken
              startedAt
            }
            JoinedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createFactBonusPointQuiz = /* GraphQL */ `
  mutation CreateFactBonusPointQuiz(
    $input: CreateFactBonusPointQuizInput!
    $condition: ModelFactBonusPointQuizConditionInput
  ) {
    createFactBonusPointQuiz(input: $input, condition: $condition) {
      id
      fact_text
      question_text
      answers
      correct_answer
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateFactBonusPointQuiz = /* GraphQL */ `
  mutation UpdateFactBonusPointQuiz(
    $input: UpdateFactBonusPointQuizInput!
    $condition: ModelFactBonusPointQuizConditionInput
  ) {
    updateFactBonusPointQuiz(input: $input, condition: $condition) {
      id
      fact_text
      question_text
      answers
      correct_answer
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteFactBonusPointQuiz = /* GraphQL */ `
  mutation DeleteFactBonusPointQuiz(
    $input: DeleteFactBonusPointQuizInput!
    $condition: ModelFactBonusPointQuizConditionInput
  ) {
    deleteFactBonusPointQuiz(input: $input, condition: $condition) {
      id
      fact_text
      question_text
      answers
      correct_answer
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createPlantBasedMealAction = /* GraphQL */ `
  mutation CreatePlantBasedMealAction(
    $input: CreatePlantBasedMealActionInput!
    $condition: ModelPlantBasedMealActionConditionInput
  ) {
    createPlantBasedMealAction(input: $input, condition: $condition) {
      id
      number_of_plant_based_meals
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updatePlantBasedMealAction = /* GraphQL */ `
  mutation UpdatePlantBasedMealAction(
    $input: UpdatePlantBasedMealActionInput!
    $condition: ModelPlantBasedMealActionConditionInput
  ) {
    updatePlantBasedMealAction(input: $input, condition: $condition) {
      id
      number_of_plant_based_meals
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deletePlantBasedMealAction = /* GraphQL */ `
  mutation DeletePlantBasedMealAction(
    $input: DeletePlantBasedMealActionInput!
    $condition: ModelPlantBasedMealActionConditionInput
  ) {
    deletePlantBasedMealAction(input: $input, condition: $condition) {
      id
      number_of_plant_based_meals
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createWaterAction = /* GraphQL */ `
  mutation CreateWaterAction(
    $input: CreateWaterActionInput!
    $condition: ModelWaterActionConditionInput
  ) {
    createWaterAction(input: $input, condition: $condition) {
      id
      ml_tap_water
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateWaterAction = /* GraphQL */ `
  mutation UpdateWaterAction(
    $input: UpdateWaterActionInput!
    $condition: ModelWaterActionConditionInput
  ) {
    updateWaterAction(input: $input, condition: $condition) {
      id
      ml_tap_water
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteWaterAction = /* GraphQL */ `
  mutation DeleteWaterAction(
    $input: DeleteWaterActionInput!
    $condition: ModelWaterActionConditionInput
  ) {
    deleteWaterAction(input: $input, condition: $condition) {
      id
      ml_tap_water
      date_of_action
      image
      points_received
      g_co2_saved
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createTransportationAction = /* GraphQL */ `
  mutation CreateTransportationAction(
    $input: CreateTransportationActionInput!
    $condition: ModelTransportationActionConditionInput
  ) {
    createTransportationAction(input: $input, condition: $condition) {
      id
      km_walked
      km_biked
      km_transited
      date_of_action
      image
      points_received
      g_co2_save
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateTransportationAction = /* GraphQL */ `
  mutation UpdateTransportationAction(
    $input: UpdateTransportationActionInput!
    $condition: ModelTransportationActionConditionInput
  ) {
    updateTransportationAction(input: $input, condition: $condition) {
      id
      km_walked
      km_biked
      km_transited
      date_of_action
      image
      points_received
      g_co2_save
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteTransportationAction = /* GraphQL */ `
  mutation DeleteTransportationAction(
    $input: DeleteTransportationActionInput!
    $condition: ModelTransportationActionConditionInput
  ) {
    deleteTransportationAction(input: $input, condition: $condition) {
      id
      km_walked
      km_biked
      km_transited
      date_of_action
      image
      points_received
      g_co2_save
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUserGroup = /* GraphQL */ `
  mutation CreateUserGroup(
    $input: CreateUserGroupInput!
    $condition: ModelUserGroupConditionInput
  ) {
    createUserGroup(input: $input, condition: $condition) {
      id
      groupID
      userID
      group {
        id
        name
        description
        image
        userID
        users {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        username
        email
        avatar
        role
        PlantBasedMealActions {
          items {
            id
            number_of_plant_based_meals
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        WaterActions {
          items {
            id
            ml_tap_water
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        TransportationActions {
          items {
            id
            km_walked
            km_biked
            km_transited
            date_of_action
            image
            points_received
            g_co2_save
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        GroupsOwned {
          items {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        JoinedGroups {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUserGroup = /* GraphQL */ `
  mutation UpdateUserGroup(
    $input: UpdateUserGroupInput!
    $condition: ModelUserGroupConditionInput
  ) {
    updateUserGroup(input: $input, condition: $condition) {
      id
      groupID
      userID
      group {
        id
        name
        description
        image
        userID
        users {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        username
        email
        avatar
        role
        PlantBasedMealActions {
          items {
            id
            number_of_plant_based_meals
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        WaterActions {
          items {
            id
            ml_tap_water
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        TransportationActions {
          items {
            id
            km_walked
            km_biked
            km_transited
            date_of_action
            image
            points_received
            g_co2_save
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        GroupsOwned {
          items {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        JoinedGroups {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUserGroup = /* GraphQL */ `
  mutation DeleteUserGroup(
    $input: DeleteUserGroupInput!
    $condition: ModelUserGroupConditionInput
  ) {
    deleteUserGroup(input: $input, condition: $condition) {
      id
      groupID
      userID
      group {
        id
        name
        description
        image
        userID
        users {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      user {
        id
        username
        email
        avatar
        role
        PlantBasedMealActions {
          items {
            id
            number_of_plant_based_meals
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        WaterActions {
          items {
            id
            ml_tap_water
            date_of_action
            image
            points_received
            g_co2_saved
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        TransportationActions {
          items {
            id
            km_walked
            km_biked
            km_transited
            date_of_action
            image
            points_received
            g_co2_save
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        GroupsOwned {
          items {
            id
            name
            description
            image
            userID
            users {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        JoinedGroups {
          items {
            id
            groupID
            userID
            group {
              id
              name
              description
              image
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            user {
              id
              username
              email
              avatar
              role
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
