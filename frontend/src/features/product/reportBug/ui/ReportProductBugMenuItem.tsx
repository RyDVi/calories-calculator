import { MenuItem } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MealTimeInstance } from 'entities/mealtime';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';

export const ReportProductBugMenuItem: React.FC<{
  diaryDate: string;
  mealTime: MealTimeInstance;
}> = observer(({ diaryDate, mealTime }) => {
  const translate = useTranslate();
  const navigate = useNavigate();

  const handleReportBug = useCallback(
    () =>
      navigate(paths.productSendBug({ product_id: mealTime.product!.id }), {
        viewTransition: true,
      }) +
      '?' +
      new URLSearchParams({
        redirect_uri: paths.diaryDetail({
          diary_date: diaryDate,
        }),
      }).toString(),
    [diaryDate, mealTime.product, navigate],
  );

  return (
    <MenuItem onClick={handleReportBug}>
      {translate('Сообщить об ошибке')}
    </MenuItem>
  );
});
