/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
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
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      startedAt
    }
  }
`;
export const syncGroups = /* GraphQL */ `
  query SyncGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncGroups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getFactBonusPointQuiz = /* GraphQL */ `
  query GetFactBonusPointQuiz($id: ID!) {
    getFactBonusPointQuiz(id: $id) {
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
export const listFactBonusPointQuizs = /* GraphQL */ `
  query ListFactBonusPointQuizs(
    $filter: ModelFactBonusPointQuizFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFactBonusPointQuizs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;

export const listQuizID = /* GraphQL */ `
  query ListFactBonusPointQuizs(
    $filter: ModelFactBonusPointQuizFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFactBonusPointQuizs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
      }
      nextToken
      startedAt
    }
  }
`;

export const syncFactBonusPointQuizs = /* GraphQL */ `
  query SyncFactBonusPointQuizs(
    $filter: ModelFactBonusPointQuizFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncFactBonusPointQuizs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getPlantBasedMealAction = /* GraphQL */ `
  query GetPlantBasedMealAction($id: ID!) {
    getPlantBasedMealAction(id: $id) {
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
export const listPlantBasedMealActions = /* GraphQL */ `
  query ListPlantBasedMealActions(
    $filter: ModelPlantBasedMealActionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlantBasedMealActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const syncPlantBasedMealActions = /* GraphQL */ `
  query SyncPlantBasedMealActions(
    $filter: ModelPlantBasedMealActionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPlantBasedMealActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
  }
`;
export const getWaterAction = /* GraphQL */ `
  query GetWaterAction($id: ID!) {
    getWaterAction(id: $id) {
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
export const listWaterActions = /* GraphQL */ `
  query ListWaterActions(
    $filter: ModelWaterActionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWaterActions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const syncWaterActions = /* GraphQL */ `
  query SyncWaterActions(
    $filter: ModelWaterActionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWaterActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
  }
`;
export const getTransportationAction = /* GraphQL */ `
  query GetTransportationAction($id: ID!) {
    getTransportationAction(id: $id) {
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
export const listTransportationActions = /* GraphQL */ `
  query ListTransportationActions(
    $filter: ModelTransportationActionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransportationActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const syncTransportationActions = /* GraphQL */ `
  query SyncTransportationActions(
    $filter: ModelTransportationActionFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTransportationActions(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
  }
`;
export const getUserGroup = /* GraphQL */ `
  query GetUserGroup($id: ID!) {
    getUserGroup(id: $id) {
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
export const listUserGroups = /* GraphQL */ `
  query ListUserGroups(
    $filter: ModelUserGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      nextToken
      startedAt
    }
  }
`;
export const syncUserGroups = /* GraphQL */ `
  query SyncUserGroups(
    $filter: ModelUserGroupFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserGroups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
      nextToken
      startedAt
    }
  }
`;
