import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { useTranslate } from 'shared/i18n';
import {
  LinkToCreateNewProduct,
  LinkToCreateNewProductProps,
} from './LinkToCreateNewProduct';

export const LinkFabToCreateNewProduct: React.FC<
  PropsWithChildren<LinkToCreateNewProductProps>
> = (props) => {
  const translate = useTranslate();
  return (
    <LinkToCreateNewProduct {...props}>
      <Fab
        color="primary"
        title={translate('Добавить новый продукт или рецепт')}
        sx={{
          position: 'absolute',
          right: 16,
          marginRight: '1rem',
          bottom:
            80 +
            (window as any).Telegram.WebApp.safeAreaInset.bottom +
            (window as any).Telegram.WebApp.contentSafeAreaInset.bottom,
        }}
      >
        <AddIcon />
      </Fab>
    </LinkToCreateNewProduct>
  );
};
