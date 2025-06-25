import { getSnapshot, Instance, types } from 'mobx-state-tree';
import { createModelStore, createQuery } from 'mst-query';
import { useQueryStore } from 'shared/providers';
import { loadNutritionStatistics } from '../api/statisticsApi';
import {
  NutritionStatistics,
  StatisticsFilters,
} from '../model/statisticsModel';

export const StatisticsQuery = createQuery('StatisticsQuery', {
  data: NutritionStatistics,
  request: StatisticsFilters,
  endpoint({ request, signal }) {
    return loadNutritionStatistics(getSnapshot(request), { signal });
  },
});

export const StatisticsStore = createModelStore(
  'StatisticsStore',
  NutritionStatistics,
).props({
  statistcsQuery: types.optional(StatisticsQuery, {}),
});

type StatisticsStoreInstance = Instance<typeof StatisticsStore>;

export function useStatisticsStore() {
  return useQueryStore().statisticsStore as StatisticsStoreInstance;
}
