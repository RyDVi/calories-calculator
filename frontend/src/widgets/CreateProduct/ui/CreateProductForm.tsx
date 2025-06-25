import { Box, Button } from '@mui/material';
import { Formik } from 'formik';
import { useCallback } from 'react';
import { Form } from 'react-router';
import { useDictionariesStore } from 'entities/dictionary';
import { calculateNutritionToCount } from 'entities/nutrition';
import {
  ProductSchemaValidationType,
  ProductSnapshotIn,
  useProductSchemaValidation,
} from 'entities/product';
import { ProductFields } from 'entities/product/ui/ProductFields';
import { IMAGES_TAGS } from 'shared/consts';
import { useTranslate } from 'shared/i18n';

export const CreateProductForm: React.FC<{
  initialData?: Partial<ProductSnapshotIn>;
  onSubmit: (product: ProductSnapshotIn) => void;
}> = ({ initialData = {}, onSubmit }) => {
  const translate = useTranslate();

  const dictionariesStore = useDictionariesStore();
  const defaultUnit = dictionariesStore.dictionariesQuery.data?.default_unit;

  const productFormSchema = useProductSchemaValidation();
  const handleSubmit = useCallback(
    (data: ProductSchemaValidationType) =>
      onSubmit({
        quantity: 100,
        name: '',
        // ...data,
        category: data.category[0].id,
        unit: data.unit[0].id,
        images: [
          { image: data.photo_back, tag: IMAGES_TAGS.photo_back },
          { image: data.photo_front, tag: IMAGES_TAGS.photo_front },
        ],
        id: 'new',
        barcode: data.barcode ? String(data.barcode) : null,
        nutrition: {
          ...data.nutrition,
          // На бэк требуется значение БЖУ для количества продукта
          ...calculateNutritionToCount(data.nutrition, data.quantity, 100),
        },
      }),
    [onSubmit],
  );

  return (
    <Formik
      initialValues={{
        id: 'new',
        name: '',
        nutrition: {
          carbohydrates: undefined,
          fat: undefined,
          protein: undefined,
        } as any,
        quantity: undefined as any,
        photo_back: undefined as any,
        photo_front: undefined as any,
        ...initialData,
        barcode: initialData.barcode || '',
        category: initialData.category ? [initialData.category] : [],
        unit: [initialData.unit || defaultUnit],
      }}
      onSubmit={handleSubmit}
      validationSchema={productFormSchema}
    >
      <Box
        component={Form}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <ProductFields />
        <Button type="submit" variant="contained">
          {translate('Создать')}
        </Button>
      </Box>
    </Formik>
  );
};
