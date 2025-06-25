import { buildApiUrl, makeCreateUpdateRequest, makeRequest } from 'shared/api';
import { Paginated, WithPaginationFilters } from 'shared/lib';
import {
  ProductsFiltersSnapshotIn,
  ProductSnapshotIn,
  ProductSnapshotOut,
  ReportProductBugSnapshotIn,
} from '../model/productModel';

export const loadProducts = (
  filters: WithPaginationFilters<ProductsFiltersSnapshotIn>,
  options?: any,
): Promise<Paginated<ProductSnapshotIn>> =>
  makeRequest(buildApiUrl('/products', filters), options);

export const loadProductsByBarcode = (
  barcode: string,
  options?: any,
): Promise<ProductSnapshotIn> =>
  makeRequest(
    buildApiUrl('/products/get_product_by_barcode/', { barcode }),
    options,
  );

export const saveProduct = makeCreateUpdateRequest<
  ProductSnapshotIn,
  ProductSnapshotOut
>('/products');

export const reportProductBug = (
  reportProductBug: ReportProductBugSnapshotIn,
): Promise<void> =>
  makeRequest(buildApiUrl(`/products/${reportProductBug.product}/report_bug`), {
    body: JSON.stringify(reportProductBug),
    method: 'POST',
  });
