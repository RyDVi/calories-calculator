import {
  Card,
  CardContent,
  CardHeader,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useMutation } from 'mst-query';
import { useCallback } from 'react';
import {
  UserSettingsSnapshotIn,
  useUserSettingsStore,
} from 'entities/userSettings';
import {
  ALLOWED_LANGUAGE_CODES,
  LANGUAGE_CODE_TRANSLATES_MAP,
} from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { ErrorAlert, FullPageLoader } from 'shared/ui';

export const SetLanguageCard = observer(() => {
  const {
    userSettingsMutation,
    userSettingsQuery,
    userSettingsQuery: { isLoading, error },
  } = useUserSettingsStore();
  const [mutateUserSettings, { isLoading: isMutating, error: mutationError }] =
    useMutation(userSettingsMutation);
  const translate = useTranslate();
  const handleChange = useCallback(
    async (_: any, languageCode: string) => {
      if (languageCode) {
        applySnapshot(userSettingsQuery.data as any, {
          ...(getSnapshot(userSettingsQuery.data!) as any),
          language_code: languageCode,
        });
        await mutateUserSettings({
          request: userSettingsQuery.data as UserSettingsSnapshotIn,
        });
      }
    },
    [mutateUserSettings, userSettingsQuery.data],
  );

  return (
    <Card>
      <CardHeader title={translate('Изменить язык')} />
      <CardContent>
        {(isLoading || isMutating) && <FullPageLoader />}
        {(error || mutationError) && (
          <ErrorAlert error={error || mutationError} />
        )}
        <ToggleButtonGroup
          color="primary"
          value={userSettingsQuery.data?.language_code}
          exclusive
          onChange={handleChange}
        >
          {ALLOWED_LANGUAGE_CODES.map((languageCode) => (
            <ToggleButton key={languageCode} value={languageCode}>
              {LANGUAGE_CODE_TRANSLATES_MAP[languageCode]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
});
