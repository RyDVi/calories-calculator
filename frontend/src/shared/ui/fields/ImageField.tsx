import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import {
  Box,
  Button,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  TextFieldProps,
} from '@mui/material';
import { useTranslate } from 'shared/i18n';
import { OpenDialogWithCameraButton } from 'shared/ui';
import { HiddenFileUploadInput } from './HiddenFileUploadInput';

export interface ImageFieldProps
  extends Omit<FormControlLabelProps, 'control' | 'onChange'>,
    Pick<TextFieldProps, 'error' | 'helperText'> {
  src: string;
  direction?: 'column' | 'horizontal';
  onChange?: Parameters<typeof HiddenFileUploadInput>[0]['onChange'];
}

export const ImageField: React.FC<ImageFieldProps> = ({
  src,
  error,
  helperText,
  direction = 'column',
  onChange,
  ...props
}) => {
  const translate = useTranslate();
  return (
    <Box
      sx={{
        width: 'fit-content',
        display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'column',
        ...props.sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: direction,
        }}
      >
        <FormControlLabel
          labelPlacement="top"
          {...props}
          sx={{ alignItems: 'flex-start' }}
          // control={<input name={props.name} type="file" accept="image/*" />}
          control={
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {translate('Загрузить файл')}
                <HiddenFileUploadInput
                  name={props.name}
                  onChange={onChange}
                  accept="image/*"
                />
              </Button>
              {onChange && (
                <OpenDialogWithCameraButton
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  onCapture={onChange}
                />
              )}
            </Box>
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 1,
            marginLeft: 1,
          }}
        >
          {src ? (
            <Box component="img" src={src} sx={{ width: '100%' }} />
          ) : (
            <ImageIcon />
          )}
        </Box>
      </Box>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
};
