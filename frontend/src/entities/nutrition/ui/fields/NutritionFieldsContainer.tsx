import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

export const NutritionFieldsContainer: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2,auto)',
      gap: 1,
    }}
  >
    {children}
  </Box>
);
