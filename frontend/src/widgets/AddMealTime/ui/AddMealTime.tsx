import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMutation, useQuery } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { ProductsListSelectWithFilter } from 'widgets/ProductsList';
import {
  MealTimeInstance,
  MealTimeNamesInstance,
  SaveMealTimeSnapshotIn,
  useMealTimeStore,
} from 'entities/mealtime';
import { useTranslate } from 'shared/i18n';
import { useMstError } from 'shared/lib';
import { ErrorAlert, FullPageLoader } from 'shared/ui';

export const AddMealTime: React.FC<{
  onAfterAddMealTime: (mealTime: MealTimeInstance) => void;
  mealTimeId: string;
  mealTimeName: MealTimeNamesInstance;
  diaryDate: string;
}> = observer(({ onAfterAddMealTime, mealTimeId, mealTimeName, diaryDate }) => {
  const translate = useTranslate();
  const mealTimeStore = useMealTimeStore();
  const {
    data: mealTime,
    isLoading,
    error,
    isFetched,
  } = useQuery(mealTimeStore.mealTimeQuery, {
    request: { id: mealTimeId, name: mealTimeName },
  });
  const [saveMealTimeMutation] = useMutation(
    mealTimeStore.saveMealTimeMutation,
  );

  const [saveError, setSaveError] = useMstError();

  const onAddMealTime = useCallback(
    async (saveMealTimeProps?: Partial<SaveMealTimeSnapshotIn>) => {
      const { data, error } = await saveMealTimeMutation({
        request: {
          ...mealTime,
          ...saveMealTimeProps,
          diary_date: diaryDate,
        },
      });
      setSaveError(error);
      if (error || !data) {
        enqueueSnackbar(
          translate('Произошла ошибка при добавлении приёма пищи!'),
          {
            variant: 'error',
            autoHideDuration: 5000,
          },
        );
        return;
      }
      onAfterAddMealTime(data);
    },
    [
      diaryDate,
      mealTime,
      onAfterAddMealTime,
      saveMealTimeMutation,
      setSaveError,
      translate,
    ],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {isLoading && <FullPageLoader />}
      {isFetched && <ErrorAlert sx={{ mb: 2 }} error={error || saveError} />}
      {mealTime && (
        <ProductsListSelectWithFilter
          onSelectProduct={(product) => {
            mealTime.setProp('product', product);
            onAddMealTime({ product_id: product.id });
          }}
        />
      )}
    </Box>
  );
});
