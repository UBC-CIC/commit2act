import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PlantBasedMealActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WaterActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TransportationActionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class PlantBasedMealAction {
  readonly id: string;
  readonly number_of_plant_based_meals: number;
  readonly date_of_action: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<PlantBasedMealAction, PlantBasedMealActionMetaData>);
  static copyOf(source: PlantBasedMealAction, mutator: (draft: MutableModel<PlantBasedMealAction, PlantBasedMealActionMetaData>) => MutableModel<PlantBasedMealAction, PlantBasedMealActionMetaData> | void): PlantBasedMealAction;
}

export declare class WaterAction {
  readonly id: string;
  readonly ml_tap_water: number;
  readonly date_of_action: string;
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
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<TransportationAction, TransportationActionMetaData>);
  static copyOf(source: TransportationAction, mutator: (draft: MutableModel<TransportationAction, TransportationActionMetaData>) => MutableModel<TransportationAction, TransportationActionMetaData> | void): TransportationAction;
}