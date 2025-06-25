import { Container, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';
import { useTranslate } from 'shared/i18n';

const ErrorPage: React.FC = () => {
  const translate = useTranslate();
  const error: any = useRouteError();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
      <Typography variant="h1">{translate('Упс!')}</Typography>
      <Typography variant="h5">
        {translate('Извините, произошла неожиданная ошибка')}
      </Typography>
      <Typography variant="caption">
        {error.statusText || error.message}
      </Typography>
    </Container>
  );
};

export default ErrorPage;
