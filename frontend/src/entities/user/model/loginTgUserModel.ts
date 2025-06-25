import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

export const TgLoginRequest = types.model('TgLoginRequest', {
  tg_init_data_raw: types.string,
});

export type TgLoginRequestRequestInstance = Instance<typeof TgLoginRequest>;
export type TgLoginRequestRequestSnapshotIn = SnapshotIn<typeof TgLoginRequest>;
export type TgLoginRequestRequestSnapshotOut = SnapshotOut<
  typeof TgLoginRequest
>;
