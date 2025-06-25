import { buildApiUrl, makeRequest } from 'shared/api';
import {
  UserSettingsInstance,
  UserSettingsSnapshotIn,
} from '../model/userSettingsModel';

export const updateUserSettings = (
  userSettings: UserSettingsSnapshotIn,
): Promise<UserSettingsInstance> =>
  makeRequest(buildApiUrl('/user_settings'), {
    method: 'PUT',
    body: JSON.stringify(userSettings),
  });

export const loadUserSettings = (
  options?: any,
): Promise<UserSettingsInstance> =>
  makeRequest(buildApiUrl('/user_settings'), options);
