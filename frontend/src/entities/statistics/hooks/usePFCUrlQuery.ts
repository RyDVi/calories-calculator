import { subDays } from 'date-fns';
import { getUTCDate, useUrlQueryFilters } from 'shared/lib';
import {
  PFC_DATA_SLICE,
  PFCDataSliceVariants,
  PFCSeriesType,
  StatisticsFiltersSnapshotOut,
  StatistictsFiltersType,
} from '../model/statisticsModel';

export function usePFCFilters() {
  return useUrlQueryFilters<
    StatisticsFiltersSnapshotOut,
    StatistictsFiltersType
  >({
    replace: true,
    defaultQuery: {
      date_from: getUTCDate(subDays(new Date(), 6)),
      date_to: getUTCDate(new Date()),
      data_slice: 'daily',
      series: 'calories',
    },
    fromFiltersToQuery: (data) => ({
      ...data,
      series: data.series?.join(','),
    }),
    fromQueryToFilters: (urlQuery) => ({
      ...urlQuery,
      series: urlQuery.series?.split(',') as PFCSeriesType[],
      data_slice: PFC_DATA_SLICE.includes(urlQuery.data_slice as any)
        ? (urlQuery.data_slice as PFCDataSliceVariants)
        : 'daily',
      date_to:
        (urlQuery.date_from || '') > (urlQuery.date_to || '')
          ? urlQuery.date_from
          : urlQuery.date_to,
    }),
  });
}
