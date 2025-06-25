import { buildApiUrl, makeRequest } from 'shared/api';
import { Paginated } from 'shared/lib';
import { WithPaginationFilters } from 'shared/lib/mst-query';
import {
  CategoriesFiltersSnapshotIn,
  CategorySnapshotIn,
} from '../model/categoryModel';

export const loadCategories = (
  filters: WithPaginationFilters<CategoriesFiltersSnapshotIn>,
  options?: any,
): Promise<Paginated<CategorySnapshotIn>> =>
  makeRequest(buildApiUrl('/categories', filters), options);
