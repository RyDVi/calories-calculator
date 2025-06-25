import { buildApiUrl, makeRequest } from 'shared/api';
import {
  StatisticsFiltersSnapshotOut,
  StatisticsSnapshotIn,
} from '../model/statisticsModel';

export const loadNutritionStatistics = (
  filters: StatisticsFiltersSnapshotOut,
  options?: any,
): Promise<StatisticsSnapshotIn> =>
  makeRequest(buildApiUrl('/nutrition_statistics', filters), options);
