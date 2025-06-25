import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import * as uuid from 'uuid';

import { emptyNutrition, Nutrition } from 'entities/nutrition/@x/mealtime';
import { Product } from 'entities/product/@x/mealtime';
import { processMinNumber, withSetPropAction, getPublicPath } from 'shared/lib';

export const MealTimeNames = types.enumeration('MealTimeName', [
  'breakfast',
  'dinner',
  'lunch',
  'snack',
]);
export type MealTimeNamesInstance = Instance<typeof MealTimeNames>;

export const MealTime = types
  .model('MealTime', {
    id: types.optional(types.identifier, () => uuid.v4()),
    name: types.optional(MealTimeNames, 'breakfast'),
    product: types.maybe(types.reference(Product)),
    /** Количество продукта в десятичном значении (никак не соотносится с count_fractions_in_product, это не числитель!!!). */
    count: types.number,
    /** Знаменатель дробной части. Необходим, чтобы понять дробную часть. */
    count_fractions_in_product: types.maybeNull(types.integer),
  })
  .preProcessSnapshot(processMinNumber('count', 0))
  .actions(withSetPropAction)
  .views((self) => ({
    get summaryNutrition() {
      const baseNutrition = self.product?.nutrition || emptyNutrition();
      return Nutrition.create({
        carbohydrates: self.count * baseNutrition.carbohydrates,
        fat: self.count * baseNutrition.fat,
        protein: self.count * baseNutrition.protein,
      });
    },
  }))
  .views((self) => ({
    get summaryCalories() {
      return (self.product?.nutrition.calories || 0) * self.count;
    },
    /**
     * Целочисленная часть количества
     */
    get intCount() {
      return Math.floor(
        (self.count * (self.count_fractions_in_product || 1)) /
          (self.count_fractions_in_product || 1),
      );
    },
    /**
     * Дробная часть количества
     */
    get fractionCount() {
      return Math.round(
        (self.count * (self.count_fractions_in_product || 1)) %
          (self.count_fractions_in_product || 1),
      );
    },
  }));

export type MealTimeInstance = Instance<typeof MealTime>;
export type MealTimeSnapshotIn = SnapshotIn<typeof MealTime>;
export type MealTimeSnapshotOut = SnapshotOut<typeof MealTime>;

export const MEAL_TIME_NAMES: Record<MealTimeNamesInstance, string> =
  Object.freeze({
    breakfast: 'Завтрак',
    dinner: 'Ужин',
    lunch: 'Обед',
    snack: 'Перекус',
  });

export const MEAL_TIME_IMAGES: Record<MealTimeNamesInstance, string> =
  Object.freeze({
    breakfast: getPublicPath('breakfast.png'),
    dinner: getPublicPath('dinner.png'),
    lunch: getPublicPath('lunch.png'),
    snack: getPublicPath('snack.png'),
  });

export const NO_IMAGE_PATH = getPublicPath('no_image.png');

type TimeInput = Date | string | { hours: number; minutes: number };

export function getMealTimeByTime(timeInput: TimeInput): MealTimeNamesInstance {
  let hours: number;
  let minutes: number = 0;

  // Обработка разных форматов ввода
  if (timeInput instanceof Date) {
    hours = timeInput.getHours();
    minutes = timeInput.getMinutes();
  } else if (typeof timeInput === 'string') {
    // Парсинг строки формата HH:MM или HH:MM:SS
    const timeParts = timeInput.split(':');
    if (timeParts.length >= 2) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
    } else {
      return 'snack';
    }
  } else if (typeof timeInput === 'object' && 'hours' in timeInput) {
    // Для объекта с полями hours и minutes
    hours = timeInput.hours;
    minutes = timeInput.minutes || 0;
  } else {
    return 'snack';
  }

  // Проверка на валидность времени
  if (
    isNaN(hours) ||
    hours < 0 ||
    hours > 23 ||
    isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 'snack';
  }

  // Определение времени приема пищи
  if (hours >= 6 && hours < 11) {
    return 'breakfast';
  } else if (hours >= 11 && hours < 13) {
    return 'snack';
  } else if (hours >= 13 && hours < 15) {
    return 'lunch';
  } else if (hours >= 15 && hours < 17) {
    return 'snack';
  } else if (hours >= 17 && hours < 21) {
    return 'dinner';
  } else {
    return 'snack';
  }
}

export const guardMealTimeName = (mealTime?: string): MealTimeNamesInstance => {
  if (
    !mealTime ||
    !['breakfast', 'dinner', 'lunch', 'snack'].includes(mealTime)
  ) {
    return 'snack';
  }
  return mealTime as MealTimeNamesInstance;
};

export const getNutritionFromMealTimes = (mealTimes: MealTimeInstance[]) =>
  mealTimes.reduce(
    (acc, val) => {
      acc.carbohydrates += val.summaryNutrition.carbohydrates;
      acc.fat += val.summaryNutrition.fat;
      acc.protein += val.summaryNutrition.protein;
      return acc;
    },
    {
      calories: 0,
      fat: 0,
      carbohydrates: 0,
      protein: 0,
    },
  );

export const SaveMealTime = types
  .compose(
    MealTime,
    types.model({
      diary_date: types.maybe(types.string),
      product_id: types.maybe(types.string),
      barcode: types.maybe(types.string),
    }),
  )
  .preProcessSnapshot((snapshot) => ({
    ...snapshot,
    product_id:
      snapshot?.product_id ||
      (typeof snapshot?.product === 'string'
        ? snapshot?.product
        : snapshot?.product?.id),
  }))
  .postProcessSnapshot((snapshot: any) => {
    // Если product существует, добавляем product_id в снимок
    if (!snapshot.product_id && snapshot.product?.id) {
      return {
        ...snapshot,
        product_id: snapshot.product_id || snapshot.product.id, // Получение product_id из product
      };
    }

    return snapshot;
  })
  .named('SaveMealTime');

export type SaveMealTimeInstance = Instance<typeof SaveMealTime>;
export type SaveMealTimeSnapshotOut = SnapshotOut<typeof SaveMealTime>;
export type SaveMealTimeSnapshotIn = SnapshotIn<typeof SaveMealTime>;
