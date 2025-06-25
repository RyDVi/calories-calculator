import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';

export const AuthButtonContainer = forwardRef<any, BoxProps>((props, ref) => (
  <Box
    ref={ref}
    {...props}
    sx={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  />
));
