import { setDefaultOptions } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useUserSettingsStore } from 'entities/userSettings';
import { AllowedLanguageCodes } from 'shared/consts';
import { useTranslateSettings } from 'shared/i18n';
import { getUserLanguageCode } from 'shared/lib';

/**
 * Контролирует изменение языка в приложении
 */
const LanguageDetector = observer(() => {
  const { changeLanguage } = useTranslateSettings();
  const userSettingsStore = useUserSettingsStore();
  const languageCode = userSettingsStore?.userSettingsQuery.data?.language_code;

  useEffect(() => {
    changeLanguage(getUserLanguageCode(languageCode as AllowedLanguageCodes));
  }, [changeLanguage, languageCode]);

  useEffect(() => {
    setDefaultOptions({ locale: languageCode?.includes('en') ? enUS : ru });
  }, [languageCode]);

  return null;
});

export default LanguageDetector;
