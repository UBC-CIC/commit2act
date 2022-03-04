/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateFactBonusPointQuiz = /* GraphQL */ `
  subscription OnCreateFactBonusPointQuiz {
    onCreateFactBonusPointQuiz {
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
export const onUpdateFactBonusPointQuiz = /* GraphQL */ `
  subscription OnUpdateFactBonusPointQuiz {
    onUpdateFactBonusPointQuiz {
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
export const onDeleteFactBonusPointQuiz = /* GraphQL */ `
  subscription OnDeleteFactBonusPointQuiz {
    onDeleteFactBonusPointQuiz {
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
export const onCreatePlantBasedMealAction = /* GraphQL */ `
  subscription OnCreatePlantBasedMealAction {
    onCreatePlantBasedMealAction {
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
export const onUpdatePlantBasedMealAction = /* GraphQL */ `
  subscription OnUpdatePlantBasedMealAction {
    onUpdatePlantBasedMealAction {
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
export const onDeletePlantBasedMealAction = /* GraphQL */ `
  subscription OnDeletePlantBasedMealAction {
    onDeletePlantBasedMealAction {
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
export const onCreateWaterAction = /* GraphQL */ `
  subscription OnCreateWaterAction {
    onCreateWaterAction {
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
export const onUpdateWaterAction = /* GraphQL */ `
  subscription OnUpdateWaterAction {
    onUpdateWaterAction {
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
export const onDeleteWaterAction = /* GraphQL */ `
  subscription OnDeleteWaterAction {
    onDeleteWaterAction {
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
export const onCreateTransportationAction = /* GraphQL */ `
  subscription OnCreateTransportationAction {
    onCreateTransportationAction {
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
export const onUpdateTransportationAction = /* GraphQL */ `
  subscription OnUpdateTransportationAction {
    onUpdateTransportationAction {
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
export const onDeleteTransportationAction = /* GraphQL */ `
  subscription OnDeleteTransportationAction {
    onDeleteTransportationAction {
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
export const onCreateUserGroup = /* GraphQL */ `
  subscription OnCreateUserGroup {
    onCreateUserGroup {
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
export const onUpdateUserGroup = /* GraphQL */ `
  subscription OnUpdateUserGroup {
    onUpdateUserGroup {
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
export const onDeleteUserGroup = /* GraphQL */ `
  subscription OnDeleteUserGroup {
    onDeleteUserGroup {
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
