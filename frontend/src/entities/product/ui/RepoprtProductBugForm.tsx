import { Box, Button, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';

import { ReportProductBugSnapshotIn } from 'entities/product';
import { useTranslate } from 'shared/i18n';
import { MuiFormikField } from 'shared/ui';
import {
  ReportProductBugSchemaValidationType,
  useReportProductBugSchemaValidation,
} from '../hooks/useReportProductBugSchemaValidation';

export const ReportProductBugForm: React.FC<{
  onSubmit: (data: Omit<ReportProductBugSnapshotIn, 'product'>) => void;
}> = ({ onSubmit }) => {
  const translate = useTranslate();
  const reportProductBugSchema = useReportProductBugSchemaValidation();
  return (
    <Formik<ReportProductBugSchemaValidationType>
      initialValues={{ message: '' }}
      onSubmit={onSubmit}
      validationSchema={reportProductBugSchema}
    >
      <Box
        component={Form}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <MuiFormikField name="message">
          {(props: any) => (
            <TextField
              {...props}
              label={translate('Текст сообщения')}
              rows={8}
              placeholder={translate(
                'Введите текст сообщения с описание ошибки',
              )}
              autoFocus
              fullWidth
              multiline
            />
          )}
        </MuiFormikField>
        <Button type="submit" variant="contained">
          {translate('Сообщить об ошибке')}
        </Button>
      </Box>
    </Formik>
  );
};
