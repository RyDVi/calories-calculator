import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { getSnapshot } from 'mobx-state-tree';
import { MealTimeInstance } from 'entities/mealtime';
import { useHandleChangeMealTime } from '../hooks';

export const AddCountMealTimeButton: React.FC<{
  mealTime: MealTimeInstance;
}> = observer(({ mealTime }) => {
  const handleChangeMealTime = useHandleChangeMealTime();

  return (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        return handleChangeMealTime({
          ...getSnapshot(mealTime as any),
          count: mealTime.count + 1,
        });
      }}
    >
      <AddCircleOutlineIcon />
    </IconButton>
  );
});
