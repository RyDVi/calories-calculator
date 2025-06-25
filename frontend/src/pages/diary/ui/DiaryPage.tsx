import { Analytics } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useQuery } from 'mst-query';
import { RefCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { DiaryMealTimes } from 'widgets/DiaryMealTimes';
import { StatisticsDayCard } from 'widgets/StatisticsDayCard';
import { RecognizeProductFab } from 'features/mealtime/regognizeProduct';
import { UpdateDiaryTargetToDefaultButton } from 'features/nutrition/updateDiaryTargetToDefault';
import { DiaryDatePicker, useDiaryStore } from 'entities/diary';
import { emptyNutrition, Nutrition } from 'entities/nutrition';
import { useStatisticsStore } from 'entities/statistics';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { nextDay, prevDay, getUTCDate } from 'shared/lib';
import { useOverrideShell } from 'shared/providers';
import { ErrorAlert, FullPageLoader } from 'shared/ui';

const DiaryPage = observer(() => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const { diary_date } = useParams<Parameters<typeof paths.diaryDetail>[0]>();
  const diaryStore = useDiaryStore();
  const statisticsStore = useStatisticsStore();
  const {
    data: selectedDiary,
    isLoading,
    error,
    isFetched,
  } = useQuery(diaryStore.diaryQuery, {
    request: { date: new Date(diary_date!), fetchTargetOn404: true },
  });

  const { data: targetDiary } = useQuery(diaryStore.targetDiaryQuery, {
    refetchOnChanged: 'none',
    refetchOnMount: 'never',
  });

  const { data: dayStatistics } = useQuery(statisticsStore.statistcsQuery, {
    request: {
      date_to: diary_date!,
      date_from: diary_date!,
      data_slice: 'daily',
    },
  });

  useOverrideShell({
    title: translate('Дневник калорий'),
    backAction: null,
    actions: (
      <>
        <DiaryDatePicker
          date={diary_date!}
          onChange={(date) =>
            navigate(paths.diaryDetail({ diary_date: date }), {
              viewTransition: true,
            })
          }
        />
        <Box sx={{ ml: 'auto' }} />
        <IconButton component={Link} to={paths.statistics({})} viewTransition>
          <Analytics />
        </IconButton>
      </>
    ),
  });

  const { ref } = useSwipeable({
    delta: 100,
    onSwipedLeft: () =>
      navigate(
        paths.diaryDetail({
          diary_date: getUTCDate(nextDay(new Date(diary_date!))),
        }),
        { viewTransition: true },
      ),
    onSwipedRight: () =>
      navigate(
        paths.diaryDetail({
          diary_date: getUTCDate(prevDay(new Date(diary_date!))),
        }),
        { viewTransition: true },
      ),
  }) as { ref: RefCallback<Document> };
  useEffect(() => {
    ref(document);
    return () => ref({} as any);
  }, [ref]);

  if (isLoading || !selectedDiary) {
    return <FullPageLoader />;
  }
  if (!isFetched && error) {
    return <ErrorAlert error={error} />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <StatisticsDayCard
        nutrition={
          dayStatistics?.summary_nutrition || Nutrition.create(emptyNutrition())
        }
        nutritionTarget={
          selectedDiary?.nutrition_target || Nutrition.create(emptyNutrition())
        }
      />
      {targetDiary && (
        <UpdateDiaryTargetToDefaultButton
          selectedDiary={selectedDiary}
          targetDiary={targetDiary}
        />
      )}
      <DiaryMealTimes diary={selectedDiary} />
      <RecognizeProductFab diary={selectedDiary} />
    </Box>
  );
});

export default DiaryPage;
