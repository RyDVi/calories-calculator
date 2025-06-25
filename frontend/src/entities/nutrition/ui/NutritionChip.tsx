import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Box, BoxProps, Chip, ChipProps } from '@mui/material';
import React from 'react';

import { useTranslate } from 'shared/i18n';
import { NutritionInstance } from 'entities/nutrition';
import { formatNutritionValue } from 'shared/lib';

const NoWrapSpanBox: React.FC<BoxProps> = (props) => (
  <Box {...props} component="span" sx={{ whiteSpace: 'nowrap', ...props.sx }} />
);

export const NutritionChip: React.FC<
  { nutrition: NutritionInstance } & ChipProps
> = ({ nutrition, ...props }) => {
  const translate = useTranslate();
  return (
    <Chip
      sx={{
        height: 'auto',
        '.MuiChip-label ': {
          whiteSpace: 'pre-line',
          textOverflow: 'inherit',
          wordWrap: 'break-word',
        },
      }}
      icon={<RestaurantMenuIcon />}
      label={
        <>
          <NoWrapSpanBox>{translate('Б/Ж/У:')}</NoWrapSpanBox>
          <NoWrapSpanBox>
            {formatNutritionValue(nutrition.protein)}/
            {formatNutritionValue(nutrition.fat)}/
            {formatNutritionValue(nutrition.carbohydrates)}
          </NoWrapSpanBox>{' '}
          <NoWrapSpanBox>
            {formatNutritionValue(nutrition.calories)} {translate('Ккал')}
          </NoWrapSpanBox>
        </>
      }
      {...props}
    />
  );
};
