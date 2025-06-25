import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';
import React, { useCallback } from 'react';
import { DiaryInstance } from 'entities/diary';
import { MealTimeNamesInstance, useMealTimeStore } from 'entities/mealtime';
import { useTranslate } from 'shared/i18n';

export const PasteMealTimeButton: React.FC<{
  diary: DiaryInstance;
  mealTimeName: MealTimeNamesInstance;
}> = observer(({ diary, mealTimeName }) => {
  const translate = useTranslate();
  const { pasteMealTime, copiedMealTime } = useMealTimeStore();

  const handlePasteMealTime = useCallback(async () => {
    const { error } = await pasteMealTime(diary, mealTimeName);
    if (error) {
      enqueueSnackbar(
        translate('Произошла ошибка при добавлении приёма пищи!'),
        {
          variant: 'error',
          autoHideDuration: 2000,
        },
      );
      return;
    }
    enqueueSnackbar(translate('Приём пищи добавлен!'), {
      variant: 'success',
      autoHideDuration: 2000,
    });
  }, [diary, mealTimeName, pasteMealTime, translate]);

  if (!copiedMealTime) return null;

  return (
    <IconButton edge="end" onClick={handlePasteMealTime}>
      <ContentPasteIcon />
    </IconButton>
  );
});
