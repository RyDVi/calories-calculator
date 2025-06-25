import { addDays, format, startOfDay, subDays } from 'date-fns';

export const tomorrow = addDays(startOfDay(new Date()), 1);

/**Функция для отключения всех дат начиная с завтрашнего дня*/
export const isFutureDate = (date: Date) => date >= tomorrow;
export const nextDay = (date: Date) => addDays(date, 1);
export const prevDay = (date: Date) => subDays(date, 1);

export const getUTCDate = (date: Date | string | number) => {
  const lDate =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;
  return format(lDate, 'yyyy-MM-dd');
};
