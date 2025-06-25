import React from 'react';
import { VisuallyHiddenInput } from './VisuallyHiddenInput';

export const HiddenFileUploadInput: React.FC<
  Omit<Parameters<typeof VisuallyHiddenInput>[0], 'onChange'> & {
    onChange?: (base64Data: string | ArrayBuffer | null) => void;
  }
> = ({ onChange, ...props }) => (
  <VisuallyHiddenInput
    {...props}
    type="file"
    onChange={(event) => {
      event.preventDefault();
      event.stopPropagation();
      const target = event.target as any;
      const value = target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(value);
      reader.onloadend = function () {
        const base64data = reader.result;
        target.value = '';
        onChange?.(base64data);
      };
    }}
  />
);
