import {
  format,
  formatDuration,
  intervalToDuration,
  isSameDay,
  isToday,
  isYesterday,
  subDays,
} from 'date-fns';
import i18next from 'i18next';

export const formatNutritionValue = (value: number) => value.toFixed(0);
export const formatSeconds = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration) || '0';
};
export const formatDateDay = (value: string | Date) =>
  format(new Date(value), 'dd.MM.yyyy');

export const formatDateDayWithTimeName = (value: string | Date) => {
  if (isToday(value)) return i18next.t('Сегодня');
  if (isYesterday(value)) return i18next.t('Вчера');
  if (isSameDay(subDays(new Date(), 2), value)) return i18next.t('Позавчера');
  return formatDateDay(value);
};

export const formatGramms = (value: number, unitName = '') =>
  `${Math.round(value)} ${unitName}`;
