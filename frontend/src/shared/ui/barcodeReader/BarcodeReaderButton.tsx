import { BarcodeReader } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { BarcodeReaderDialog, BarcodeReaderDialogProps } from './BarcodeDialog';

export const BarcodeReaderButton: React.FC<
  Omit<BarcodeReaderDialogProps, 'open' | 'onClose' | 'children'>
> = (props) => (
  <>
    <BarcodeReaderDialog {...props}>
      {({ startScanning }) => (
        <IconButton onClick={startScanning}>
          <BarcodeReader />
        </IconButton>
      )}
    </BarcodeReaderDialog>
  </>
);
