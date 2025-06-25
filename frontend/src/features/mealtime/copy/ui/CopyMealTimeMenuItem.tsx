import { MenuItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { MealTimeInstance, useMealTimeStore } from 'entities/mealtime';
import { useTranslate } from 'shared/i18n';

export const CopyMealTimeMenuItem: React.FC<{
  mealTime: MealTimeInstance;
}> = observer(({ mealTime }) => {
  const translate = useTranslate();

  const mealTimeStore = useMealTimeStore();

  const handleCopyMealTime = useCallback(() => {
    mealTimeStore.copyMealTime(mealTime);
    enqueueSnackbar(translate('Приём пищи скопирован!'), {
      variant: 'success',
      autoHideDuration: 2000,
    });
  }, [mealTime, mealTimeStore, translate]);

  return (
    <MenuItem onClick={handleCopyMealTime}>
      {translate('Скопировать приём пищи')}
    </MenuItem>
  );
});
