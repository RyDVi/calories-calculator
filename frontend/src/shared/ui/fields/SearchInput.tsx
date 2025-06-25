import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import * as React from 'react';
import { useTranslate } from 'shared/i18n';

export const SearchTextField: React.FC<TextFieldProps> = ({
  InputProps,
  ...props
}) => {
  const translate = useTranslate();
  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        placeholder: translate('Введите для поиска'),
        ...InputProps,
      }}
      {...props}
    />
  );
};
