import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';
import { VKUserRegistration } from './registerVkUserModel';

export const VKWebsiteLoginRequest = types.model('VKWebsiteLoginRequest', {
  vk_website_user: VKUserRegistration,
});

export type VKWebsiteLoginRequestInstance = Instance<
  typeof VKWebsiteLoginRequest
>;
export type VKWebsiteLoginRequestSnapshotIn = SnapshotIn<
  typeof VKWebsiteLoginRequest
>;
export type VKWebsiteLoginRequestSnapshotOut = SnapshotOut<
  typeof VKWebsiteLoginRequest
>;
