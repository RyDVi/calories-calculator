import { t as translate } from 'i18next';
import { getSnapshot, Instance, types } from 'mobx-state-tree';
import {
  createInfiniteQuery,
  createModelStore,
  createMutation,
} from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { CategoriesFilters } from 'entities/category';
import {
  createPaginated,
  createPaginatedElement,
  PaginationFilters,
  isBarCodeText,
  removeSpaces,
} from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import {
  loadProducts,
  loadProductsByBarcode,
  reportProductBug,
  saveProduct,
} from '../api/productApi';
import {
  Product,
  ProductSnapshotOut,
  ReportProductBug,
} from '../model/productModel';

export const ProductsQuery = createInfiniteQuery('ProductsQuery', {
  data: createPaginated(types.reference(Product)),
  request: types.compose(CategoriesFilters, PaginationFilters),
  onQueryMore({ data, query }) {
    query.data?.results.push(...data.results);
    if (query.data) {
      query.data.next = data.next;
      // query.data.previous = data.previous;
    }
  },
  endpoint({ signal, request, pagination }) {
    if (isBarCodeText(request.search)) {
      const promise = createPaginatedElement(
        loadProductsByBarcode(removeSpaces(request.search)!),
      );
      promise.catch((reason) => {
        // Я понимаю, что это очень плохой шаг, но mst-query не предоставляет возможности сделать побочное действие после завершения запроса.
        // Привязка useEffect к isLoading или isFetching даст некорректный результат (каждое обновление будет вызывать оповещение и это не связано с react, а именно с mst-query).
        // Когда-нибудь это вызовет проблему, но сейчас не до этого.
        if (reason?.status !== 404) return;
        enqueueSnackbar(
          translate('product_with_barcode_not_found', {
            barcode: request.search,
          }),
          {
            variant: 'error',
            autoHideDuration: 3000,
          },
        );
      });
      return promise;
    }
    return loadProducts({ ...request, ...pagination }, { signal });
  },
});

export const CreateProductMutation = createMutation('CreateProductMutation', {
  data: types.safeReference(Product),
  request: types.union(types.reference(Product), Product),
  endpoint({ request }) {
    return saveProduct(getSnapshot(request) as ProductSnapshotOut);
  },
});

export const ReportProductBugMutation = createMutation(
  'ReportProductBugMutation',
  {
    request: ReportProductBug,
    endpoint({ request }) {
      return reportProductBug(getSnapshot(request));
    },
  },
);

export const ProductStore = createModelStore('ProductStore', Product).props({
  productsQuery: types.optional(ProductsQuery, {}),
  createProductMutation: types.optional(CreateProductMutation, {}),
  reportProductBugMutation: types.optional(ReportProductBugMutation, {}),
});

type ProductStoreInstance = Instance<typeof ProductStore>;

export function useProductStore() {
  return useQueryStore().productStore as ProductStoreInstance;
}
