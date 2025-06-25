import { Box, Card, CardContent } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { NutritionInstance, NutritionProgress } from 'entities/nutrition';
import { useTranslate } from 'shared/i18n';

import { formatNutritionValue } from 'shared/lib';

export const StatisticsDayCard: React.FC<{
  nutrition: NutritionInstance;
  nutritionTarget: NutritionInstance;
}> = observer(({ nutrition, nutritionTarget }) => {
  const translate = useTranslate();
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          <NutritionProgress
            target={nutritionTarget.calories}
            value={nutrition.calories}
            type="circular"
            size={100}
          >
            {formatNutritionValue(nutrition.calories)} /{' '}
            {formatNutritionValue(nutritionTarget.calories)} <br />
            {translate('калорий')}
          </NutritionProgress>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            '>*': { maxWidth: '30%', width: '100px' },
          }}
        >
          <NutritionProgress
            label={translate('Белки')}
            target={nutritionTarget.protein}
            value={nutrition.protein}
          />
          <NutritionProgress
            label={translate('Жиры')}
            target={nutritionTarget.fat}
            value={nutrition.fat}
          />
          <NutritionProgress
            label={translate('Углеводы')}
            target={nutritionTarget.carbohydrates}
            value={nutrition.carbohydrates}
          />
        </Box>
      </CardContent>
    </Card>
  );
});
