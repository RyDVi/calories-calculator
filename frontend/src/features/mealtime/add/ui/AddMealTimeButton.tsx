import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MealTimeNamesInstance } from 'entities/mealtime';
import { paths } from 'shared/consts';

export const AddMealTimeButton: React.FC<{
  diaryDate: string;
  mealTimeName: MealTimeNamesInstance;
}> = observer(({ diaryDate, mealTimeName }) => {
  const navigate = useNavigate();

  const handleAddMealTime = useCallback(
    async () =>
      navigate(
        paths.mealTimeEdit({
          meal_time_id: 'new',
          diary_date: diaryDate,
          meal_time_name: mealTimeName,
        }),
        { viewTransition: true },
      ),
    [diaryDate, mealTimeName, navigate],
  );
  return (
    <IconButton edge="end" onClick={handleAddMealTime}>
      <AddCircleIcon />
    </IconButton>
  );
});
