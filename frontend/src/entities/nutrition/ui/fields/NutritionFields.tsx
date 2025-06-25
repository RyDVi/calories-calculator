import { TextField } from '@mui/material';
import React from 'react';

import { useTranslate } from 'shared/i18n';
import { concatFormikNames } from 'shared/lib';
import { MuiFormikField } from 'shared/ui';
import { CaloriesField } from './CaloriesField';

export const NutritionFields: React.FC<{
  name?: string;
  required?: boolean;
}> = ({ name, required }) => {
  const translate = useTranslate();
  return (
    <>
      <CaloriesField name={name} />
      <MuiFormikField name={concatFormikNames(name, 'protein')}>
        {(props: any) => (
          <TextField
            type="number"
            label={translate('Белки')}
            required={required}
            {...props}
          />
        )}
      </MuiFormikField>
      <MuiFormikField name={concatFormikNames(name, 'fat')}>
        {(props: any) => (
          <TextField
            type="number"
            label={translate('Жиры')}
            required={required}
            {...props}
          />
        )}
      </MuiFormikField>
      <MuiFormikField name={concatFormikNames(name, 'carbohydrates')}>
        {(props: any) => (
          <TextField
            type="number"
            label={translate('Углеводы')}
            required={required}
            {...props}
          />
        )}
      </MuiFormikField>
    </>
  );
};
