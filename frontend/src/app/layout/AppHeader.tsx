import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Box, ButtonProps, IconButton, TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useTranslate } from 'shared/i18n';
import { useShellContext } from 'shared/providers';
import { HtmlTitle, TopAppBar } from 'shared/ui';

const BackButton: React.FC<ButtonProps> = observer((props) => {
  const { backAction } = useShellContext();
  const actionProps: ButtonProps = {};

  if (!backAction) return null;

  if (typeof backAction === 'function') {
    actionProps.onClick = backAction;
  } else if (typeof backAction === 'string') {
    actionProps.component = Link;
    (actionProps as any).to = backAction;
  }
  return (
    <IconButton {...props} {...actionProps}>
      <ChevronLeftIcon />
    </IconButton>
  );
});

const PageTitle: React.FC<TypographyProps> = observer((props) => {
  const { title } = useShellContext();
  const translate = useTranslate();
  const siteName = translate('Калькулятор калорий');
  return (
    <>
      <HtmlTitle title={`${title || ''} ${title ? '|' : ''} ${siteName}`} />
      <Typography variant="h6" color="inherit" component="h1" {...props}>
        {title}
      </Typography>
    </>
  );
});

const Actions: React.FC = observer(() => {
  const { actions } = useShellContext();
  return (
    <Box
      sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
      children={actions}
    />
  );
});

export const AppHeader = observer(() => (
  <TopAppBar
    sx={{ bgcolor: 'background.paper', color: 'WindowText', height: 64 }}
  >
    <BackButton />
    <PageTitle />
    <Actions />
  </TopAppBar>
));
