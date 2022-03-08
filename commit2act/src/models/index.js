// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserType = {
  "STUDENT": "STUDENT",
  "EDUCATOR": "EDUCATOR",
  "ADMINISTRATOR": "ADMINISTRATOR",
  "DEVELOPER": "DEVELOPER",
  "USER": "USER"
};

const { EducatorUser, User, Action, School, Group, StudentUser, SubmittedAction, FactBonusPointQuiz, EducatorUserGroup, StudentUserGroup } = initSchema(schema);

export {
  EducatorUser,
  User,
  Action,
  School,
  Group,
  StudentUser,
  SubmittedAction,
  FactBonusPointQuiz,
  EducatorUserGroup,
  StudentUserGroup,
  UserType
};