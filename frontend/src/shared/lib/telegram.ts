import { LaunchParams } from '@telegram-apps/sdk';
import { init, retrieveLaunchParams, swipeBehavior } from '@telegram-apps/sdk';
import {
  ALLOWED_LANGUAGE_CODES,
  AllowedLanguageCodes,
  DEFAULT_LANGUAGE_CODE,
  TELEGRAM_MINI_APP_DEFAULT_LANGUAGE_CODE,
  TG_LAUNCH_PARAMS_KEY,
  TG_WEBSITE_USER_KEY,
} from 'shared/consts';

export const getTelegramLaunchParams = () => {
  try {
    return JSON.parse(
      localStorage.getItem(TG_LAUNCH_PARAMS_KEY) as any,
    ) as LaunchParams;
  } catch (err) {
    return null;
  }
};

export const getTelegramMiniAppUser = () => {
  const launchParams = getTelegramLaunchParams();
  return launchParams?.initData?.user;
};

export const setTelegramMiniAppUser = (launchParams: LaunchParams) => {
  localStorage.setItem(TG_LAUNCH_PARAMS_KEY, JSON.stringify(launchParams));
};

export const initTelegramFunctionality = () => {
  if ((window as any).Telegram.WebApp.initData) {
    try {
      const launchParams = retrieveLaunchParams();
      setTelegramMiniAppUser(launchParams);
    } catch {
      // nothing
    }

    try {
      init();
      if (swipeBehavior.mount.isAvailable()) {
        swipeBehavior.mount();
        swipeBehavior.isMounted();
        swipeBehavior.disableVertical();
        swipeBehavior.isVerticalEnabled();
      }
    } catch (err) {
      console.error(err);
    }
  }
};

export const logoutTelegramUser = () => {
  // Не удаляем, потому что для мини приложений необходимо где-то хранить информацию всегда
  // localStorage.removeItem(TG_LAUNCH_PARAMS_KEY);
  localStorage.removeItem(TG_WEBSITE_USER_KEY);
};

export const getUserLanguageCode = (
  languageCode?: AllowedLanguageCodes,
): AllowedLanguageCodes => {
  if (languageCode) return languageCode;
  const tgMiniAppUser = getTelegramMiniAppUser();
  if (tgMiniAppUser) {
    if (
      tgMiniAppUser?.languageCode &&
      ALLOWED_LANGUAGE_CODES.some((allowedCode) =>
        tgMiniAppUser.languageCode!.includes(allowedCode),
      )
    ) {
      // Если ТГ прислал нам код языка и он в списке доступных, то устанавливаем его
      return tgMiniAppUser.languageCode as AllowedLanguageCodes;
    } else {
      // Если ТГ не прислал нам код языка или он не в списке доступных, то устанавливаем код языка по умолчанию для ТГ мини приложений
      return TELEGRAM_MINI_APP_DEFAULT_LANGUAGE_CODE;
    }
  }
  return DEFAULT_LANGUAGE_CODE;
};
