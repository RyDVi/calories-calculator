import { Instance, types } from 'mobx-state-tree';
import { createModelStore, createMutation } from 'mst-query';
import { useQueryStore } from 'shared/providers';
import { saveNutrition } from '../api/nutritionApi';
import { Nutrition, SaveNutrition } from '../model/nutritionModel';

export const SaveNutritionMutation = createMutation('SaveNutritionMutation', {
  data: Nutrition,
  request: SaveNutrition,
  endpoint({ request }) {
    return saveNutrition(request);
  },
});

export const NutritionStore = createModelStore(
  'NutritionStore',
  Nutrition,
).props({
  saveNutritionMutation: types.optional(SaveNutritionMutation, {}),
});

type NutritionStoreInstance = Instance<typeof NutritionStore>;

export function useNutritionsStore() {
  return useQueryStore().nutritionsStore as NutritionStoreInstance;
}
