import { Box, CircularProgress } from '@mui/material';

export const FullPageLoader = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);
