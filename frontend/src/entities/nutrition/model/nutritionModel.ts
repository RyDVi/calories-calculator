import {
  getSnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import * as uuid from 'uuid';

export const Nutrition = types
  .model('Nutrition', {
    id: types.maybe(types.string),
    protein: types.number,
    fat: types.number,
    carbohydrates: types.number,
  })
  .views((self) => ({
    get calories() {
      return calculateCalories(getSnapshot(self));
    },
  }))
  .views((self) => ({
    get with_prefix() {
      return (prefix = '') => ({
        [`${prefix}protein`]: self.protein,
        [`${prefix}fat`]: self.fat,
        [`${prefix}carbohydrates`]: self.carbohydrates,
        [`${prefix}calories`]: self.calories,
      });
    },
  }))
  .actions((self) => ({
    isEqual: (nutrition: NutritionInstance | NutritionSnapshotIn) =>
      (
        ['carbohydrates', 'fat', 'protein'] as (keyof NutritionSnapshotIn)[]
      ).every((key) => self[key] === nutrition[key]),
  }));

export type NutritionInstance = Instance<typeof Nutrition>;
export type NutritionSnapshotIn = SnapshotIn<typeof Nutrition>;
export type NutritionSnapshotOut = SnapshotOut<typeof Nutrition>;

export const SaveNutrition = types.compose(
  'SaveNutrition',
  Nutrition,
  types.model({
    id: types.string,
  }),
);

export type SaveNutritionInstance = Instance<typeof SaveNutrition>;
export type SaveNutritionSnapshotIn = SnapshotIn<typeof SaveNutrition>;
export type SaveNutritionSnapshotOut = SnapshotOut<typeof SaveNutrition>;

export const emptyNutrition = (): NutritionSnapshotIn => ({
  id: uuid.v4(),
  protein: 0,
  carbohydrates: 0,
  fat: 0,
});

export const calculateCalories = ({
  carbohydrates = 0,
  fat = 0,
  protein = 0,
}: any) => protein * 4 + fat * 9 + carbohydrates * 4;

/**
 * Перерасчёт БЖУ из указанного количества (fromCount) в указанное (count)
 */
export function calculateNutritionToCount(
  nutrition: NutritionSnapshotIn,
  count: number,
  fromCount = 100,
) {
  const factor = count / fromCount;
  return {
    protein: nutrition.protein * factor,
    fat: nutrition.fat * factor,
    carbohydrates: nutrition.carbohydrates * factor,
  };
}
