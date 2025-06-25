import { Instance, types } from 'mobx-state-tree';
import { createModelStore, createQuery } from 'mst-query';
import { useQueryStore } from 'shared/providers';
import { getDictionaries } from '../api/dictionaryApi';
import { Dictionaries } from '../model/dictionariesModel';

export const DictionariesQuery = createQuery('DictionariesQuery', {
  data: Dictionaries,
  endpoint({ signal }) {
    return getDictionaries({ signal });
  },
});

export const DictionariesStore = createModelStore(
  'DictionariesStore',
  DictionariesQuery,
).props({
  dictionariesQuery: types.optional(DictionariesQuery, {}),
});

type DictionariesStoreInstance = Instance<typeof DictionariesStore>;

export function useDictionariesStore() {
  return useQueryStore().dictionariesStore as DictionariesStoreInstance;
}
