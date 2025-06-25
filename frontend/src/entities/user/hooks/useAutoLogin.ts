import { useMutation } from 'mst-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { paths } from 'shared/consts';
import { useUserStore } from '../query/userQuery';

export function useAutoLogin() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const [, { isLoading: isLoadingLogin, error: errorLogin }] = useMutation(
    userStore.loginUserMutation,
  );

  useEffect(() => {
    if (!userStore.currentUser) {
      userStore.autoLogin().then(() => {
        if (!userStore.isWasAutoRegisteredNow && userStore.currentUser) {
          navigate(paths.profile({}), { viewTransition: true });
        }
      });
    }
  }, [navigate, userStore]);
  return [isLoadingLogin, errorLogin] as const;
}
