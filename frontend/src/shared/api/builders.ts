import { getToken } from 'shared/auth';
import { isAbsoluteUrl, stringifyQuery } from 'shared/lib';
import { Primitives } from './type';

/**
 * Создаёт полный URL API на основе базового URL и параметров запроса.
 * @param path - Путь к ресурсу API.
 * @param query - Параметры запроса.
 * @returns Полный URL в виде строки.
 */
export function buildApiUrl(
  path: string,
  query?: string[][] | Record<string, Primitives> | URLSearchParams,
) {
  const base = isAbsoluteUrl(process.env.API_URL)
    ? process.env.API_URL
    : `${window.location.origin}${process.env.API_URL || ''}`;
  const subpath = `${process.env.BASE_API_URL || ''}${path}/`.replace(
    /\/\//g,
    '/',
  );
  const url = new URL(subpath, base);
  url.search = new URLSearchParams(
    typeof query === 'object' ? stringifyQuery(query) : query,
  ).toString();
  return url.toString();
}

/**
 * Формирует заголовки для запроса.
 * Включает токен аутентификации и CSRF-токен, если они доступны.
 * @returns Объект с заголовками запроса.
 */
export function buildHeaders() {
  const token = getToken();
  const csrftoken = new URLSearchParams(document.cookie).get('csrftoken');
  return {
    ...(token ? { Authorization: `Token ${getToken() || ''}` } : {}),
    ...(csrftoken ? { 'X-CSRFToken': csrftoken } : {}),
    'Content-Type': 'application/json',
  };
}
