/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEducatorUser = /* GraphQL */ `
  subscription OnCreateEducatorUser {
    onCreateEducatorUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      OwnedGroups {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorUserUserId
      educatorUserSchoolId
    }
  }
`;
export const onUpdateEducatorUser = /* GraphQL */ `
  subscription OnUpdateEducatorUser {
    onUpdateEducatorUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      OwnedGroups {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorUserUserId
      educatorUserSchoolId
    }
  }
`;
export const onDeleteEducatorUser = /* GraphQL */ `
  subscription OnDeleteEducatorUser {
    onDeleteEducatorUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      OwnedGroups {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorUserUserId
      educatorUserSchoolId
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
      type
      total_points
      total_g_co2_saved
      SubmittedActions {
        items {
          id
          Action {
            id
            date_of_action
            image
            points_received
            g_co2_saved
            action_name
            action_items
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          FactBonusPointQuiz {
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
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          submittedActionActionId
          submittedActionFactBonusPointQuizId
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
      type
      total_points
      total_g_co2_saved
      SubmittedActions {
        items {
          id
          Action {
            id
            date_of_action
            image
            points_received
            g_co2_saved
            action_name
            action_items
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          FactBonusPointQuiz {
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
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          submittedActionActionId
          submittedActionFactBonusPointQuizId
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
      type
      total_points
      total_g_co2_saved
      SubmittedActions {
        items {
          id
          Action {
            id
            date_of_action
            image
            points_received
            g_co2_saved
            action_name
            action_items
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          FactBonusPointQuiz {
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
          userID
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          submittedActionActionId
          submittedActionFactBonusPointQuizId
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
export const onCreateStudentUser = /* GraphQL */ `
  subscription OnCreateStudentUser {
    onCreateStudentUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      JoinedGroups {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      studentUserUserId
      studentUserSchoolId
    }
  }
`;
export const onUpdateStudentUser = /* GraphQL */ `
  subscription OnUpdateStudentUser {
    onUpdateStudentUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      JoinedGroups {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      studentUserUserId
      studentUserSchoolId
    }
  }
