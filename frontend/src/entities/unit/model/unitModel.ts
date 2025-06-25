import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

import { Dictionary } from 'entities/dictionary/@x/unit';

export const Unit = types.compose('Unit', Dictionary, types.model({}));

export type UnitInstance = Instance<typeof Unit>;
export type UnitSnapshotIn = SnapshotIn<typeof Unit>;
export type UnitSnapshotOut = SnapshotOut<typeof Unit>;
