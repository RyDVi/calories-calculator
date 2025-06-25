import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { useTranslate } from 'shared/i18n';
import { BarcodeReaderButton } from 'shared/ui';

export const BarcodeField: React.FC<TextFieldProps> = (props) => {
  const translate = useTranslate();
  return (
    <TextField
      label={translate('Штрих-код')}
      placeholder={translate('Введите штрих-код продукта')}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <BarcodeReaderButton
              onCapture={(barcode) =>
                props.onChange?.({
                  target: { name: props.name, value: barcode },
                } as any)
              }
            />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
    />
  );
};
