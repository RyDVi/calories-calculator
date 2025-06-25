import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { User } from 'entities/user';

export const UserSettings = types.model('UserSettings', {
  id: types.identifier,
  // На фронте обязательно должен быть language_code
  language_code: types.string,
  user: types.safeReference(User),
});

export type UserSettingsInstance = Instance<typeof UserSettings>;
export type UserSettingsSnapshotIn = SnapshotIn<typeof UserSettings>;
export type UserSettingsSnapshotOut = SnapshotOut<typeof UserSettings>;
