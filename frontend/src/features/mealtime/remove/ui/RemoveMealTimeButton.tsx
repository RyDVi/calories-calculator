import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { MealTimeInstance, useMealTimeStore } from 'entities/mealtime';
import { useStatisticsStore } from 'entities/statistics';
import { useTranslate } from 'shared/i18n';

export const RemoveMealTimeButton: React.FC<{ mealTime: MealTimeInstance }> =
  observer(({ mealTime }) => {
    const translate = useTranslate();

    const statisticsStore = useStatisticsStore();

    const mealTimeStore = useMealTimeStore();
    const [removeMealTimeMutation] = useMutation(
      mealTimeStore.removeMealTimeMutation,
    );

    const handleRemoveMealTime = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const productName = mealTime.product?.fullName || '';
        const { error } = await removeMealTimeMutation({
          request: mealTime.id,
        });
        statisticsStore.statistcsQuery.refetch();
        if (error) {
          enqueueSnackbar(`${translate('Не удалось удалить')} ${productName}`, {
            variant: 'error',
            autoHideDuration: 5000,
          });
          return;
        }
        enqueueSnackbar(`${translate('Удалён приём пищи')} ${productName}`, {
          variant: 'success',
          autoHideDuration: 5000,
        });
      },
      [
        mealTime.id,
        mealTime.product?.fullName,
        removeMealTimeMutation,
        statisticsStore.statistcsQuery,
        translate,
      ],
    );
    if (mealTime.count > 1) return null;
    return (
      <IconButton onClick={handleRemoveMealTime}>
        <DeleteIcon />
      </IconButton>
    );
  });
