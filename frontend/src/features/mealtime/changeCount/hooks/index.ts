import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { MealTimeSnapshotIn, useMealTimeStore } from 'entities/mealtime';
import { useStatisticsStore } from 'entities/statistics';
import { useTranslate } from 'shared/i18n';

export function useHandleChangeMealTime() {
  const translate = useTranslate();

  const statisticsStore = useStatisticsStore();

  const mealTimeStore = useMealTimeStore();
  const [saveMealTimeMutation] = useMutation(
    mealTimeStore.saveMealTimeMutation,
  );

  const handleChangeMealTime = useCallback(
    async (mealTime: MealTimeSnapshotIn) => {
      const { error } = await saveMealTimeMutation({
        request: mealTime,
        // optimisticResponse: {
        //   ...changedMealTime,
        //   diary: diaryStore.diaryQuery.data!.id,
        // },
      });
      statisticsStore.statistcsQuery.refetch();
      if (error) {
        enqueueSnackbar(
          `${translate('Не удалось обновить')} ${mealTime.product?.name}`,
          {
            variant: 'error',
            autoHideDuration: 3000,
          },
        );
      }
    },
    [saveMealTimeMutation, statisticsStore.statistcsQuery, translate],
  );

  return handleChangeMealTime;
}
