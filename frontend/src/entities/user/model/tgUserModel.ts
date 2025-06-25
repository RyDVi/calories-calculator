import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const TelegramUser = types.model({
  id: types.maybe(types.union(types.number, types.string)),
  tg_id: types.maybe(types.maybeNull(types.number)),
  first_name: types.optional(types.string, ''),
  last_name: types.optional(types.string, ''),
  username: types.optional(types.string, ''),
  photo_url: types.maybe(types.string),
  auth_date: types.maybe(types.number),
  hash: types.maybe(types.string),
});

export type TelegramUserInstance = Instance<typeof TelegramUser>;
export type TelegramUserSnapshotIn = SnapshotIn<typeof TelegramUser>;
export type TelegramUserSnapshotOut = SnapshotOut<typeof TelegramUser>;
