import { PhotoCamera } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';

import { useCallback } from 'react';
import { useTranslate } from 'shared/i18n';

import { useBoolean } from 'shared/lib';
import { MakePhotoProps } from './Camera';
import { DialogWithCamera } from './DialogWithCamera';

export const OpenDialogWithCameraButton: React.FC<
  ButtonProps & Pick<MakePhotoProps, 'onCapture'>
> = ({ onCapture, ...props }) => {
  const translate = useTranslate();
  const [isOpen, open, close] = useBoolean();
  const handleCapture = useCallback(
    (image: string) => {
      close();
      return onCapture(image);
    },
    [close, onCapture],
  );
  if (!navigator.mediaDevices) {
    console.error('navigator.mediaDevices is not available');
    return null;
  }
  return (
    <>
      <Button startIcon={<PhotoCamera />} {...props} onClick={open}>
        {props.children || translate('Сделать фото')}
      </Button>
      <DialogWithCamera
        open={isOpen}
        onCapture={handleCapture}
        onClose={close}
        fullScreen
      />
    </>
  );
};
