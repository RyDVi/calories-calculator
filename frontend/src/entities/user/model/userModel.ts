import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { withSetPropAction } from 'shared/lib';
import { TelegramUser } from './tgUserModel';
import { VKUser } from './vkUserModel';

export const User = types
  .model('User', {
    user_id: types.string,
    auth_token: types.string,
    first_name: types.optional(types.string, ''),
    last_name: types.optional(types.string, ''),
    password: types.optional(types.string, ''),
    username: types.optional(types.string, ''),
    created_password: types.optional(types.string, ''),
    tg_user: types.maybe(types.maybeNull(TelegramUser)),
    vk_user: types.maybe(types.maybeNull(VKUser)),
    authenticationMethod: types.optional(
      types.enumeration(['tg_mini_app', 'tg_website', 'vk_website', 'unknown']),
      'unknown',
    ),
  })
  .actions(withSetPropAction);

export type UserInstance = Instance<typeof User>;
export type UserSnapshotIn = SnapshotIn<typeof User>;
export type UserSnapshotOut = SnapshotOut<typeof User>;
