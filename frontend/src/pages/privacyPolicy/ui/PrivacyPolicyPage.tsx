import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PrivacyPolicyContent } from 'entities/privacyPolicy';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { useOverrideShell } from 'shared/providers';

const PrivacyPage = observer(() => {
  const translate = useTranslate();

  useOverrideShell({
    title: translate(
      'Политика конфидициальности и обработки персональных данных приложением',
    ),
    backAction: paths.auth({}),
    actions: <></>,
  });

  return (
    <Box>
      <PrivacyPolicyContent />
    </Box>
  );
});

export default PrivacyPage;
