import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { TelegramUser } from './tgUserModel';

export const TgWebsiteLoginRequest = types.model('TgWebsiteLoginRequest', {
  tg_website_user: TelegramUser,
});

export type TgWebsiteLoginRequestInstance = Instance<
  typeof TgWebsiteLoginRequest
>;
export type TgWebsiteLoginRequestSnapshotIn = SnapshotIn<
  typeof TgWebsiteLoginRequest
>;
export type TgWebsiteLoginRequestSnapshotOut = SnapshotOut<
  typeof TgWebsiteLoginRequest
>;
