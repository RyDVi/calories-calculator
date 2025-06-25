import { Card, CardContent, CardHeader, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { CategoryAutocompleteField } from 'entities/category';
import { NutritionFields, NutritionFieldsContainer } from 'entities/nutrition';
import { UnitAutocompleteField } from 'entities/unit';
import { useTranslate } from 'shared/i18n';

import { BarcodeField, ImageField, MuiFormikField } from 'shared/ui';

const fieldProps = {
  variant: 'outlined',
  fullWidth: true,
};

export const ProductFields: React.FC = observer(() => {
  const translate = useTranslate();
  return (
    <>
      <MuiFormikField name="barcode">
        {(props: any) => (
          <BarcodeField {...props} {...fieldProps} type="number" autoFocus />
        )}
      </MuiFormikField>
      <MuiFormikField type="image" name="photo_front">
        {(props: any) => (
          <ImageField
            {...props}
            label={translate('Фото продукта с лицевой стороны')}
            labelPlacement="top"
            required
          />
        )}
      </MuiFormikField>
      <MuiFormikField type="image" name="photo_back">
        {(props: any) => (
          <ImageField
            {...props}
            label={translate(
              'Фото продукта с оборотной стороны с указанием БЖУ',
            )}
            labelPlacement="top"
            required
          />
        )}
      </MuiFormikField>
      <MuiFormikField name="name">
        {(props: any) => (
          <TextField
            {...props}
            {...fieldProps}
            type="text"
            label={translate('Название')}
            required
          />
        )}
      </MuiFormikField>
      <MuiFormikField name="category" type="dict">
        {(props: any) => (
          <CategoryAutocompleteField
            fieldProps={props.props}
            {...props}
            {...fieldProps}
            required
          />
        )}
      </MuiFormikField>
      <MuiFormikField name="unit" type="dict">
        {(props: any) => (
          <UnitAutocompleteField
            fieldProps={props.props}
            {...props}
            {...fieldProps}
            required
          />
        )}
      </MuiFormikField>
      <MuiFormikField name="quantity">
        {(props: any) => (
          <TextField
            label={translate('Вес продукта')}
            placeholder={translate('Введите вес продукта')}
            type="number"
            required
            {...props}
            {...fieldProps}
          />
        )}
      </MuiFormikField>
      <MuiFormikField name="brand">
        {(props: any) => (
          <TextField
            label={translate('Название бренда')}
            placeholder={translate('Название бренда')}
            {...props}
            {...fieldProps}
          />
        )}
      </MuiFormikField>
      <Card>
        <CardHeader title={translate('Состав БЖУ на 100 грамм')} />
        <CardContent>
          <NutritionFieldsContainer>
            <NutritionFields name="nutrition" required />
          </NutritionFieldsContainer>
        </CardContent>
      </Card>
    </>
  );
});
