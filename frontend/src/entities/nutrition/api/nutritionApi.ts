import { makeCreateUpdateRequest } from 'shared/api';
import {
  SaveNutritionSnapshotIn,
  SaveNutritionSnapshotOut,
} from '../model/nutritionModel';

const NUTRITIONS_PATH = '/nutritions';

export const saveNutrition = makeCreateUpdateRequest<
  SaveNutritionSnapshotIn,
  SaveNutritionSnapshotOut
>(NUTRITIONS_PATH);
