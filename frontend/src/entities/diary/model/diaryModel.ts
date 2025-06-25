import lodash from 'lodash';
import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import {
  getNutritionFromMealTimes,
  MealTime,
  MealTimeInstance,
  MealTimeNamesInstance,
  MealTimeSnapshotIn,
} from 'entities/mealtime/@x/diary';
import {
  emptyNutrition,
  Nutrition,
  NutritionInstance,
} from 'entities/nutrition';
import { DateConvertable, getUTCDate, withSetPropAction } from 'shared/lib';

export const Diary = types
  .model('Diary', {
    id: types.identifier,
    date: types.optional(types.maybeNull(DateConvertable(getUTCDate)), null),
    mealtimes: types.optional(types.array(types.reference(MealTime)), []),
    nutrition_target: types.optional(Nutrition, emptyNutrition()),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    addMealTime: (mealTime: MealTimeInstance | MealTimeSnapshotIn) => {
      self.mealtimes.push(mealTime);
    },
  }))
  .views((self) => ({
    get mealTimeGroups() {
      const mealTimesByName = lodash.groupBy<MealTimeInstance>(
        self.mealtimes,
        'name',
      );
      return {
        breakfast: mealTimesByName.breakfast || [],
        dinner: mealTimesByName.dinner || [],
        lunch: mealTimesByName.lunch || [],
        snack: mealTimesByName.snack || [],
      } as Record<MealTimeNamesInstance, MealTimeInstance[]>;
    },
  }))
  .views((self) => ({
    get mealTimesGroupsNutritions() {
      return Object.fromEntries(
        Object.entries(self.mealTimeGroups).map(([mealTime, mealTimes]) => [
          mealTime,
          Nutrition.create(getNutritionFromMealTimes(mealTimes)),
        ]),
      ) as Record<MealTimeNamesInstance, NutritionInstance>;
    },
  }));

export type DiaryInstance = Instance<typeof Diary>;
export type DiarySnapshotIn = SnapshotIn<typeof Diary>;
export type DiarySnapshotOut = SnapshotOut<typeof Diary>;
