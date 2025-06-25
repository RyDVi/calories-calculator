import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddMealTime } from 'widgets/AddMealTime';
import { useProductFilters } from 'widgets/ProductsList';
import { LinkFabToCreateNewProduct } from 'features/product/linkTocreateNewProduct';
import { guardMealTimeName } from 'entities/mealtime';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { useOverrideShell } from 'shared/providers';
import { BarcodeReaderButton } from 'shared/ui';

const MealTimePage = observer(() => {
  const translate = useTranslate();
  const [productFilters, , setProductFilters] = useProductFilters();
  const navigate = useNavigate();
  const { meal_time_id, diary_date, meal_time_name } =
    useParams<Parameters<typeof paths.mealTimeEdit>[0]>();

  const handleAfterAddMealTime = useCallback(async () => {
    navigate(paths.diaryDetail({ diary_date: diary_date! }), {
      viewTransition: true,
    });
  }, [diary_date, navigate]);

  useOverrideShell({
    title:
      meal_time_id !== 'new'
        ? translate('Редактирование приёма пищи')
        : translate('Добавление приёма пищи'),
    backAction: () =>
      navigate(paths.diaryDetail({ diary_date: diary_date! }), {
        replace: true,
        viewTransition: true,
      }),
    actions: (
      <>
        <Box sx={{ ml: 'auto' }} />
        <BarcodeReaderButton
          onCapture={(barcode) => setProductFilters({ search: barcode })}
        />
      </>
    ),
  });

  return (
    <>
      <AddMealTime
        onAfterAddMealTime={handleAfterAddMealTime}
        mealTimeId={meal_time_id!}
        mealTimeName={guardMealTimeName(meal_time_name)}
        diaryDate={diary_date!}
      />
      <LinkFabToCreateNewProduct
        mealTimeId={meal_time_id!}
        diaryUTCDate={diary_date!}
        mealTimeName={meal_time_name!}
        barcode={productFilters.search}
      />
    </>
  );
});

export default MealTimePage;