`;
export const onDeleteStudentUser = /* GraphQL */ `
  subscription OnDeleteStudentUser {
    onDeleteStudentUser {
      id
      User {
        id
        username
        email
        avatar
        type
        total_points
        total_g_co2_saved
        SubmittedActions {
          items {
            id
            Action {
              id
              date_of_action
              image
              points_received
              g_co2_saved
              action_name
              action_items
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            FactBonusPointQuiz {
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
            userID
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            submittedActionActionId
            submittedActionFactBonusPointQuizId
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
      School {
        id
        name
        city
        country
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      JoinedGroups {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      studentUserUserId
      studentUserSchoolId
    }
  }
`;
export const onCreateSchool = /* GraphQL */ `
  subscription OnCreateSchool {
    onCreateSchool {
      id
      name
      city
      country
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateSchool = /* GraphQL */ `
  subscription OnUpdateSchool {
    onUpdateSchool {
      id
      name
      city
      country
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteSchool = /* GraphQL */ `
  subscription OnDeleteSchool {
    onDeleteSchool {
      id
      name
      city
      country
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
      id
      name
      description
      image
      studentusers {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorusers {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      studentusers {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorusers {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      studentusers {
        items {
          id
          studentUserID
          groupID
          studentUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
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
            studentUserUserId
            studentUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
      educatorusers {
        items {
          id
          educatorUserID
          groupID
          educatorUser {
            id
            User {
              id
              username
              email
              avatar
              type
              total_points
              total_g_co2_saved
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            School {
              id
              name
              city
              country
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
            }
            OwnedGroups {
              nextToken
              startedAt
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            educatorUserUserId
            educatorUserSchoolId
          }
          group {
            id
            name
            description
            image
            studentusers {
              nextToken
              startedAt
            }
            educatorusers {
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
export const onCreateSubmittedAction = /* GraphQL */ `
  subscription OnCreateSubmittedAction {
    onCreateSubmittedAction {
      id
      Action {
        id
        date_of_action
        image
        points_received
        g_co2_saved
        action_name
        action_items
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      FactBonusPointQuiz {
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
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      submittedActionActionId
      submittedActionFactBonusPointQuizId
    }
  }
`;
export const onUpdateSubmittedAction = /* GraphQL */ `
  subscription OnUpdateSubmittedAction {
    onUpdateSubmittedAction {
      id
      Action {
        id
        date_of_action
        image
        points_received
        g_co2_saved
        action_name
        action_items
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      FactBonusPointQuiz {
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
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      submittedActionActionId
      submittedActionFactBonusPointQuizId
    }
  }
`;
export const onDeleteSubmittedAction = /* GraphQL */ `
  subscription OnDeleteSubmittedAction {
    onDeleteSubmittedAction {
      id
      Action {
        id
        date_of_action
        image
        points_received
        g_co2_saved
        action_name
        action_items
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      FactBonusPointQuiz {
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
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      submittedActionActionId
      submittedActionFactBonusPointQuizId
    }
  }
`;
export const onCreateAction = /* GraphQL */ `
  subscription OnCreateAction {
    onCreateAction {
      id
      date_of_action
      image
      points_received
      g_co2_saved
      action_name
      action_items
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateAction = /* GraphQL */ `
  subscription OnUpdateAction {
    onUpdateAction {
      id
      date_of_action
      image
      points_received
      g_co2_saved
      action_name
      action_items
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteAction = /* GraphQL */ `
  subscription OnDeleteAction {
    onDeleteAction {
      id
      date_of_action
      image
      points_received
      g_co2_saved
      action_name
      action_items
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
export const onCreateEducatorUserGroup = /* GraphQL */ `
  subscription OnCreateEducatorUserGroup {
    onCreateEducatorUserGroup {
      id
      educatorUserID
      groupID
      educatorUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        OwnedGroups {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorUserUserId
        educatorUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
export const onUpdateEducatorUserGroup = /* GraphQL */ `
  subscription OnUpdateEducatorUserGroup {
    onUpdateEducatorUserGroup {
      id
      educatorUserID
      groupID
      educatorUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        OwnedGroups {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorUserUserId
        educatorUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
export const onDeleteEducatorUserGroup = /* GraphQL */ `
  subscription OnDeleteEducatorUserGroup {
    onDeleteEducatorUserGroup {
      id
      educatorUserID
      groupID
      educatorUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        OwnedGroups {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorUserUserId
        educatorUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
export const onCreateStudentUserGroup = /* GraphQL */ `
  subscription OnCreateStudentUserGroup {
    onCreateStudentUserGroup {
      id
      studentUserID
      groupID
      studentUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        JoinedGroups {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        studentUserUserId
        studentUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
export const onUpdateStudentUserGroup = /* GraphQL */ `
  subscription OnUpdateStudentUserGroup {
    onUpdateStudentUserGroup {
      id
      studentUserID
      groupID
      studentUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        JoinedGroups {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        studentUserUserId
        studentUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
export const onDeleteStudentUserGroup = /* GraphQL */ `
  subscription OnDeleteStudentUserGroup {
    onDeleteStudentUserGroup {
      id
      studentUserID
      groupID
      studentUser {
        id
        User {
          id
          username
          email
          avatar
          type
          total_points
          total_g_co2_saved
          SubmittedActions {
            items {
              id
              userID
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              submittedActionActionId
              submittedActionFactBonusPointQuizId
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
        School {
          id
          name
          city
          country
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        JoinedGroups {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        studentUserUserId
        studentUserSchoolId
      }
      group {
        id
        name
        description
        image
        studentusers {
          items {
            id
            studentUserID
            groupID
            studentUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              studentUserUserId
              studentUserSchoolId
            }
            group {
              id
              name
              description
              image
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
        educatorusers {
          items {
            id
            educatorUserID
            groupID
            educatorUser {
              id
              createdAt
              updatedAt
              _version
              _deleted
              _lastChangedAt
              educatorUserUserId
              educatorUserSchoolId
            }
            group {
              id
              name
              description
              image
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
