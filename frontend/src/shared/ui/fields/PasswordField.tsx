import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  TextFieldProps,
} from '@mui/material';

import { useTranslate } from 'shared/i18n';
import { useBoolean } from 'shared/lib';

export const PasswordField: React.FC<
  Omit<OutlinedInputProps, 'endAdorment'> &
    Pick<TextFieldProps, 'helperText' | 'error'>
> = ({ helperText, error, label, ...props }) => {
  const translate = useTranslate();
  const iLabel = label || translate('Пароль');
  const [isShowPassword, , , toogleShowPassword] = useBoolean();
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="password-field">{iLabel}</InputLabel>
      <OutlinedInput
        id="password-field"
        type={isShowPassword ? 'text' : 'password'}
        label={iLabel}
        {...props}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={toogleShowPassword}
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              edge="end"
            >
              {isShowPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};
