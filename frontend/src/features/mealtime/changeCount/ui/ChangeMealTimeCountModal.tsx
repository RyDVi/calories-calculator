import { getSnapshot } from 'mobx-state-tree';
import { useCallback, useState } from 'react';
import { MealTimeInstance } from 'entities/mealtime';
import { useHandleChangeMealTime } from '../hooks/index';
import { EditMealTimeCountDialog } from './EditMealTimeCountDialog';

export const ChangeMealTimeCountModal: React.FC<{
  children: (
    openMealTimeCountChangeModal: (mealTime: MealTimeInstance) => void,
  ) => React.ReactNode;
}> = ({ children }) => {
  const [mealTime, setMealTime] = useState<MealTimeInstance | null>(null);
  const handleOpenMealTimeCountChangeModal = useCallback(
    (mealTime: MealTimeInstance) => {
      setMealTime(mealTime);
    },
    [],
  );

  const handleChangeMealTime = useHandleChangeMealTime();
  return (
    <>
      {children(handleOpenMealTimeCountChangeModal)}
      {mealTime && (
        <EditMealTimeCountDialog
          mealTime={mealTime}
          onClose={() => setMealTime(null)}
          onChange={({
            count,
            count_fractions_in_product,
            editType,
            countVariant,
          }) => {
            let newCount =
              countVariant === 'fraction'
                ? count / count_fractions_in_product!
                : count / mealTime.product!.quantity;

            if (editType === 'add') {
              newCount = mealTime.count + newCount;
            } else if (editType === 'sub') {
              newCount = mealTime.count - newCount;
            } else if (editType === 'set') {
              // nothing
            }
            setMealTime(null);
            handleChangeMealTime({
              ...getSnapshot(mealTime),
              count_fractions_in_product,
              count: newCount,
            });
          }}
        />
      )}
    </>
  );
};
