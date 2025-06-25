import { ImageSearch } from '@mui/icons-material';
import { CircularProgress, Fab, Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { getSnapshot } from 'mobx-state-tree';
import { useMutation } from 'mst-query';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { DiaryInstance } from 'entities/diary';
import { useMealTimeStore } from 'entities/mealtime';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { HiddenFileUploadInput } from 'shared/ui';

export const RecognizeProductFab: React.FC<{ diary: DiaryInstance }> = observer(
  ({ diary }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const mealTimeStore = useMealTimeStore();

    const [recognizeProductRequest, { isLoading: isRecognizingProduct }] =
      useMutation(mealTimeStore.recognizeProductMutation);

    const recognizeProduct = useCallback(
      async (base64Image: any) => {
        if (typeof base64Image !== 'string') {
          enqueueSnackbar(translate('Формат изображения некорректен'));
          return;
        }
        const key = enqueueSnackbar({
          variant: 'info',
          message: (
            <Stack spacing={3} direction="row">
              <span>Определение продкта...</span>
              <CircularProgress size="2rem" sx={{ marginLeft: '1rem' }} />
            </Stack>
          ),
          action: () => null,
        });
        let result: Awaited<ReturnType<typeof recognizeProductRequest>>;
        try {
          result = await recognizeProductRequest({ request: base64Image });
        } catch (err) {
          console.error(err);
          return;
        } finally {
          closeSnackbar(key);
        }
        if (result.error) {
          enqueueSnackbar({
            message: 'Не удалось распознать продукт',
            variant: 'error',
          });
          return;
        }

        if (result.data?.product) {
          const product = result.data.product;
          return navigate(paths.productNew({}), {
            state: {
              ...(getSnapshot(product) as any),
              unit: product.unit ? getSnapshot(product.unit) : null,
              category: product.category ? getSnapshot(product.category) : null,
              photo_back: base64Image,
            },
          });
        }
        if (result.data?.mealtime) {
          diary?.addMealTime(result.data.mealtime);
        }
        throw new Error('Произошла неожиданная ошибка. Отсутствуют данные.');
      },
      [diary, navigate, recognizeProductRequest, translate],
    );
    return (
      <Fab
        color="primary"
        title={translate('Сканировать штрих-код продукта')}
        sx={{
          position: 'absolute',
          right: 16,
          marginRight: '1rem',
          bottom:
            80 +
            (window as any).Telegram.WebApp.safeAreaInset.bottom +
            (window as any).Telegram.WebApp.contentSafeAreaInset.bottom,
        }}
        component="label"
        role={undefined}
        tabIndex={-1}
        disabled={isRecognizingProduct}
      >
        <ImageSearch />
        <HiddenFileUploadInput accept="image/*" onChange={recognizeProduct} />
      </Fab>
    );
  },
);
