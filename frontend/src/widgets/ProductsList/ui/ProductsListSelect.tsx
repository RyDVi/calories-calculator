import NoFoodIcon from '@mui/icons-material/NoFood';
import { Box, CircularProgress, List } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useInfiniteQuery } from 'mst-query';
import React from 'react';
import {
  ProductInstance,
  ProductListItem,
  ProductsFiltersSnapshotOut,
  useProductStore,
} from 'entities/product';
import {
  isBarCodeText,
  isValidEAN,
  PaginationSnapshotOut,
  useOnScollToEnd,
} from 'shared/lib';
import { useShellContext } from 'shared/providers';
import { ErrorAlert, NotFound } from 'shared/ui';

export const ProductsList: React.FC<{
  filters: ProductsFiltersSnapshotOut;
  pagination: Required<PaginationSnapshotOut>;
  onSelectProduct: (product: ProductInstance) => void;
  onChangePage: (page: number) => void;
}> = observer(({ filters, onSelectProduct, onChangePage, pagination }) => {
  const productStore = useProductStore();
  const isBarcode = isBarCodeText(filters.search);

  const {
    data: products,
    isLoading: isLoadingProducts,
    isFetchingMore,
    isFetched,
    error,
  } = useInfiniteQuery(productStore.productsQuery, {
    request: filters,
    pagination: pagination,
    enabled: isBarcode ? isValidEAN(filters.search) : true,
  });

  const { pageContainer } = useShellContext();
  useOnScollToEnd(
    {
      data: products,
      isLoading: isLoadingProducts,
      scollableContainer: pageContainer,
    },
    () => onChangePage(pagination.page + 1),
  );

  const isLoading =
    isLoadingProducts ||
    isFetchingMore ||
    (!products?.results.length && error?.name === 'AbortError');

  return (
    <List>
      {isFetched && error && <ErrorAlert error={error} />}
      {!isLoading && !products?.results?.length && (
        <NotFound icon={<NoFoodIcon fontSize="large" />} />
      )}
      {products?.results.map((product) => (
        <ProductListItem
          key={product.id}
          product={product}
          onClick={() => onSelectProduct(product)}
        />
      ))}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '5rem',
        }}
      >
        {isLoading && <CircularProgress />}
      </Box>
    </List>
  );
});
