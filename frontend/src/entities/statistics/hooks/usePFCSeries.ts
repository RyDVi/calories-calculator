import { BarSeriesType, LineSeriesType } from '@mui/x-charts';
import { useMemo } from 'react';
import { useTranslate } from 'shared/i18n';
import { PFCSeriesType } from '../model/statisticsModel';

export function usePFCSeries(
  enabledSeries: PFCSeriesType[] = [],
): (LineSeriesType | BarSeriesType)[] {
  const translate = useTranslate();
  const series = useMemo(() => {
    const series = [] as (LineSeriesType | BarSeriesType)[];
    if (enabledSeries.includes('calories')) {
      series.push(
        {
          dataKey: 'summary_calories',
          label: translate('Ккал'),
          type: 'bar',
          color: '#FFC1074D',
        },
        {
          dataKey: 'target_calories',
          label: translate('Цель по Ккал'),
          type: 'line',
          color: '#FFC107',
        },
      );
    }
    if (enabledSeries.includes('fat')) {
      series.push(
        {
          dataKey: 'summary_fat',
          label: translate('Жиры'),
          type: 'bar',
          color: '#28A7454D',
        },
        {
          dataKey: 'target_fat',
          label: translate('Цель по жирам'),
          type: 'line',
          color: '#28A745',
        },
      );
    }
    if (enabledSeries.includes('carbohydrates')) {
      series.push(
        {
          dataKey: 'summary_carbohydrates',
          label: translate('Углеводы'),
          type: 'bar',
          color: '#DC35454D',
        },
        {
          dataKey: 'target_carbohydrates',
          label: translate('Цель по углеводам'),
          type: 'line',
          color: '#DC3545',
        },
      );
    }
    if (enabledSeries.includes('protein')) {
      series.push(
        {
          dataKey: 'summary_protein',
          label: translate('Белки'),
          type: 'bar',
          color: '#007BFF',
        },
        {
          dataKey: 'target_protein',
          label: translate('Цель по белкам'),
          type: 'line',
          color: '#007BFF4D',
        },
      );
    }
    return series;
  }, [enabledSeries, translate]);

  return series;
}
