import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum UserRole {
  STUDENT = "STUDENT",
  EDUCATOR = "EDUCATOR",
  ADMINISTRATOR = "ADMINISTRATOR",
  DEVELOPER = "DEVELOPER",
  USER = "USER"
}



type GroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PlantBasedMealActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WaterActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TransportationActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FactBonusPointQuizMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserGroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Group {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image?: string;
  readonly userID: string;
  readonly users?: (UserGroup | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Group, GroupMetaData>);
  static copyOf(source: Group, mutator: (draft: MutableModel<Group, GroupMetaData>) => MutableModel<Group, GroupMetaData> | void): Group;
}

export declare class User {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly avatar?: string;
  readonly role: UserRole | keyof typeof UserRole;
  readonly PlantBasedMealActions?: (PlantBasedMealAction | null)[];
  readonly WaterActions?: (WaterAction | null)[];
  readonly TransportationActions?: (TransportationAction | null)[];
  readonly GroupsOwned?: (Group | null)[];
  readonly JoinedGroups?: (UserGroup | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class PlantBasedMealAction {
  readonly id: string;
  readonly number_of_plant_based_meals: number;
  readonly date_of_action: string;
  readonly image?: string;
  readonly points_received: number;
  readonly g_co2_saved: number;
  readonly userID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<PlantBasedMealAction, PlantBasedMealActionMetaData>);
  static copyOf(source: PlantBasedMealAction, mutator: (draft: MutableModel<PlantBasedMealAction, PlantBasedMealActionMetaData>) => MutableModel<PlantBasedMealAction, PlantBasedMealActionMetaData> | void): PlantBasedMealAction;
}

export declare class WaterAction {
  readonly id: string;
  readonly ml_tap_water: number;
  readonly date_of_action: string;
  readonly image?: string;
  readonly points_received: number;
  readonly g_co2_saved: number;
  readonly userID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<WaterAction, WaterActionMetaData>);
  static copyOf(source: WaterAction, mutator: (draft: MutableModel<WaterAction, WaterActionMetaData>) => MutableModel<WaterAction, WaterActionMetaData> | void): WaterAction;
}

export declare class TransportationAction {
  readonly id: string;
  readonly km_walked: number;
  readonly km_biked: number;
  readonly km_transited: number;
  readonly date_of_action: string;
  readonly image?: string;
  readonly points_received: number;
  readonly g_co2_save: number;
  readonly userID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<TransportationAction, TransportationActionMetaData>);
  static copyOf(source: TransportationAction, mutator: (draft: MutableModel<TransportationAction, TransportationActionMetaData>) => MutableModel<TransportationAction, TransportationActionMetaData> | void): TransportationAction;
}

export declare class FactBonusPointQuiz {
  readonly id: string;
  readonly fact_text: string;
  readonly question_text: string;
  readonly answers: string[];
  readonly correct_answer: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<FactBonusPointQuiz, FactBonusPointQuizMetaData>);
  static copyOf(source: FactBonusPointQuiz, mutator: (draft: MutableModel<FactBonusPointQuiz, FactBonusPointQuizMetaData>) => MutableModel<FactBonusPointQuiz, FactBonusPointQuizMetaData> | void): FactBonusPointQuiz;
}

export declare class UserGroup {
  readonly id: string;
  readonly group: Group;
  readonly user: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<UserGroup, UserGroupMetaData>);
  static copyOf(source: UserGroup, mutator: (draft: MutableModel<UserGroup, UserGroupMetaData>) => MutableModel<UserGroup, UserGroupMetaData> | void): UserGroup;
}