import { Box } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { SetEveryDayNutirtionTargetCard } from 'features/nutrition/setNutritionTarget';
import { LogoutButton } from 'features/user/logout';
import { SetLanguageCard } from 'features/userSettings/setLanguage';
import { useTranslate } from 'shared/i18n';
import { useOverrideShell } from 'shared/providers';

const ProfilePage = observer(() => {
  const translate = useTranslate();
  useOverrideShell({
    title: translate('Профиль'),
    backAction: null,
    actions: null,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <LogoutButton />
      <SetEveryDayNutirtionTargetCard />
      <SetLanguageCard />
    </Box>
  );
});

export default ProfilePage;
