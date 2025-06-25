import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ShellContextProps {
  actions?: React.ReactNode;
  title?: string | null;
  backAction?: string | (() => void) | null;
  pageContainer?: HTMLElement | null;
}

export interface ShellContextActionsProps {
  setActions: (actions: React.ReactNode) => void;
  clearAll: () => void;
  setTitle: (title: string | null) => void;
  setBackAction: (action: string | (() => void) | null) => void;
  setPageContainer: (pageContainer: HTMLElement) => void;
}

const ShellContext = createContext<ShellContextProps>({
  actions: null,
  backAction: null,
});

const ShellContextActions = createContext<ShellContextActionsProps>({
  setTitle: () => null,
  setActions: () => null,
  clearAll: () => null,
  setBackAction: () => null,
  setPageContainer: () => null,
});

export const ShellProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [pageContainer, setPageContainer] =
    useState<ShellContextProps['pageContainer']>(null);
  const [actions, setActions] = useState<ShellContextProps['actions']>(null);
  const [title, setTitle] = useState<ShellContextProps['title']>(null);
  const [backAction, setBackAction] =
    useState<ShellContextProps['backAction']>(null);

  const clearAll = useCallback(() => {
    setActions(null);
    setTitle(null);
    setBackAction(null);
    setPageContainer(null);
  }, []);

  const shellContextValue = useMemo(
    () => ({ actions, title, backAction, pageContainer }),
    [actions, backAction, pageContainer, title],
  );

  const shellContextActionsValue = useMemo(
    () => ({
      setActions,
      clearAll,
      setTitle,
      setBackAction,
      setPageContainer,
    }),
    [clearAll],
  );

  return (
    <ShellContextActions.Provider value={shellContextActionsValue}>
      <ShellContext.Provider value={shellContextValue}>
        {children}
      </ShellContext.Provider>
    </ShellContextActions.Provider>
  );
};

export function useShellContext() {
  return useContext(ShellContext);
}

export function useShellActionsContext() {
  return useContext(ShellContextActions);
}

export const useOverrideShell = ({
  actions,
  title,
  backAction,
}: ShellContextProps) => {
  const { setActions, setTitle, setBackAction } = useShellActionsContext();
  useEffect(() => {
    if (actions !== undefined) {
      setActions(actions);
    }
    if (title !== undefined) {
      setTitle(title);
    }
    if (backAction !== undefined) {
      setBackAction(() => backAction);
    }
  }, [actions, backAction, setActions, setBackAction, setTitle, title]);
  return null;
};
