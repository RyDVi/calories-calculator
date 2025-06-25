import { getUser, setUser } from './user';

/**
 * Получает токен из локального хранилища.
 * @returns Возвращает токен аутентификации или null, если токена нет.
 */
export const getToken = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.auth_token;
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  const user = getUser();
  if (!user) return;
  user.auth_token = token;
  setUser(user);
};
