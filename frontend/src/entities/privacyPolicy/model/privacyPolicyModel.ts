import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const PrivacyPolicy = types.model('PrivacyPolicy', {
  privacy_policy: types.maybeNull(types.string),
});

export type PrivacyPolicyInstance = Instance<typeof PrivacyPolicy>;
export type PrivacyPolicySnapshotIn = SnapshotIn<typeof PrivacyPolicy>;
export type PrivacyPolicySnapshotOut = SnapshotOut<typeof PrivacyPolicy>;
