import { buildApiUrl, makeRequest } from 'shared/api';
import { TgLoginRequestRequestSnapshotIn } from '../model/loginTgUserModel';
import { TgWebsiteLoginRequestSnapshotIn } from '../model/loginTgUserWebsiteModel';
import { LoginRequestSnapshotIn } from '../model/loginUserModel';
import { VKWebsiteLoginRequestSnapshotIn } from '../model/loginVkUserWebsiteModel';
import { UserInstance } from '../model/userModel';

export const login = (
  credentials: LoginRequestSnapshotIn,
): Promise<UserInstance> =>
  makeRequest(buildApiUrl('/login_user'), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const loginWithExternalService = (
  credentials:
    | TgLoginRequestRequestSnapshotIn
    | TgWebsiteLoginRequestSnapshotIn
    | VKWebsiteLoginRequestSnapshotIn,
): Promise<UserInstance> =>
  makeRequest(buildApiUrl('/login_with_external_service'), {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const register = (): Promise<UserInstance> =>
  makeRequest(buildApiUrl('/register'), {
    method: 'POST',
    body: JSON.stringify({}),
  });
