import { types, Instance, SnapshotIn, SnapshotOut } from 'mobx-state-tree';

export const LoginRequest = types.model('LoginRequest', {
  password: types.string,
  username: types.string,
});

export type LoginRequestInstance = Instance<typeof LoginRequest>;
export type LoginRequestSnapshotIn = SnapshotIn<typeof LoginRequest>;
export type LoginRequestSnapshotOut = SnapshotOut<typeof LoginRequest>;
