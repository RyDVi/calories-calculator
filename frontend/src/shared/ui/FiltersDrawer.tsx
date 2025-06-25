import { Button, Container, Drawer, DrawerProps } from '@mui/material';
import { memo } from 'react';
import { useTranslate } from 'shared/i18n';
import { BottomAppBar } from './AppBar';

export const FiltersDrawer: React.FC<DrawerProps> = memo(
  ({ children, ...props }) => {
    const translate = useTranslate();
    return (
      <Drawer anchor="right" {...props}>
        <Container sx={{ height: '100vh' }}>{children}</Container>
        <BottomAppBar color="transparent">
          <Button type="submit" fullWidth>
            {translate('Применить')}
          </Button>
        </BottomAppBar>
      </Drawer>
    );
  },
);
