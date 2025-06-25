import { List } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  MealTimeInstance,
  MealTimeNamesInstance,
} from '../model/mealTimeModel';

const MEAL_TIME_NAME_ORDERING: Record<MealTimeNamesInstance, number> = {
  breakfast: 0,
  dinner: 2,
  lunch: 1,
  snack: 3,
};

export type MealTimeGroups = Record<MealTimeNamesInstance, MealTimeInstance[]>;

export const OrderedMealTimeGroupsList: React.FC<{
  mealTimeGroups: MealTimeGroups;
  children: (
    mealTimeName: keyof MealTimeGroups,
    mealTimes: MealTimeGroups[keyof MealTimeGroups],
  ) => React.ReactNode;
}> = observer(({ mealTimeGroups, children }) => (
  <List>
    {(
      Object.entries(mealTimeGroups) as unknown as [
        MealTimeNamesInstance,
        MealTimeInstance[],
      ][]
    )
      .sort(
        ([mealTimeNameLeft], [mealTimeNameRight]) =>
          MEAL_TIME_NAME_ORDERING[mealTimeNameLeft] -
          MEAL_TIME_NAME_ORDERING[mealTimeNameRight],
      )
      .map(([mealTimeName, mealTimes]) => children(mealTimeName, mealTimes))}
  </List>
));
