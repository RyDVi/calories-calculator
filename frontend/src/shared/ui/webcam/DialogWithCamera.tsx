import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogProps, DialogTitle, IconButton } from '@mui/material';
import { useTranslate } from 'shared/i18n';
import { MakePhoto, MakePhotoProps } from './Camera';

export const DialogWithCamera: React.FC<
  Omit<DialogProps, 'onClose'> &
    Pick<MakePhotoProps, 'onCapture'> & { onClose: () => void }
> = ({ onCapture, ...props }) => {
  const translate = useTranslate();
  return (
    <Dialog {...props}>
      <DialogTitle sx={{ mr: 3 }}>{translate('Фото')}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <MakePhoto onCapture={onCapture} />
    </Dialog>
  );
};
