import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Field, FieldProps, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as yup from 'yup';
import { MealTimeInstance } from 'entities/mealtime';
import { useTranslate } from 'shared/i18n';
import { MuiFormikField } from 'shared/ui';

function useDiarySchema() {
  const translate = useTranslate();
  return useMemo(
    () =>
      yup.object({
        count: yup
          .number()
          .when('countVariant', {
            is: 'fraction',
            then: (schema) => schema.min(1),
            otherwise: (schema) => schema.min(0),
          })
          .required(translate('Необходимо заполнить')),
        count_fractions_in_product: yup
          .number()
          .min(1)
          .when('countVariant', {
            is: 'fraction',
            then: (schema) =>
              schema.required(translate('Необходимо заполнить')),
            otherwise: (schema) => schema.notRequired(),
          }),
        editType: yup.string().required(translate('Необходимо заполнить')),
        countVariant: yup.string().required(translate('Необходимо заполнить')),
      }),
    [translate],
  );
}

type DiarySchemaType = yup.InferType<ReturnType<typeof useDiarySchema>>;

const DEFAULT_COUNT_FRACTIONS = null;

export const EditMealTimeCountDialog: React.FC<
  Omit<DialogProps, 'onClose' | 'open' | 'onChange'> & {
    onClose?: () => void;
    mealTime?: MealTimeInstance | null;
    onChange?: (data: DiarySchemaType) => void;
  }
> = observer(({ mealTime, onChange, ...props }) => {
  const translate = useTranslate();
  const diarySchema = useDiarySchema();
  if (!mealTime?.product) return null;
  return (
    <Dialog
      {...props}
      open={!!mealTime}
      fullWidth
      sx={{ marginBottom: 'env(keyboard-inset-height)', ...props.sx }}
    >
      <DialogTitle sx={{ mr: 3 }}>
        {translate('Изменение количества')}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ width: '500px', maxWidth: '80vw' }}>
        <Formik
          initialValues={
            mealTime.count_fractions_in_product || mealTime.count === 1
              ? {
                  count: null,
                  count_fractions_in_product:
                    mealTime?.count_fractions_in_product,
                  editType: 'set',
                  countVariant: 'fraction',
                }
              : {
                  count: null,
                  count_fractions_in_product: null,
                  editType: 'set',
                  countVariant: 'exact_meaning',
                }
          }
          onSubmit={(data) => onChange?.(data as any)}
          validationSchema={diarySchema}
        >
          <Form>
            <Field name="countVariant">
              {({
                field: { onBlur, value, name },
                form: { setFieldValue },
              }: FieldProps) => (
                <Box sx={{ mb: 2 }}>
                  <Typography>{translate('Отобразить данные:')}</Typography>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    fullWidth
                    value={value}
                    onChange={(_, value) => {
                      if (value === 'exact_meaning' && mealTime) {
                        setFieldValue('count', null);
                        setFieldValue('count_fractions_in_product', null);
                      } else if (value === 'fraction') {
                        setFieldValue('count', null);
                        setFieldValue(
                          'count_fractions_in_product',
                          mealTime.count_fractions_in_product ||
                            DEFAULT_COUNT_FRACTIONS,
                        );
                      }
                      if (value != null) {
                        return setFieldValue(name, value);
                      }
                    }}
                    onBlur={onBlur}
                  >
                    <ToggleButton name="fraction" value="fraction">
                      {translate('Дробь')}
                    </ToggleButton>
                    <ToggleButton name="exact_meaning" value="exact_meaning">
                      {translate('Точное значение')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}
            </Field>
            <Field name="countVariant">
              {({
                field: { value: countVariant },
                form: { setFieldValue },
              }: FieldProps) => {
                if (countVariant === 'fraction') {
                  return (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 2,
                      }}
                    >
                      <MuiFormikField name="count">
                        {(props: any) => (
                          <TextField
                            label={translate('Сколько')}
                            {...props}
                            type="number"
                            autoFocus
                          />
                        )}
                      </MuiFormikField>
                      <MuiFormikField name="count_fractions_in_product">
                        {(props: any) => (
                          <TextField
                            label={translate('Из скольки')}
                            {...props}
                            type="number"
                            disabled={!!mealTime?.count_fractions_in_product}
                          />
                        )}
                      </MuiFormikField>
                    </Box>
                  );
                }
                if (countVariant === 'exact_meaning') {
                  if (!mealTime?.product?.quantity) return null;
                  return (
                    <MuiFormikField name="count">
                      {(props: any) => (
                        <TextField
                          label={`${translate('Количество')} ${mealTime?.product?.unit.name.toLowerCase()}`}
                          {...props}
                          fullWidth
                          type="number"
                          value={props.value}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            setFieldValue('count', Math.floor(value));
                          }}
                          autoFocus
                        />
                      )}
                    </MuiFormikField>
                  );
                }
                return null;
              }}
            </Field>
            <Field name="editType">
              {({
                field: { name },
                form: { submitForm, setFieldValue },
              }: FieldProps) => (
                <Stack spacing={1} sx={{ mt: 3 }}>
                  <Button
                    onClick={() => {
                      setFieldValue(name, 'set');
                      submitForm();
                    }}
                    fullWidth
                    variant="contained"
                  >
                    {translate('Установить')}
                  </Button>
                  <Button
                    onClick={() => {
                      setFieldValue(name, 'add');
                      submitForm();
                    }}
                    fullWidth
                    variant="contained"
                  >
                    {translate('Добавить')}
                  </Button>
                  <Button
                    onClick={() => {
                      setFieldValue(name, 'sub');
                      submitForm();
                    }}
                    fullWidth
                    variant="contained"
                  >
                    {translate('Уменьшить')}
                  </Button>
                </Stack>
              )}
            </Field>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
});
