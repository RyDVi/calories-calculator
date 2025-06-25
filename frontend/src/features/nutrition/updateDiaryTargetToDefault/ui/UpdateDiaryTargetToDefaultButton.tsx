import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { DiaryInstance } from 'entities/diary';
import {
  SaveNutritionSnapshotIn,
  useNutritionsStore,
} from 'entities/nutrition';
import { useTranslate } from 'shared/i18n';

export const UpdateDiaryTargetToDefaultButton: React.FC<{
  targetDiary: DiaryInstance;
  selectedDiary: DiaryInstance;
}> = observer(({ targetDiary, selectedDiary }) => {
  const translate = useTranslate();
  const nutritionsStore = useNutritionsStore();

  const [saveNutritionMutation] = useMutation(
    nutritionsStore.saveNutritionMutation,
  );

  const handleUpdateDiaryTargetNutritionToDefault = useCallback(async () => {
    const nutrition: SaveNutritionSnapshotIn = {
      ...getSnapshot(targetDiary.nutrition_target),
      id: selectedDiary.nutrition_target.id!,
    };
    const { data, error } = await saveNutritionMutation({
      request: nutrition,
    });
    if (error) {
      enqueueSnackbar(translate('Не удалось обновить дневник'), {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } else {
      applySnapshot(selectedDiary.nutrition_target, data);
    }
  }, [saveNutritionMutation, selectedDiary, targetDiary, translate]);

  if (
    targetDiary.nutrition_target.isEqual(
      // хак. обновляет данные после нажатия кнопки
      getSnapshot(selectedDiary.nutrition_target),
    )
  ) {
    return null;
  }

  return (
    <Button
      onClick={handleUpdateDiaryTargetNutritionToDefault}
      variant="contained"
      sx={{ my: 1 }}
    >
      {translate('Обновить цель до текущей')}
    </Button>
  );
});
