import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const VKUser = types.model({
  vk_id: types.maybe(types.number),
  username: types.string,
  first_name: types.string,
  last_name: types.string,
  avatar: types.string,
});

export type VKUserInstance = Instance<typeof VKUser>;
export type VKUserSnapshotIn = SnapshotIn<typeof VKUser>;
export type VKUserSnapshotOut = SnapshotOut<typeof VKUser>;
