import { buildApiUrl, buildHeaders } from './builders';

const __INTERCEPTORS__ = new Set<(...props: any) => void>();

export const registerInterceptor = (interceptor: (...props: any) => void) => {
  __INTERCEPTORS__.add(interceptor);
};

export const unregisterInterceptor = (interceptor: (...props: any) => void) => {
  __INTERCEPTORS__.delete(interceptor);
};

const notifyInterceptors = (error: any, data: any) => {
  __INTERCEPTORS__.forEach((interceptor) => interceptor(error, data));
};
export class HttpError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`HTTP Error: ${status}`); // Сообщение ошибки
    this.status = status;
    this.data = data;

    // Захватываем стек трассировки
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

export const makeRequest = async (url: string, options: any = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...buildHeaders(),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    // nothing
  }
  if (!response.ok) {
    notifyInterceptors(response, data);
    throw new HttpError(response.status, data);
  }

  return data;
};

export const makeCreateUpdateRequest =
  <D extends { id: string }, Result>(
    url: string,
    { apiLookupField = 'id' } = {},
  ) =>
  (data: D, options?: any): Promise<Result> =>
    makeRequest(
      buildApiUrl(
        `${url}/${data.id === 'new' ? '' : data[apiLookupField as keyof D]}`,
      ),
      {
        ...options,
        body: JSON.stringify(data.id === 'new' ? { ...data, id: null } : data),
        method: data.id === 'new' ? 'POST' : 'PUT',
      },
    );

export const makeRemoveRequest =
  (url: string) =>
  async (id: string, options?: any): Promise<string> => {
    const result = await makeRequest(buildApiUrl(`${url}/${id}`), {
      ...options,
      method: 'DELETE',
    });
    return result || id;
  };
