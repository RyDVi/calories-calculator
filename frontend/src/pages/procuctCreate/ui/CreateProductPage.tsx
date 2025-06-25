import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { CreateProduct } from 'widgets/CreateProduct';
import { ProductInstance } from 'entities/product';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { safeUri, useUrlQueryFilters } from 'shared/lib';
import { useOverrideShell } from 'shared/providers';

const CreateProductPage = observer(() => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const [filters] = useUrlQueryFilters<{
    redirect_uri?: string;
    barcode?: string;
  }>({
    defaultQuery: {
      redirect_uri: '',
      barcode: '',
    },
    fromQueryToFilters: (query) => ({
      ...query,
      redirect_uri: safeUri(query.redirect_uri),
    }),
  });
  const { state } = useLocation();

  useOverrideShell({
    backAction: filters.redirect_uri || paths.diary({}),
    actions: null,
    title: translate('Создание продукта'),
  });

  const handleAfterCreateProduct = useCallback(
    (data: ProductInstance) => {
      if (filters.redirect_uri) {
        return navigate(
          filters.redirect_uri +
            '?' +
            new URLSearchParams({
              search: data.barcode || data.name,
              product_id: data.id,
            }).toString(),
          { viewTransition: true },
        );
      }
      navigate(paths.diary({}), { viewTransition: true });
    },
    [navigate, filters.redirect_uri],
  );

  return (
    <CreateProduct
      onAfterCreateProduct={handleAfterCreateProduct}
      initialData={{ ...state, barcode: filters.barcode || state?.barcode }}
    />
  );
});

export default CreateProductPage;
