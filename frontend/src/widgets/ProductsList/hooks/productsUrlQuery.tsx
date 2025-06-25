import { ProductsFiltersSnapshotOut } from 'entities/product';
import { PaginationSnapshotOut, useUrlQueryFilters } from 'shared/lib';

export function useProductFilters() {
  return useUrlQueryFilters<
    ProductsFiltersSnapshotOut & PaginationSnapshotOut,
    ProductsFiltersSnapshotOut & PaginationSnapshotOut
  >({
    replace: true,
    defaultQuery: {
      page: '1',
      page_size: '25',
      search: '',
    },
    fromQueryToFilters: (urlQuery) => ({
      search: urlQuery.search || '',
      page: Number(urlQuery.page) || 1,
      page_size: Number(urlQuery.page_size) || 25,
    }),
  });
}
