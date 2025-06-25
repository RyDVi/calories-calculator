import { Box } from '@mui/material';
import { useQuery } from 'mst-query';
import { useMemo } from 'react';
import { StatisticsDayCard } from 'widgets/StatisticsDayCard';
import {
  PFCChart,
  PFCFiltersCard,
  StatistictsFiltersType,
  useStatisticsStore,
} from 'entities/statistics';
import { ErrorAlert } from 'shared/ui';

export const PFCStatistics: React.FC<{
  pfcFilters: StatistictsFiltersType;
  onFiltersChange: (pfcFilters: StatistictsFiltersType) => void;
}> = ({ pfcFilters, onFiltersChange }) => {
  const statisticsStore = useStatisticsStore();
  const request = useMemo(
    () => ({ ...pfcFilters, series: pfcFilters.series.join(',') }),
    [pfcFilters],
  );
  const {
    data: statistics,
    error,
    isFetched,
  } = useQuery(statisticsStore.statistcsQuery, {
    request,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {isFetched && error && <ErrorAlert error={error} />}
      {pfcFilters && (
        <PFCFiltersCard filters={pfcFilters} onChange={onFiltersChange} />
      )}
      <PFCChart
        dataset={statistics?.dataset || []}
        enabledSeries={pfcFilters.series}
      />
      {statistics && (
        <StatisticsDayCard
          nutrition={statistics.summary_nutrition}
          nutritionTarget={statistics.target_nutrition}
        />
      )}
    </Box>
  );
};
