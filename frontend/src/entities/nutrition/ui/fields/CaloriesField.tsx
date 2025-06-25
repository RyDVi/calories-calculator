import { TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslate } from 'shared/i18n';
import { concatFormikNames, formatNutritionValue } from 'shared/lib';
import { MuiFormikField } from 'shared/ui';
import {
  calculateCalories,
  NutritionInstance,
} from '../../model/nutritionModel';

export const CaloriesField: React.FC<{ name?: string }> = ({ name }) => {
  const translate = useTranslate();
  const { values } = useFormikContext<NutritionInstance>();
  const calories = calculateCalories(name ? (values as any)[name] : values);
  return (
    <MuiFormikField name={concatFormikNames(name, 'calories')}>
      {(props: any) => (
        <TextField
          type="number"
          label={translate('Калории')}
          disabled
          {...props}
          value={formatNutritionValue(calories)}
        />
      )}
    </MuiFormikField>
  );
};
