import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { PFCStatistics } from 'widgets/PFCStatistic';
import { usePFCFilters } from 'entities/statistics';
import { useTranslate } from 'shared/i18n';
import { useOverrideShell } from 'shared/providers';

const StatisticsPage = observer(() => {
  const translate = useTranslate();
  const [pfcFilters, upsertPfcFilters] = usePFCFilters();
  const navigate = useNavigate();
  useOverrideShell({
    title: translate('Статистика калорий'),
    backAction: () => navigate(-1),
    actions: <></>,
  });

  return (
    <PFCStatistics pfcFilters={pfcFilters} onFiltersChange={upsertPfcFilters} />
  );
});

export default StatisticsPage;
