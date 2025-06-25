import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const Dictionary = types.model('Dictionary', {
  id: types.identifier,
  name: types.string,
});

export type DictionaryInstance = Instance<typeof Dictionary>;
export type DictionarySnapshotIn = SnapshotIn<typeof Dictionary>;
export type DictionarySnapshotOut = SnapshotOut<typeof Dictionary>;
