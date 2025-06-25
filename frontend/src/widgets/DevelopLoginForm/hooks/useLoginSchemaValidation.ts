import { useMemo } from 'react';
import * as yup from 'yup';
import { useTranslate } from 'shared/i18n';

export function useLoginSchemaValidation() {
  const translate = useTranslate();
  return useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .min(4)
          .required(translate('Необходимо заполнить')),
        password: yup
          .string()
          .min(4)
          .required(translate('Необходимо заполнить')),
      }),
    [translate],
  );
}
