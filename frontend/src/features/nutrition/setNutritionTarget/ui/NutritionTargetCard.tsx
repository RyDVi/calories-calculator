import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';
import { Form, Formik } from 'formik';
import { getSnapshot } from 'mobx-state-tree';
import {
  NutritionFields,
  NutritionFieldsContainer,
  NutritionInstance,
  useNutritionSchemaValidation,
} from 'entities/nutrition';
import { useTranslate } from 'shared/i18n';

export const EveryDayNutrtitionTargetCard: React.FC<{
  everyDayNutritionTarget: NutritionInstance;
  onSubmit: (nutritionTarget: NutritionInstance) => void;
}> = ({ everyDayNutritionTarget, onSubmit }) => {
  const translate = useTranslate();
  const nutritionSchema = useNutritionSchemaValidation();
  return (
    <Card>
      <CardHeader title={translate('Цель БЖУ (калории) на день')} />
      <CardContent>
        <Formik
          initialValues={
            getSnapshot(everyDayNutritionTarget) as NutritionInstance
          }
          onSubmit={onSubmit}
          validationSchema={nutritionSchema}
        >
          <Box component={Form}>
            <NutritionFieldsContainer>
              <NutritionFields />
            </NutritionFieldsContainer>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: '100%', mt: 3 }}
            >
              {translate('Сохранить')}
            </Button>
          </Box>
        </Formik>
      </CardContent>
    </Card>
  );
};
