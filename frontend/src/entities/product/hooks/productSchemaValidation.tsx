import { useMemo } from 'react';
import * as yup from 'yup';
import { useNutritionSchemaValidation } from 'entities/nutrition';
import { useTranslate } from 'shared/i18n';

import { isValidEAN } from 'shared/lib';

export function useProductSchemaValidation() {
  const translate = useTranslate();
  const nutritionSchema = useNutritionSchemaValidation();
  return useMemo(
    () =>
      yup.object({
        id: yup.string().optional(),
        name: yup
          .string()
          .min(1)
          .required(translate('Необходимо ввести наименование')),
        category: yup
          .array()
          .min(1, translate('Необходимо выбрать категорию'))
          .required(translate('Необходимо выбрать категорию')),
        nutrition: nutritionSchema,
        unit: yup
          .array()
          .min(1, translate('Необходимо выбрать единицу измерения'))
          .required(translate('Необходимо выбрать единицу измерения')),
        brand: yup.string().optional(),
        barcode: yup
          .string()
          .optional()
          .test('isValidEAN', translate('Штрих-код некорректен'), (value) =>
            value ? isValidEAN(value) : true,
          ),
        quantity: yup
          .number()
          .required(
            translate(
              'Необходимо ввести вес продукта в указанной единице измерения',
            ),
          ),
        photo_back: yup
          .string()
          .required(translate('Необходимо фото оборотной стороны продукта')),
        photo_front: yup
          .string()
          .required(translate('Необходимо фото передней стороны продукта')),
      }),
    [nutritionSchema, translate],
  );
}

export type ProductSchemaValidationType = yup.InferType<
  ReturnType<typeof useProductSchemaValidation>
>;
