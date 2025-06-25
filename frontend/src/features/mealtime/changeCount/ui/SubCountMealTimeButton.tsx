import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { getSnapshot } from 'mobx-state-tree';
import { MealTimeInstance } from 'entities/mealtime';
import { useHandleChangeMealTime } from '../hooks';

export const SubCountMealTimeButton: React.FC<{
  mealTime: MealTimeInstance;
}> = observer(({ mealTime }) => {
  const handleChangeMealTime = useHandleChangeMealTime();

  if (mealTime.count <= 1) return null;

  return (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        return handleChangeMealTime({
          ...getSnapshot(mealTime as any),
          count: mealTime.count - 1,
        });
      }}
    >
      <RemoveCircleOutlineIcon />
    </IconButton>
  );
});
