import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useUserStore } from 'entities/user';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { getTelegramMiniAppUser } from 'shared/lib';

export const LogoutButton = observer(() => {
  const translate = useTranslate();
  const navigate = useNavigate();

  const userStore = useUserStore();

  const handleLogout = useCallback(async () => {
    await userStore.logout();
    navigate(paths.auth({}), { viewTransition: true });
  }, [navigate, userStore]);

  const tgMiniAppUser = getTelegramMiniAppUser();
  if (tgMiniAppUser) {
    return null;
  }
  return (
    <Button variant="contained" color="error" onClick={handleLogout}>
      {translate('Войти в другой аккаунт')}
    </Button>
  );
});
