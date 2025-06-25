import { CssBaseline } from '@mui/material';
import { AppRouter } from 'app/routers';
import { RootProvider } from 'shared/providers';
import { queryClientContext } from './rootStore';

const App = () => (
  <RootProvider queryClientContext={queryClientContext}>
    <CssBaseline />
    <AppRouter />
  </RootProvider>
);

export default App;
