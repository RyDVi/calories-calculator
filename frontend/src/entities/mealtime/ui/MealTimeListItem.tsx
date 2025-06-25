import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { forwardRef } from 'react';
import { NutritionChip } from 'entities/nutrition/@x/mealtime';
import { FullOrFractionValue } from 'shared/ui';
import { MealTimeInstance } from '../model/mealTimeModel';
import { MealTimeImage } from './MealTimeImage';

export const MealTimeListItem = observer(
  forwardRef<
    HTMLLIElement,
    {
      mealTime: MealTimeInstance;
    } & ListItemProps
  >(({ mealTime, ...props }, ref) => (
    <ListItem ref={ref} {...props}>
      <ListItemButton>
        <ListItemIcon sx={{ mr: 1 }}>
          <MealTimeImage src={mealTime.product?.front_image} />
        </ListItemIcon>
        <ListItemText
          primary={
            <>
              {mealTime.product?.name}
              <Box component="span" sx={{ display: 'block' }}>
                {mealTime.product && (
                  <FullOrFractionValue
                    intVal={mealTime.intCount}
                    fractionCount={mealTime.fractionCount}
                    count_fractions_in_product={
                      mealTime.count_fractions_in_product
                    }
                    count={mealTime.count}
                    quantity={mealTime.product.quantity}
                    unitName={mealTime.product.unit.name}
                  />
                )}
              </Box>
            </>
          }
          secondaryTypographyProps={{ component: 'div' }}
          secondary={
            <>
              <NutritionChip
                nutrition={mealTime.summaryNutrition}
                color="primary"
                size="small"
                variant="outlined"
              />
            </>
          }
        />
      </ListItemButton>
    </ListItem>
  )),
);
