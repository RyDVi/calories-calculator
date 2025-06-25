import { Box, Button, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { LoginRequestSnapshotIn, useUserStore } from 'entities/user';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { MuiFormikField, PasswordField } from 'shared/ui';
import { useLoginSchemaValidation } from '../hooks/useLoginSchemaValidation';

/**
 * Форма входа только для разработки
 */
export const DevelopLoginForm = observer(() => {
  if (!import.meta.env.DEV) return null;

  const translate = useTranslate();
  const navigate = useNavigate();
  const userStore = useUserStore();

  const [loginUserMutation] = useMutation(userStore.loginUserMutation);
  const handleLogin = useCallback(
    async (credentials: LoginRequestSnapshotIn) => {
      const { data, error } = await loginUserMutation({ request: credentials });
      if (!error && data) {
        userStore.authorize(data);
        navigate(paths.profile({}), { replace: true, viewTransition: true });
      } else {
        enqueueSnackbar(translate('Не удалось авторизоваться'), {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    },
    [loginUserMutation, userStore, navigate, translate],
  );
  const loginFormSchema = useLoginSchemaValidation();
  if (userStore.isWasRegisteredNow) return null;
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleLogin}
      validationSchema={loginFormSchema}
    >
      <Box component={Form}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1,auto)',
            gap: 1,
          }}
        >
          <MuiFormikField name="username">
            {(props: any) => (
              <TextField {...props} label={translate('Логин')} autoFocus />
            )}
          </MuiFormikField>
          <MuiFormikField name="password">
            {(props: any) => <PasswordField {...props} />}
          </MuiFormikField>
          <Button type="submit" variant="contained">
            {translate('Войти')}
          </Button>
        </Box>
      </Box>
    </Formik>
  );
});
