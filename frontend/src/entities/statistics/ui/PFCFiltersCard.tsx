import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';

import { PFCSeriesType, StatistictsFiltersType } from 'entities/statistics';
import { useTranslate } from 'shared/i18n';
import { getUTCDate, isFutureDate } from 'shared/lib';

export const PFCFiltersCard: React.FC<{
  filters: StatistictsFiltersType;
  onChange: (filters: StatistictsFiltersType) => void;
}> = observer(({ filters, onChange }) => {
  const translate = useTranslate();
  const seriesProps = useCallback(
    (name: PFCSeriesType) => ({
      value: name,
      checked: filters.series?.includes(name),
      onChange: (e: any) => {
        const pfcSeries = [...filters.series];
        if (name === 'calories') {
          pfcSeries.splice(0, pfcSeries.length);
        } else if (pfcSeries.includes('calories')) {
          pfcSeries.splice(pfcSeries.indexOf('calories'), 1);
        }
        if (e.target.checked) {
          pfcSeries.push(name);
        } else {
          pfcSeries.splice(pfcSeries.indexOf(name), 1);
        }
        onChange({
          ...filters,
          series: pfcSeries,
        });
      },
    }),
    [filters, onChange],
  );
  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <DatePicker
            label={translate('Дата с')}
            value={new Date(filters.date_from)}
            onChange={(date) =>
              onChange({
                ...filters,
                date_from: getUTCDate(date || new Date()),
              })
            }
            closeOnSelect
            shouldDisableDate={isFutureDate}
            format="dd.MM.yyyy"
          />
          <DatePicker
            label={translate('Дата по')}
            value={new Date(filters.date_to)}
            onChange={(date) =>
              onChange({
                ...filters,
                date_to: getUTCDate(date || new Date()),
              })
            }
            closeOnSelect
            shouldDisableDate={isFutureDate}
            format="dd.MM.yyyy"
          />
        </Box>
        <Box>
          <Typography>{translate('Отобразить данные:')}</Typography>
          <ToggleButtonGroup
            color="primary"
            value={filters.data_slice}
            exclusive
            onChange={(_, value) => onChange({ ...filters, data_slice: value })}
          >
            <ToggleButton value="daily">{translate('По дням')}</ToggleButton>
            <ToggleButton value="weekly">
              {translate('По неделям')}
            </ToggleButton>
            <ToggleButton value="monthly">
              {translate('По месяцам')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <FormGroup
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))',
          }}
        >
          <FormControlLabel
            control={<Switch {...seriesProps('protein')} />}
            label={translate('Белки')}
          />
          <FormControlLabel
            control={<Switch {...seriesProps('fat')} />}
            label={translate('Жиры')}
          />
          <FormControlLabel
            control={<Switch {...seriesProps('carbohydrates')} />}
            label={translate('Углеводы')}
          />
          <FormControlLabel
            control={<Switch {...seriesProps('calories')} />}
            label={translate('Калории')}
          />
        </FormGroup>
      </CardContent>
    </Card>
  );
});
