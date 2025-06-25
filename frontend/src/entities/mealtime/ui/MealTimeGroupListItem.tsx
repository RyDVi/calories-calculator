import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemProps,
  ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import {
  NutritionChip,
  NutritionInstance,
} from 'entities/nutrition/@x/mealtime';
import { useTranslate } from 'shared/i18n';
import {
  MEAL_TIME_IMAGES,
  MEAL_TIME_NAMES,
  MealTimeNamesInstance,
} from '../model/mealTimeModel';

export const MealTimeGroupListItem: React.FC<
  {
    name: MealTimeNamesInstance;
    nutrition: NutritionInstance;
  } & ListItemProps
> = observer(({ name, nutrition, ...props }) => {
  const translate = useTranslate();
  return (
    <ListItem {...props}>
      <ListItemAvatar>
        <Box
          component="img"
          src={MEAL_TIME_IMAGES[name]}
          sx={{
            aspectRatio: '1/1',
            height: 'auto',
            width: '3rem',
            objectFit: 'contain',
          }}
        />
      </ListItemAvatar>
      <ListItemText
        primary={translate(MEAL_TIME_NAMES[name])}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={
          <NutritionChip
            nutrition={nutrition}
            variant="outlined"
            size="small"
          />
        }
      />
    </ListItem>
  );
});
