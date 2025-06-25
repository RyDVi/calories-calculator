import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ruRU } from '@mui/x-date-pickers/locales';
import { closeSnackbar, SnackbarProvider } from 'notistack';
import { PropsWithChildren } from 'react';
import { ShellProvider } from './ShellProvider';
import { StoresProvider } from './StoresProvider';
import { ThemeProvider } from './ThemeProvider';

// TODO: add ErrorBoundary
export const RootProvider: React.FC<
  PropsWithChildren & Parameters<typeof StoresProvider>[0]
> = ({ children, queryClientContext }) => (
  <ShellProvider>
    <StoresProvider queryClientContext={queryClientContext}>
      <ThemeProvider>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          localeText={
            ruRU.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}
            action={(snackbarId) => (
              <IconButton onClick={() => closeSnackbar(snackbarId)}>
                <CloseIcon />
              </IconButton>
            )}
          >
            {children}
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StoresProvider>
  </ShellProvider>
);
