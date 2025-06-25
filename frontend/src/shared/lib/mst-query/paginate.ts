import {
  IAnyModelType,
  Instance,
  IReferenceType,
  SnapshotIn,
  SnapshotOut,
  types,
} from 'mobx-state-tree';
import { Paginated } from '../page';

export const PaginationFilters = types.model('Pagination', {
  page: types.optional(types.number, 1),
  page_size: types.optional(types.number, 25),
});
export type PaginationInstance = Instance<typeof PaginationFilters>;
export type PaginationSnapshotIn = SnapshotIn<typeof PaginationFilters>;
export type PaginationSnapshotOut = SnapshotOut<typeof PaginationFilters>;

export type WithPaginationFilters<T> = T & Partial<PaginationSnapshotIn>;

export const createPaginated = <T extends IAnyModelType>(
  dataType: T | IReferenceType<T>,
) =>
  types.model(dataType.name + '_paginated', {
    results: types.optional(types.array(dataType), []),
    count: types.number,
    // next: types.maybeNull(types.string),
    previous: types.maybeNull(types.string),
    next: types.maybeNull(types.string),
  });

export const createPaginatedElement = async <T>(
  element: T | Promise<T>,
): Promise<Paginated<T>> => {
  const result = await element;
  return {
    count: 1,
    results: [result],
  };
};
