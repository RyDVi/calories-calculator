import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { Dictionary } from 'entities/dictionary/@x/category';

export const Category = types.compose(
  'Category',
  Dictionary,
  types.model({
    priority: types.integer,
  }),
);

export type CategoryInstance = Instance<typeof Category>;
export type CategorySnapshotIn = SnapshotIn<typeof Category>;
export type CategorySnapshotOut = SnapshotOut<typeof Category>;

export const CategoriesFilters = types.model({
  search: types.optional(types.string, ''),
});

export type CategoriesFiltersInstance = Instance<typeof CategoriesFilters>;
export type CategoriesFiltersSnapshotIn = SnapshotIn<typeof CategoriesFilters>;
export type CategoriesFiltersSnapshotOut = SnapshotOut<
  typeof CategoriesFilters
>;
