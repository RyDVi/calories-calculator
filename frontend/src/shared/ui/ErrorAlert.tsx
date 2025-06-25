import { Alert, AlertProps, AlertTitle } from '@mui/material';
import { HttpError } from 'shared/api';
import { useTranslate } from 'shared/i18n';

export interface ErrorAlertProps<T extends Error = any> extends AlertProps {
  error?: T;
}

const AlertContainer: React.FC<ErrorAlertProps> = ({
  error,
  children,
  ...props
}) => {
  let errorText: string | undefined;
  if (error?.message) {
    errorText = error.message;
  }
  return (
    <Alert severity="error" {...props}>
      <AlertTitle>{errorText}</AlertTitle>
      {children}
      <br />
      <br />
      {error?.stack}
    </Alert>
  );
};

interface HttpErrorAlertProps extends ErrorAlertProps<HttpError> {
  notFound?: React.ReactNode;
}

export const HttpErrorAlert: React.FC<HttpErrorAlertProps> = (props) => {
  const { error, notFound } = props;
  const translate = useTranslate();
  if (!error || error?.status === 404) return;
  return (
    <AlertContainer {...(props as any)}>
      {error?.status === 404
        ? notFound || translate('Не найдено')
        : JSON.stringify(error.data, null, 2)}
    </AlertContainer>
  );
};

export const ErrorAlert: React.FC<HttpErrorAlertProps | ErrorAlertProps> = (
  props,
) => {
  const { error } = props;
  if (!error) return null;
  if (error.name === 'AbortError') return null;
  if (error instanceof HttpError) {
    return <HttpErrorAlert {...props} />;
  }
  return <AlertContainer {...(props as any)} />;
};
