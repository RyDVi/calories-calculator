import {
  createTheme,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import { ruRU as coreRuRu } from '@mui/material/locale';
import { ruRU } from '@mui/x-date-pickers/locales';
import { observer } from 'mobx-react-lite';
import { PropsWithChildren } from 'react';

const getDesignToken = (themeOptions: ThemeOptions): Theme =>
  createTheme({
    ...themeOptions,
    palette: {
      ...themeOptions.palette,
      primary: {
        main: '#5e69ee',
        ...themeOptions.palette?.primary,
      },
      secondary: {
        main: '#F4F4FB',
        ...themeOptions.palette?.secondary,
      },
      info: {
        main: '#39AFEA',
      },
      // accent: #39AFEA
      background: {
        // paper: '#FFF490',
        // default: '#FFF490',
        ...themeOptions.palette?.background,
      },
      action: {
        // active: '#ffb300',
        // hover: '#ffca28',
        // focus: '#ffca28',
        // selected: '#fff9c4',
        // disabledBackground: '#fff9c4',
        ...themeOptions.palette?.action,
      },
    },
    ...({
      ruRU,
      coreRuRu,
    } as any),
  });

const lightTheme = getDesignToken({
  palette: {
    mode: 'light',
  },
});

const darkTheme = getDesignToken({
  palette: {
    mode: 'light',
    // text: {
    //   primary: 'rgba(0, 0, 0, 0.87)',
    //   secondary: 'rgba(0, 0, 0, 0.6)',
    //   disabled: 'rgba(0, 0, 0, 0.38)',
    // },
    // divider: 'rgba(0, 0, 0, 0.12)',
  },
});

export const ThemeProvider: React.FC<PropsWithChildren> = observer(
  ({ children }) => {
    const isDark = false;
    // TODO: переключение темы на событие изменения темы
    return (
      <MuiThemeProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </MuiThemeProvider>
    );
  },
);
