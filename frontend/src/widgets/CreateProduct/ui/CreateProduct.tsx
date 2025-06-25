import { Box } from '@mui/material';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import {
  ProductInstance,
  ProductSnapshotIn,
  useProductStore,
} from 'entities/product';
import { useTranslate } from 'shared/i18n';
import { useMstError } from 'shared/lib';
import { ErrorAlert, FullPageLoader } from 'shared/ui';
import { CreateProductForm } from './CreateProductForm';

export const CreateProduct: React.FC<{
  onAfterCreateProduct: (product: ProductInstance) => void;
  initialData?: Partial<ProductSnapshotIn>;
}> = ({ onAfterCreateProduct, initialData }) => {
  const translate = useTranslate();

  const productStore = useProductStore();
  const [
    createUpdateProduct,
    { isLoading: isMutatingProduct, error: createProductError },
  ] = useMutation(productStore.createProductMutation);

  const [error, setError] = useMstError();

  const handleCreateUpdateProduct = useCallback(
    async (product: ProductSnapshotIn) => {
      const { data, error } = await createUpdateProduct({
        request: product,
      });
      setError(error);
      if (error || !data) {
        enqueueSnackbar(translate('Не удалось создать продукт'), {
          variant: 'error',
          autoHideDuration: 2000,
          hideIconVariant: true,
        });
        return;
      }
      onAfterCreateProduct(data);
    },
    [createUpdateProduct, onAfterCreateProduct, setError, translate],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isMutatingProduct && <FullPageLoader />}
      <ErrorAlert error={createProductError || error} />
      <CreateProductForm
        onSubmit={handleCreateUpdateProduct}
        initialData={initialData}
      />
    </Box>
  );
};
