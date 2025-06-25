import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { Unit } from 'entities/unit/@x/dictionary';

export const Dictionaries = types
  .model('Dictionaries', {
    units: types.array(types.reference(Unit)),
    default_unit: types.maybeNull(types.reference(Unit)),
  })
  .preProcessSnapshot((snapshot) => ({
    ...snapshot,
    units: snapshot?.units?.slice(),
  }));

export type DictionariesInstance = Instance<typeof Dictionaries>;
export type DictionariesSnapshotIn = SnapshotIn<typeof Dictionaries>;
export type DictionariesSnapshotOut = SnapshotOut<typeof Dictionaries>;
