import { logoutTelegramUser } from 'shared/lib';

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (err) {
    return null;
  }
};

export const setUser = (user: { auth_token: string }) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem('user');
  logoutTelegramUser();
};
