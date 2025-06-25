import {
  Auth,
  Config,
  ConfigResponseMode,
  ConfigSource,
  OAuthName,
  OneTap,
  OneTapInternalEvents,
  WidgetEvents,
} from '@vkid/sdk';
import { observer } from 'mobx-react-lite';
import { enqueueSnackbar } from 'notistack';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import { useUserStore, VKUserRegistrationSnapshotIn } from 'entities/user';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { AuthButtonContainer } from './AuthButtonContainer';

export const VKAuthButton: React.FC<{
  onAuthorize: (data: VKUserRegistrationSnapshotIn) => void;
  onError: (error: any) => void;
}> = memo(({ onAuthorize, onError }) => {
  const ref = useRef<HTMLElement>(null);

  const handleError = useCallback(
    (error: any) => {
      if (error.code === 0) return;
      onError(error);
    },
    [onError],
  );
  const handleAuthorize = useCallback(
    (data: any) => {
      onAuthorize(data);
    },
    [onAuthorize],
  );
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    Config.init({
      app: 52894247,
      redirectUrl: 'https://foodstat.ru/',
      responseMode: ConfigResponseMode.Callback,
      source: ConfigSource.LOWCODE,
      scope: '', // Заполните нужными доступами по необходимости
    });

    const oneTap = new OneTap();

    oneTap
      .render({
        container: ref.current,
        showAlternativeLogin: true,
        styles: {
          borderRadius: 50,
        },
        oauthList: [OAuthName.VK, OAuthName.OK, OAuthName.MAIL],
      })
      .on(WidgetEvents.ERROR, handleError)
      .on(OneTapInternalEvents.LOGIN_SUCCESS, function (payload: any) {
        const code = payload.code;
        const deviceId = payload.device_id;

        Auth.exchangeCode(code, deviceId)
          .then(handleAuthorize)
          .catch(handleError);
      });
    return () => {
      oneTap.close();
    };
  }, [handleAuthorize, handleError]);
  return <AuthButtonContainer ref={ref} />;
});

export const LoginWithVKAuthButton = observer(() => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const userStore = useUserStore();

  const handleError = useCallback(
    (error: any) => {
      console.error(error);
      enqueueSnackbar(translate('Не удалось авторизоваться'), {
        variant: 'error',
        autoHideDuration: 3000,
      });
    },
    [translate],
  );

  return (
    <VKAuthButton
      onAuthorize={(user) =>
        userStore
          .loginVKWebsite(user)
          .then(() => navigate(paths.diary({}), { viewTransition: true }))
      }
      onError={handleError}
    />
  );
});
