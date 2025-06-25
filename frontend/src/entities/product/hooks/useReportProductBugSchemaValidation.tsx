import i18next from 'i18next';
import { useMemo } from 'react';

import * as yup from 'yup';
import { useTranslate } from 'shared/i18n';

export function useReportProductBugSchemaValidation() {
  const translate = useTranslate();
  return useMemo(
    () =>
      yup.object({
        message: yup
          .string()
          .min(
            12,
            translate('Необходимо ввести минимум 12 символов для сообщения'),
          )
          .required(i18next.t('Необходимо заполнить')),
      }),
    [translate],
  );
}

export type ReportProductBugSchemaValidationType = yup.InferType<
  ReturnType<typeof useReportProductBugSchemaValidation>
>;
