import { Box } from '@mui/material';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import {
  ReportProductBugForm,
  ReportProductBugInstance,
  ReportProductBugSnapshotIn,
  useProductStore,
} from 'entities/product';
import { useTranslate } from 'shared/i18n';
import { useMstError } from 'shared/lib';
import { ErrorAlert, FullPageLoader } from 'shared/ui';

export const SendBugForProduct: React.FC<{
  productId: string;
  onAfterSendBugForProduct: (productBug: ReportProductBugInstance) => void;
}> = ({ productId, onAfterSendBugForProduct }) => {
  const translate = useTranslate();

  const productStore = useProductStore();
  const [
    sendBugForProduct,
    { isLoading: isMutatingSendBugForProduct, error: sendBugForProductError },
  ] = useMutation(productStore.reportProductBugMutation);

  const [error, setError] = useMstError();
  const handleReportProductBug = useCallback(
    async (report: Omit<ReportProductBugSnapshotIn, 'product'>) => {
      const { data, error } = await sendBugForProduct({
        request: { ...report, product: productId },
      });
      setError(error);
      if (error || !data) {
        enqueueSnackbar(translate('Не удалось отправить сообщение об ошибке'), {
          variant: 'error',
          autoHideDuration: 2000,
          hideIconVariant: true,
        });
        return;
      }
      enqueueSnackbar(translate('Сообщение об ошибке доставлено'), {
        variant: 'success',
        autoHideDuration: 2000,
        hideIconVariant: true,
      });
      onAfterSendBugForProduct(data);
    },
    [
      sendBugForProduct,
      productId,
      setError,
      translate,
      onAfterSendBugForProduct,
    ],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isMutatingSendBugForProduct && <FullPageLoader />}
      <ErrorAlert error={sendBugForProductError || error} />
      <ReportProductBugForm onSubmit={handleReportProductBug} />
    </Box>
  );
};
