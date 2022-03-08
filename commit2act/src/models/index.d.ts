import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum UserType {
  STUDENT = "STUDENT",
  EDUCATOR = "EDUCATOR",
  ADMINISTRATOR = "ADMINISTRATOR",
  DEVELOPER = "DEVELOPER",
  USER = "USER"
}



type EducatorUserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SchoolMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type GroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type StudentUserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type SubmittedActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FactBonusPointQuizMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type EducatorUserGroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type StudentUserGroupMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class EducatorUser {
  readonly id: string;
  readonly User?: User;
  readonly School?: School;
  readonly OwnedGroups?: (EducatorUserGroup | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly educatorUserUserId?: string;
  readonly educatorUserSchoolId?: string;
  constructor(init: ModelInit<EducatorUser, EducatorUserMetaData>);
  static copyOf(source: EducatorUser, mutator: (draft: MutableModel<EducatorUser, EducatorUserMetaData>) => MutableModel<EducatorUser, EducatorUserMetaData> | void): EducatorUser;
}

export declare class User {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly avatar?: string;
  readonly type: UserType | keyof typeof UserType;
  readonly Actions?: (Action | null)[];
  readonly total_points: number;
  readonly total_g_co2_saved: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class Action {
  readonly id: string;
  readonly date_of_action: string;
  readonly image?: string;
  readonly points_received: number;
  readonly g_co2_saved: number;
  readonly userID: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Action, ActionMetaData>);
  static copyOf(source: Action, mutator: (draft: MutableModel<Action, ActionMetaData>) => MutableModel<Action, ActionMetaData> | void): Action;
}

export declare class School {
  readonly id: string;
  readonly name: string;
  readonly city?: string;
  readonly country?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<School, SchoolMetaData>);
  static copyOf(source: School, mutator: (draft: MutableModel<School, SchoolMetaData>) => MutableModel<School, SchoolMetaData> | void): School;
}

export declare class Group {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image?: string;
  readonly studentusers?: (StudentUserGroup | null)[];
  readonly educatorusers?: (EducatorUserGroup | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Group, GroupMetaData>);
  static copyOf(source: Group, mutator: (draft: MutableModel<Group, GroupMetaData>) => MutableModel<Group, GroupMetaData> | void): Group;
}

export declare class StudentUser {
  readonly id: string;
  readonly User?: User;
  readonly School?: School;
  readonly JoinedGroups?: (StudentUserGroup | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly studentUserUserId?: string;
  readonly studentUserSchoolId?: string;
  constructor(init: ModelInit<StudentUser, StudentUserMetaData>);
  static copyOf(source: StudentUser, mutator: (draft: MutableModel<StudentUser, StudentUserMetaData>) => MutableModel<StudentUser, StudentUserMetaData> | void): StudentUser;
}

export declare class SubmittedAction {
  readonly id: string;
  readonly Action?: Action;
  readonly FactBonusPointQuiz?: FactBonusPointQuiz;
  readonly User?: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly submittedActionActionId?: string;
  readonly submittedActionFactBonusPointQuizId?: string;
  readonly submittedActionUserId?: string;
  constructor(init: ModelInit<SubmittedAction, SubmittedActionMetaData>);
  static copyOf(source: SubmittedAction, mutator: (draft: MutableModel<SubmittedAction, SubmittedActionMetaData>) => MutableModel<SubmittedAction, SubmittedActionMetaData> | void): SubmittedAction;
}

export declare class FactBonusPointQuiz {
  readonly id: string;
  readonly fact_text: string;
  readonly question_text: string;
  readonly answers: string[];
  readonly correct_answer: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<FactBonusPointQuiz, FactBonusPointQuizMetaData>);
  static copyOf(source: FactBonusPointQuiz, mutator: (draft: MutableModel<FactBonusPointQuiz, FactBonusPointQuizMetaData>) => MutableModel<FactBonusPointQuiz, FactBonusPointQuizMetaData> | void): FactBonusPointQuiz;
}

export declare class EducatorUserGroup {
  readonly id: string;
  readonly educatorUser: EducatorUser;
  readonly group: Group;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<EducatorUserGroup, EducatorUserGroupMetaData>);
  static copyOf(source: EducatorUserGroup, mutator: (draft: MutableModel<EducatorUserGroup, EducatorUserGroupMetaData>) => MutableModel<EducatorUserGroup, EducatorUserGroupMetaData> | void): EducatorUserGroup;
}

export declare class StudentUserGroup {
  readonly id: string;
  readonly group: Group;
  readonly studentUser: StudentUser;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<StudentUserGroup, StudentUserGroupMetaData>);
  static copyOf(source: StudentUserGroup, mutator: (draft: MutableModel<StudentUserGroup, StudentUserGroupMetaData>) => MutableModel<StudentUserGroup, StudentUserGroupMetaData> | void): StudentUserGroup;
}