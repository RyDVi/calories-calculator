import { observer } from 'mobx-react-lite';
import React, { memo, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router';
import { TelegramUserSnapshotIn, useUserStore } from 'entities/user';
import { paths } from 'shared/consts';
import { AuthButtonContainer } from './AuthButtonContainer';

const TelegramAuthButton: React.FC<{
  onTelegramAuth: (tgUser: TelegramUserSnapshotIn) => void;
}> = memo(({ onTelegramAuth }) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'FoodStatBot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    element.appendChild(script);

    (window as any).onTelegramAuth = function (user: any) {
      onTelegramAuth(user);
    };
    return () => {
      element.removeChild(script);
    };
  }, [onTelegramAuth]);

  return <AuthButtonContainer ref={ref} />;
});

export const LoginWithTelegramAuthButton = observer(() => {
  const navigate = useNavigate();
  const userStore = useUserStore();
  return (
    <TelegramAuthButton
      onTelegramAuth={(user) =>
        userStore
          .loginTgWebsite(user)
          .then(() => navigate(paths.diary({}), { viewTransition: true }))
      }
    />
  );
});
