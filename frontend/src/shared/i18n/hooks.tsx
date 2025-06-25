import { changeLanguage } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export function useTranslate() {
  const [translate] = useTranslation();
  return translate;
}
export function useTranslateSettings() {
  return useMemo(
    () => ({
      changeLanguage,
    }),
    [],
  );
}
