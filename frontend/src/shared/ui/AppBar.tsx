import { AppBar, AppBarProps, Toolbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PropsWithChildren } from 'react';
import { HideOnScroll } from 'shared/ui';

export const TopAppBar: React.FC<PropsWithChildren & AppBarProps> = observer(
  ({ children, ...props }) => (
    <HideOnScroll>
      <AppBar position="sticky" {...props}>
        <Toolbar>{children}</Toolbar>
      </AppBar>
    </HideOnScroll>
  ),
);

export const BottomAppBar: React.FC<PropsWithChildren & AppBarProps> = observer(
  ({ children, ...props }) => (
    <AppBar
      component="footer"
      align="center"
      position="sticky"
      color="primary"
      {...props}
      sx={{ top: 'auto', bottom: 0, ...props.sx }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        {children}
      </Toolbar>
    </AppBar>
  ),
);
