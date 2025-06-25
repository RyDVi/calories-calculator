import { Instance, types } from 'mobx-state-tree';
import { createModelStore, createQuery } from 'mst-query';
import { useQueryStore } from 'shared/providers';
import { loadPrivacyPolicy } from '../api/privacyPolicyApi';
import { PrivacyPolicy } from '../model/privacyPolicyModel';

const PrivacyPolicyQuery = createQuery('PrivacyPolicyQuery', {
  data: PrivacyPolicy,
  endpoint({ signal }) {
    return loadPrivacyPolicy({ signal });
  },
});

export const PrivacyPolicyStore = createModelStore(
  'PrivacyPolicyStore',
  PrivacyPolicyQuery,
).props({
  privacyPolicyQuery: types.optional(PrivacyPolicyQuery, {}),
});

type PrivacyPolicyStoreInstance = Instance<typeof PrivacyPolicyStore>;

export function usePrivacyPolicyStore() {
  return useQueryStore().privacyPolicyStore as PrivacyPolicyStoreInstance;
}
