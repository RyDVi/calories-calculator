import { useMemo } from 'react';
import * as yup from 'yup';
import { useTranslate } from 'shared/i18n';

export function useNutritionSchemaValidation() {
  const translate = useTranslate();
  return useMemo(
    () =>
      yup.object({
        protein: yup
          .number()
          .min(
            0,
            translate('Количество белков должно быть больше или равно нулю'),
          )
          .required(translate('Необходимо заполнить количество белков')),
        fat: yup
          .number()
          .min(
            0,
            translate('Количество жиров должно быть больше или равно нулю'),
          )
          .required(translate('Необходимо заполнить количество жиров')),
        carbohydrates: yup
          .number()
          .min(
            0,
            translate('Количество углеводов должно быть больше или равно нулю'),
          )
          .required(translate('Необходимо заполнить количество углеводов')),
      }),
    [translate],
  );
}
