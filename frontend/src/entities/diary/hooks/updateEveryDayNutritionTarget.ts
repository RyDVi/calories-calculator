import { useCallback } from 'react';
import { NutritionInstance } from 'entities/nutrition';
import { DiaryInstance } from '../model/diaryModel';
import { useUpdateDiary } from './updateDiary';

export function useSetEveryDayNutritionTarget(diary?: DiaryInstance | null) {
  const [updateProfile, isLoading, error] = useUpdateDiary(diary);

  const updateNutritionTarget = useCallback(
    (nutritionTarget: NutritionInstance) =>
      updateProfile({ nutrition_target: nutritionTarget }),
    [updateProfile],
  );
  return [updateNutritionTarget, isLoading, error] as const;
}
