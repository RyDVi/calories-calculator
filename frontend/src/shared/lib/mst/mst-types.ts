import { isValid } from 'date-fns';
import i18next from 'i18next';
import { types } from 'mobx-state-tree';
import { getUTCDate } from 'shared/lib';

/**
 * Дата принимающий любоай формат с возможностью конвертирования в необходимый тип на выходе
 * @param converter конвертер даты
 * @returns
 */
export const DateConvertable = <DateType extends string | number | Date>(
  converter: (date: Date) => DateType,
) =>
  types.custom<DateType, Date>({
    name: 'DateConvertable',
    fromSnapshot: (snapshot) => new Date(snapshot),
    toSnapshot: (date: Date) => (date ? converter(date) : date),
    isTargetType: (value: any): value is Date => isValid(new Date(value)),
    getValidationMessage: () =>
      i18next.t('Значение не является конвертируемым в дату'),
  });

export const UTCDate = DateConvertable<string>(getUTCDate);
