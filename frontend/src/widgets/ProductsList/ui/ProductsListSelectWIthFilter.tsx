import { Box } from '@mui/material';

import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { ProductInstance } from 'entities/product';
import { useProductFilters } from '../hooks/productsUrlQuery';
import { ProductsFilters } from './ProductsFilter';
import { ProductsList } from './ProductsListSelect';

export const ProductsListSelectWithFilter: React.FC<{
  onSelectProduct: (product: ProductInstance) => void;
}> = observer(({ onSelectProduct }) => {
  const [productFilters, upsertQuery, setUrlQuery] = useProductFilters();
  const debouncedSetFilters = useMemo(
    () => debounce(setUrlQuery, 500),
    [setUrlQuery],
  );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ProductsFilters
        filters={productFilters}
        onChange={debouncedSetFilters}
      />
      <ProductsList
        filters={productFilters}
        pagination={productFilters}
        onSelectProduct={onSelectProduct}
        onChangePage={(page) => upsertQuery({ page })}
      />
    </Box>
  );
});
