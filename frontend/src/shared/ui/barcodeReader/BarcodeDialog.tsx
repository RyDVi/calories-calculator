import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogProps,
  DialogTitle,
  IconButton,
} from '@mui/material';

import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';
import { useCallback, useRef } from 'react';
import { useTranslate } from 'shared/i18n';
import { useBoolean } from 'shared/lib';

export interface BarcodeReaderDialogProps
  extends Omit<DialogProps, 'onClose' | 'open' | 'children'> {
  onCapture: (code: string) => void;
  children: (props: {
    startScanning: () => void;
    stopScanning: () => void;
  }) => React.ReactNode;
}
export const BarcodeReaderDialog: React.FC<BarcodeReaderDialogProps> = ({
  children,
  onCapture,
  ...props
}) => {
  const translate = useTranslate();
  const [isOpen, open, close] = useBoolean(false);
  const scannerHtmlRef = useRef<HTMLElement>();
  const html5QrCodeRef = useRef<Html5Qrcode>();
  const cameraRef = useRef<CameraDevice>();
  const [isScannerLoading, setIsScannerLoading, setIsScannerLoaded] =
    useBoolean();
  const scanningStateRef = useRef(false);

  const getBackCamera = useCallback(async () => {
    if (cameraRef.current) return cameraRef.current;
    let devices = null;
    try {
      devices = await Html5Qrcode.getCameras();
    } catch (err) {
      console.error('Ошибка получения списка камер:', err);
      return null;
    }
    const backCamera =
      devices.find((device) => device.label.toLowerCase().includes('back')) ||
      devices[1] ||
      devices[0];
    cameraRef.current = backCamera;
    if (!backCamera) return console.error('Камера не найдена');
    return backCamera;
  }, []);

  const getScanner = useCallback(() => {
    if (!scannerHtmlRef.current?.id) return null;
    html5QrCodeRef.current = new Html5Qrcode(scannerHtmlRef.current.id, {
      verbose: false,
      // useBarCodeDetectorIfSupported: true,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
      ],
      // experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      ...({ focusMode: 'continuous' } as any), // try fix reading on iphone
    });
    return html5QrCodeRef.current;
  }, []);

  const stop = useCallback(async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current?.stop();
    }
    await html5QrCodeRef.current?.clear();
    scanningStateRef.current = false;
  }, []);

  const start = useCallback(
    () =>
      new Promise<string>((resolve, reject) => {
        if (!html5QrCodeRef.current) {
          return reject(translate('Сканер не определён'));
        }
        if (!cameraRef.current) {
          return reject(translate('Камера не найдена'));
        }
        html5QrCodeRef.current.start(
          { facingMode: { exact: 'environment' } },
          {
            fps: 10,
            qrbox: { width: 500, height: 300 },
            aspectRatio: window.outerHeight / window.outerWidth, // try fix reading on iphone
            ...({ focusMode: 'continuous' } as any), // try fix reading on iphone
          },
          (decodedText) => resolve(decodedText),
          (errorMessage) => console.warn(`Ошибка: ${errorMessage}`),
        );
      }),
    [translate],
  );
  const stopScanning = useCallback(() => {
    stop();
    close();
  }, [close, stop]);

  const startScanning = useCallback(async () => {
    if (scanningStateRef.current) {
      console.error('Сканер уже запущен');
      return;
    }
    scanningStateRef.current = true;
    open();
    setTimeout(async () => {
      setIsScannerLoading();
      await Promise.all([getBackCamera(), getScanner()]);
      setIsScannerLoaded();
      try {
        const code = await start();
        onCapture(code);
      } catch (err) {
        console.error(err);
      }
      stopScanning();
      scanningStateRef.current = false;
    }, 100);
  }, [
    getBackCamera,
    getScanner,
    onCapture,
    open,
    setIsScannerLoaded,
    setIsScannerLoading,
    start,
    stopScanning,
  ]);

  // TODO: реализовать, сейчас вызывает проблему, что постоянно закрывает диалог и он не отображается
  // useEffect(() => () => stopScanning());

  return (
    <>
      <Dialog {...props} open={isOpen}>
        <DialogTitle sx={{ mr: 3 }}>
          {translate('Сканер штрих-кода')}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={stopScanning}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <Box
          component="div"
          ref={scannerHtmlRef}
          id="barcode-reader-container"
        />
        {isScannerLoading && <CircularProgress />}
      </Dialog>
      {children({ startScanning, stopScanning })}
    </>
  );
};
