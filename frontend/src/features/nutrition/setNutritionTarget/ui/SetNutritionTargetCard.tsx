import { observer } from 'mobx-react-lite';
import { useQuery } from 'mst-query';
import { useDiaryStore, useSetEveryDayNutritionTarget } from 'entities/diary';
import { ErrorAlert, FullPageLoader } from 'shared/ui';
import { EveryDayNutrtitionTargetCard } from './NutritionTargetCard';

export const SetEveryDayNutirtionTargetCard: React.FC = observer(() => {
  const diaryStore = useDiaryStore();
  const {
    data: diary,
    isLoading,
    error,
    isFetched,
  } = useQuery(diaryStore.diaryQuery, {
    request: { date: null },
  });
  const [
    setEveryDayNutritionTarget,
    isMutatingEveryDayNutritionTarget,
    mutationEveryDayNutritionTargetError,
  ] = useSetEveryDayNutritionTarget(diary);

  if (isLoading || isMutatingEveryDayNutritionTarget) {
    return <FullPageLoader />;
  }

  if ((isFetched && error) || !diary) {
    return <ErrorAlert error={error} />;
  }

  return (
    <>
      {mutationEveryDayNutritionTargetError &&
        !isMutatingEveryDayNutritionTarget && <ErrorAlert />}
      <EveryDayNutrtitionTargetCard
        everyDayNutritionTarget={diary.nutrition_target}
        onSubmit={setEveryDayNutritionTarget}
      />
    </>
  );
});
