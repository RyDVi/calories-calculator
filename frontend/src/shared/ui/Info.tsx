import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { PropsWithChildren } from 'react';
import { useTranslate } from 'shared/i18n';

export const NotFound: React.FC<
  PropsWithChildren<{ icon?: React.ReactNode }>
> = ({ children, icon }) => {
  const translate = useTranslate();
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4">
          {children || translate('Не найдено')}
        </Typography>
        {icon || <DoNotDisturbAltIcon fontSize="large" />}
      </Box>
    </Box>
  );
};
