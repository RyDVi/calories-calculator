import { PhotoCamera } from '@mui/icons-material';
import { Box, IconButton, IconButtonProps, SxProps } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useRef } from 'react';

import { useTranslate } from 'shared/i18n';
import { bottomSafeArea } from 'shared/lib';

// const videoConstraints: MediaTrackConstraints = {
//   width: 720,
//   height: 1280,
//   facingMode: 'environment',
// };

const MakePhotoButton: React.FC<IconButtonProps> = (props) => (
  <IconButton
    size="large"
    color="primary"
    {...props}
    sx={{ border: '60px', ...props.sx }}
  >
    <PhotoCamera />
  </IconButton>
);

export interface MakePhotoProps {
  onCapture: (capture: string) => void;
}
export const MakePhoto: React.FC<
  MakePhotoProps & React.HTMLAttributes<HTMLVideoElement>
> = ({ onCapture, ...props }) => {
  const translate = useTranslate();
  const videoRef = useRef<HTMLVideoElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  // const stream = videoRef.current?.srcObject as MediaStream | null;

  const getScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Устанавливаем размеры canvas как у видео
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Рисуем текущий кадр видео на canvas
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Получаем изображение в формате Data URL
    const screenshotData = canvas.toDataURL('image/png');
    return screenshotData;
  }, []);

  const handleClickScreenshot = useCallback(() => {
    const image = getScreenshot();
    if (!image) return;
    onCapture(image);
  }, [getScreenshot, onCapture]);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          aspectRatio: 720 / 1080,
          width: { ideal: 720 },
          height: { ideal: 1080 },
          facingMode: { exact: 'environment' },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((reason) => {
        enqueueSnackbar(
          translate('Запрос на получение разрешений к камере отклонён\n') +
            reason,
          {
            variant: 'error',
          },
        );
      });
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      (videoRef.current?.srcObject as MediaStream)
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, [translate]);
  // if (isLoading) return <CircularProgress />;
  // if (permission !== 'granted')
  // return (
  //   <Typography sx={{ p: 1 }}>
  //     Использование камеры запрещено. Предоставьте доступ.
  //   </Typography>
  // );
  return (
    <>
      <Box
        component="video"
        ref={videoRef as any}
        autoPlay
        playsInline
        {...props}
        sx={{
          width: '100%',
          height: '100%',
          maxHeight: '85vh',
          ...((props as any).sx as SxProps),
        }}
      ></Box>
      <Box component="canvas" ref={canvasRef as any} sx={{ display: 'none' }} />
      <MakePhotoButton
        onClick={handleClickScreenshot}
        sx={{
          position: 'absolute',
          bottom: `calc(${bottomSafeArea()}px + 1rem)`,
          left: 0,
          right: 0,
        }}
      />
    </>
  );
};
