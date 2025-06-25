import { Instance, types } from 'mobx-state-tree';
import { createInfiniteQuery, createModelStore } from 'mst-query';

import { createPaginated, PaginationFilters } from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import { loadCategories } from '../api/categoryApi';
import { CategoriesFilters, Category } from '../model/categoryModel';

const CategoriesQuery = createInfiniteQuery('CategoriesQuery', {
  data: createPaginated(types.reference(Category)),
  request: types.compose(CategoriesFilters, PaginationFilters),
  onQueryMore({ data, query }) {
    query.data?.results.push(...data.results);
    if (query.data) {
      query.data.next = data.next;
      // query.data.previous = data.previous;
    }
  },
  endpoint({ signal, request, pagination }) {
    return loadCategories({ ...request, ...pagination }, { signal });
  },
});

export const CategoryStore = createModelStore('CategoryStore', Category).props({
  categoriesQuery: types.optional(CategoriesQuery, {}),
});

type CategoryStoreInstance = Instance<typeof CategoryStore>;

export function useCategoryStore() {
  return useQueryStore().categoryStore as CategoryStoreInstance;
}
