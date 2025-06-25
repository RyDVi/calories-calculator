import { Box, BoxProps } from '@mui/material';

export const VisuallyHiddenInput: React.FC<
  BoxProps & React.InputHTMLAttributes<HTMLInputElement>
> = (props) => (
  <Box
    {...props}
    component="input"
    sx={{
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      height: 1,
      overflow: 'hidden',
      position: 'absolute',
      bottom: 0,
      left: 0,
      whiteSpace: 'nowrap',
      width: 1,
      ...props.sx,
    }}
  />
);
