import SearchIcon from '@mui/icons-material/Search';
import { Box, Paper } from '@mui/material';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { ProductsFiltersSnapshotIn } from 'entities/product';
import { useTranslate } from 'shared/i18n';
import { SearchTextField } from 'shared/ui';

export const ProductsFilters: React.FC<{
  filters: ProductsFiltersSnapshotIn;
  onChange: (filters: ProductsFiltersSnapshotIn) => void;
}> = observer(({ onChange, filters }) => {
  const translate = useTranslate();
  return (
    <Paper
      sx={{
        position: 'sticky',
        top: -16,
        paddingTop: '16px',
        bgcolor: 'palette.background.paper',
        zIndex: 1,
      }}
      elevation={0}
    >
      <SearchTextField
        fullWidth
        label={translate('Поиск продукта по названию или штрих-коду')}
        defaultValue={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.currentTarget.value })
        }
        InputProps={{
          placeholder: translate('Введите название или штрих-код продукта'),
          startAdornment: (
            <Box sx={{ paddingRight: 1, paddingTop: 0.5 }}>
              <SearchIcon />
            </Box>
          ),
        }}
      />
    </Paper>
  );
});
