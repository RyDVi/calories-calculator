import { Instance } from 'mobx-state-tree';
import { createModelStore } from 'mst-query';
import { useQueryStore } from 'shared/providers';
import { Unit } from '../model/unitModel';

export const UnitStore = createModelStore('UnitStore', Unit);

type UnitStoreInstance = Instance<typeof UnitStore>;

export function useUnitStore() {
  return useQueryStore().unitStore as UnitStoreInstance;
}
