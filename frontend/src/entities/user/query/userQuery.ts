import { flow, getSnapshot, Instance, types } from 'mobx-state-tree';
import { createModelStore, createMutation, onMutate } from 'mst-query';
import { getUser, logoutUser, setUser } from 'shared/auth';
import { getTelegramLaunchParams, withSetPropAction } from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import { login, loginWithExternalService, register } from '../api/userApi';
import {
  TgLoginRequest,
  TgLoginRequestRequestInstance,
} from '../model/loginTgUserModel';
import {
  TgWebsiteLoginRequest,
  TgWebsiteLoginRequestInstance,
} from '../model/loginTgUserWebsiteModel';
import { LoginRequest, LoginRequestInstance } from '../model/loginUserModel';
import {
  VKWebsiteLoginRequest,
  VKWebsiteLoginRequestInstance,
} from '../model/loginVkUserWebsiteModel';
import { VKUserRegistrationSnapshotIn } from '../model/registerVkUserModel';
import { TelegramUserSnapshotIn } from '../model/tgUserModel';
import { User, UserInstance } from '../model/userModel';

export const LoginUserMutation = createMutation('LoginUserMutation', {
  data: User,
  request: types.union(
    LoginRequest,
    TgLoginRequest,
    TgWebsiteLoginRequest,
    VKWebsiteLoginRequest,
  ),
  endpoint({ request }) {
    if (
      (request as TgLoginRequestRequestInstance).tg_init_data_raw ||
      (request as TgWebsiteLoginRequestInstance).tg_website_user ||
      (request as VKWebsiteLoginRequestInstance).vk_website_user
    ) {
      return loginWithExternalService(getSnapshot(request as any));
    }
    return login(getSnapshot(request as LoginRequestInstance));
  },
});

export const RegisterUserMutation = createMutation('RegisterUserMutation', {
  data: User,
  endpoint() {
    return register();
  },
});

export const UserStore = createModelStore('UserStore', User)
  .props({
    isWasAutoRegisteredNow: types.optional(types.boolean, false),
    isWasRegisteredNow: types.optional(types.boolean, false),
    loginUserMutation: types.optional(LoginUserMutation, {}),
    registerUserMutation: types.optional(RegisterUserMutation, {}),
    currentUser: types.maybe(User),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    authorize: (user: UserInstance) => {
      if (user) {
        setUser(user);
        self.currentUser = getSnapshot(user) as UserInstance;
      }
    },
  }))
  .actions((self) => ({
    restoreUser() {
      const user: UserInstance | null = getUser();
      if (user?.auth_token) {
        return user;
      }
    },
    /**
     * Авторизация в мини-приложении ТГ
     */
    async loginTgMiniApp() {
      const launchParams = getTelegramLaunchParams();
      if (launchParams?.initDataRaw) {
        // Если зашли из телеграмма, то входим без регистрации. Регистрация происходит автоматически на сервере, если есть необходимость
        const { data, error } = await self.loginUserMutation.mutate({
          request: { tg_init_data_raw: launchParams?.initDataRaw },
        });
        if (!error) {
          data.setProp('authenticationMethod', 'tg_mini_app');
          setUser(data);
          self.authorize(data);
          return getSnapshot(data);
        }
      }
      return null;
    },
    /**
     * Авторизация на сайте через ТГ
     */
    async loginTgWebsite(user?: TelegramUserSnapshotIn) {
      const tgUser = user; // TODO: return it: const tgUser = user || getTelegramWebsiteUser();
      if (tgUser) {
        const { data, error } = await self.loginUserMutation.mutate({
          request: { tg_website_user: tgUser },
        });
        if (data && !error) {
          data.setProp('authenticationMethod', 'tg_website');
          setUser(data);
          self.authorize(data);
          return getSnapshot(data);
        }
      }
      return null;
    },
    async loginVKWebsite(vkUser?: VKUserRegistrationSnapshotIn) {
      if (vkUser) {
        const { data, error } = await self.loginUserMutation.mutate({
          request: { vk_website_user: vkUser },
        });
        if (data && !error) {
          data.setProp('authenticationMethod', 'vk_website');
          setUser(data);
          self.authorize(data);
          return getSnapshot(data);
        }
      }
      return null;
    },
    async login() {
      const user = getUser();
      if (user?.username && user?.created_password) {
        await self.loginUserMutation.mutate({
          request: { username: user.username, password: user.created_password },
        });
        const { data, error } = self.loginUserMutation;
        if (data && !error) {
          data.setProp('authenticationMethod', user.authenticationMethod);
          setUser(data);
          self.authorize(data);
          return getSnapshot(data);
        }
        return;
      }
    },
    async logout() {
      logoutUser();
    },
    register: flow(function* () {
      const { data, error } = yield self.registerUserMutation.mutate({
        request: null,
      });
      self.isWasAutoRegisteredNow = true;
      if (!error) {
        setUser(data);
        self.authorize(data);
        return getSnapshot(data);
      }
    }),
  }))
  .actions((self) => ({
    afterCreate() {
      onMutate(self.registerUserMutation, () => {
        self.isWasRegisteredNow = true;
      });
    },

    autoLogin: flow(function* () {
      self.restoreUser() ||
        (yield self.loginTgMiniApp()) ||
        (yield self.loginTgWebsite()) ||
        (yield self.loginVKWebsite()) ||
        (yield self.login());

      // ||
      // (yield self.register());
    }),
  }));

type UserStoreInstance = Instance<typeof UserStore>;

export function useUserStore() {
  return useQueryStore().userStore as UserStoreInstance;
}
