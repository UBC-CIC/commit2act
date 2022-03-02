// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { PlantBasedMealAction, WaterAction, TransportationAction } = initSchema(schema);

export {
  PlantBasedMealAction,
  WaterAction,
  TransportationAction
};