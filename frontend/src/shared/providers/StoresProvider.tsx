import { IAnyModelType } from 'mobx-state-tree';
import { QueryClient, createContext as createMstQueryContext } from 'mst-query';
import { createContext, PropsWithChildren, useContext } from 'react';

const QueryStoreContext = createContext<QueryClient<any>['rootStore']>(
  null as any,
);
export function useQueryStore() {
  return useContext(QueryStoreContext);
}

export function StoresProvider<T extends IAnyModelType>({
  children,
  queryClientContext,
}: PropsWithChildren & {
  queryClientContext: ReturnType<typeof createMstQueryContext<T>>;
}) {
  return (
    <queryClientContext.QueryClientProvider>
      <QueryStoreContext.Provider
        value={queryClientContext.queryClient.rootStore}
      >
        {children}
      </QueryStoreContext.Provider>
    </queryClientContext.QueryClientProvider>
  );
}
