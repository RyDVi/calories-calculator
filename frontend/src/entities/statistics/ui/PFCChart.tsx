import {
  BarPlot,
  ChartsGrid,
  ChartsLegend,
  ChartsTooltip,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
  ResponsiveChartContainer,
} from '@mui/x-charts';
import { DatasetType } from '@mui/x-charts/internals';
import { useTranslate } from 'shared/i18n';
import { usePFCSeries } from '../hooks/usePFCSeries';
import { PFCSeriesType } from '../model/statisticsModel';

export const PFCChart: React.FC<{
  enabledSeries?: PFCSeriesType[];
  dataset: DatasetType;
}> = ({ enabledSeries, dataset }) => {
  const translate = useTranslate();
  const pfcSeries = usePFCSeries(enabledSeries);
  return (
    <ResponsiveChartContainer
      dataset={dataset || []}
      height={300}
      series={pfcSeries}
      xAxis={[{ dataKey: 'dates', scaleType: 'band' }]}
      yAxis={[{ id: 'leftAxis' }]}
    >
      <ChartsGrid horizontal />
      <BarPlot />
      <LinePlot />
      <MarkPlot />

      <ChartsXAxis />
      {enabledSeries?.includes('calories') ? (
        <ChartsYAxis axisId="leftAxis" label={translate('Ккал')} />
      ) : (
        <ChartsYAxis axisId="leftAxis" label={translate('Грамм')} />
      )}
      <ChartsTooltip />
      <ChartsLegend />
    </ResponsiveChartContainer>
  );
};
