// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserRole = {
  "STUDENT": "STUDENT",
  "EDUCATOR": "EDUCATOR",
  "ADMINISTRATOR": "ADMINISTRATOR",
  "DEVELOPER": "DEVELOPER",
  "USER": "USER"
};

const { Group, User, PlantBasedMealAction, WaterAction, TransportationAction, FactBonusPointQuiz, UserGroup } = initSchema(schema);

export {
  Group,
  User,
  PlantBasedMealAction,
  WaterAction,
  TransportationAction,
  FactBonusPointQuiz,
  UserGroup,
  UserRole
};