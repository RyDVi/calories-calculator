import { getSnapshot, Instance, types } from 'mobx-state-tree';
import { createModelStore, createMutation, createQuery } from 'mst-query';
import { withSetPropAction } from 'shared/lib';
import { getUserLanguageCode } from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import { loadUserSettings, updateUserSettings } from '../api/userSettingsApi';
import {
  UserSettings,
  UserSettingsSnapshotIn,
} from '../model/userSettingsModel';

const UpdateUserSettings = createMutation('UpdateUserSettings', {
  data: types.reference(UserSettings),
  request: types.union(types.reference(UserSettings), UserSettings),
  endpoint({ request }) {
    return updateUserSettings(getSnapshot(request) as UserSettingsSnapshotIn);
  },
});

const UserSettingsQuery = createQuery('UserSettingsQuery', {
  data: types.reference(UserSettings),
  async endpoint({ signal }) {
    const response = await loadUserSettings({ signal });
    response.language_code = getUserLanguageCode(response.language_code as any);
    return response;
  },
});

export const UserSettingsStore = createModelStore(
  'UserSettingsStore',
  UserSettings,
)
  .props({
    userSettingsMutation: types.optional(UpdateUserSettings, {}),
    userSettingsQuery: types.optional(UserSettingsQuery, {}),
  })
  .actions(withSetPropAction);

export type UserSettingsStoreInstance = Instance<typeof UserSettingsStore>;

export function useUserSettingsStore() {
  return useQueryStore().userSettingsStore as UserSettingsStoreInstance;
}
