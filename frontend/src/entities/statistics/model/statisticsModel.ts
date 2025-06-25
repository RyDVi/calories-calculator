import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { Nutrition } from 'entities/nutrition';
import { getUTCDate, UTCDate } from 'shared/lib';

export const NutritionStatisticsSlice = types.model(
  'NutritionStatisticsSlice',
  {
    summary_nutrition: Nutrition,
    target_nutrition: Nutrition,
  },
);

export const DateRange = types
  .model('DateRange', {
    start: UTCDate,
    end: UTCDate,
  })
  .views((self) => ({
    get utcRange() {
      const utcStart = getUTCDate(self.start);
      const utcEnd = getUTCDate(self.end);
      if (utcStart === utcEnd) return utcStart;
      return `${utcStart} - ${utcEnd}`;
    },
  }));

export const NutritionStatistics = types
  .compose(
    'NutritionStatistics',
    NutritionStatisticsSlice,
    types.model({
      data_slices: types.array(
        types.compose(
          NutritionStatisticsSlice,
          types.model({
            dates: DateRange,
          }),
        ),
      ),
    }),
  )
  .views((self) => ({
    get dataset() {
      return self.data_slices.map((sliceData) => ({
        dates: sliceData.dates.utcRange,
        ...sliceData.target_nutrition.with_prefix('target_'),
        ...sliceData.summary_nutrition.with_prefix('summary_'),
      }));
    },
  }));

export type StatisticsInstance = Instance<typeof NutritionStatistics>;
export type StatisticsSnapshotIn = SnapshotIn<typeof NutritionStatistics>;
export type StsatisticsSnapshotOut = SnapshotOut<typeof NutritionStatistics>;

export const PFC_DATA_SLICE = ['daily', 'weekly', 'monthly'] as const;
export type PFCDataSliceVariants = (typeof PFC_DATA_SLICE)[number];

export const StatisticsFilters = types.model('StatisticsFilters', {
  date_from: UTCDate,
  date_to: UTCDate,
  data_slice: types.enumeration(PFC_DATA_SLICE),
  series: types.optional(types.string, ''),
});

export type StatisticsFiltersInstance = Instance<typeof StatisticsFilters>;
export type StatisticsFiltersSnapshotIn = SnapshotIn<typeof StatisticsFilters>;
export type StatisticsFiltersSnapshotOut = SnapshotOut<
  typeof StatisticsFilters
>;

export type PFCSeriesType = 'fat' | 'protein' | 'carbohydrates' | 'calories';
export type StatistictsFiltersType = Omit<
  StatisticsFiltersSnapshotIn,
  'series' | 'date_from' | 'date_to'
> & { series: PFCSeriesType[]; date_from: string; date_to: string };
