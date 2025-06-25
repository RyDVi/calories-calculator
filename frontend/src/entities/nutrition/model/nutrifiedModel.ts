import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { Category } from 'entities/category';
import { Unit } from 'entities/unit/model/unitModel';
import { Nutrition } from './nutritionModel';

const ImageModel = types.model('ImageModel', {
  image: types.maybeNull(types.string),
  tag: types.string,
});

export const NutrifiedModel = types.model('NutrifiedModel', {
  id: types.identifier,
  category: types.reference(Category),
  /**
   * Нутриентов на количество в одной единице продуктов. Например, на одну пачку печеньев
   */
  nutrition: Nutrition,
  unit: types.reference(Unit),
  images: types.maybe(types.array(ImageModel)),
  quantity: types.number,
  data_accepted: types.optional(types.boolean, false),
});

export type NutrifiedModelInstance = Instance<typeof NutrifiedModel>;
export type NutrifiedModelSnapshotIn = SnapshotIn<typeof NutrifiedModel>;
export type NutrifiendModelSnapshotOut = SnapshotOut<typeof NutrifiedModel>;
