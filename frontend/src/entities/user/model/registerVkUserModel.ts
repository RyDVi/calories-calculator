import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

export const VKUserRegistration = types.model('VKUserRegistration', {
  refresh_token: types.string,
  access_token: types.string,
  id_token: types.string,
  token_type: types.string,
  expires_in: types.number,
  user_id: types.number,
  state: types.string,
  scope: types.string,
});

export type VKUserRegistrationInstance = Instance<typeof VKUserRegistration>;
export type VKUserRegistrationSnapshotIn = SnapshotIn<
  typeof VKUserRegistration
>;
export type VKUserRegistrationSnapshotOut = SnapshotOut<
  typeof VKUserRegistration
>;
