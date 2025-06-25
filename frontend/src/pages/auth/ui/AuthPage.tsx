import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { DevelopLoginForm } from 'widgets/DevelopLoginForm';
import {
  LoginWithTelegramAuthButton,
  LoginWithVKAuthButton,
} from 'features/user/oauth';
import { useAutoLogin } from 'entities/user';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { useOverrideShell } from 'shared/providers';
import { ErrorAlert, FullPageLoader } from 'shared/ui';

const AuthPage = observer(() => {
  const translate = useTranslate();
  const [isLoadingLogin, errorLogin] = useAutoLogin();

  useOverrideShell({
    title: translate('Авторизация'),
    actions: <></>,
    backAction: null,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <LoginWithTelegramAuthButton />
      <LoginWithVKAuthButton />
      <DevelopLoginForm />
      {isLoadingLogin && <FullPageLoader />}
      <Typography component={Link} to={paths.privacy({})} viewTransition>
        {translate(
          'Продолжая пользоваться приложением Вы соглашаетесь с политикой конфидициальности и обработки персональных данных приложением',
        )}
      </Typography>
      <ErrorAlert error={errorLogin} sx={{ my: 1 }} />
    </Box>
  );
});

export default AuthPage;
