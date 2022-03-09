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

const { EducatorUser, User, SubmittedAction, Action, FactBonusPointQuiz, School, Group, StudentUser, EducatorUserGroup, StudentUserGroup } = initSchema(schema);

export {
  EducatorUser,
  User,
  SubmittedAction,
  Action,
  FactBonusPointQuiz,
  School,
  Group,
  StudentUser,
  EducatorUserGroup,
  StudentUserGroup,
  UserType
};