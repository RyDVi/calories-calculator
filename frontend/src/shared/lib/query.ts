import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ObjectType = {
  [P in string | number]?: string | number | null | boolean;
};
export type Queries<T extends ObjectType> = { [P in keyof T]?: string };

/**
 * This function retrieves query parameters from the current URL and returns them as a record of key-value pairs.
 */
export function useUrlQuery<T extends ObjectType>(): Queries<T> {
  const { search } = useLocation();
  return useMemo(
    () => Object.fromEntries([...new URLSearchParams(search)]) as Queries<T>,
    [search],
  );
}

export type ChangeQueryFunction<T extends ObjectType> = (
  queries: Partial<T>,
  replace?: boolean,
) => void;

/**
 * Returns a function that allows changing the query parameters in the URL and navigating to the updated URL.
 */
export function useSetUrlQuery<T extends ObjectType>(): ChangeQueryFunction<T> {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (queries, replace) => {
      const filteredQueries = Object.fromEntries(
        Object.entries(queries)
          .filter(([, value]) => {
            if (Array.isArray(value)) return value?.length;
            return value !== undefined && value !== null && value !== '';
          })
          .map(([name, value]) => [name, value]),
      );
      return navigate(
        {
          ...location,
          search: new URLSearchParams(filteredQueries as any).toString(),
        },
        { replace, viewTransition: true },
      );
    },
    [location, navigate],
  );
}

/**
 * Returns a function that can be used to update the query parameters.
 *
 * !!! Be careful when using. Only the last call will be applied, since Kovei is updated only after the render !!!
 */
export function useUpsertUrlQuery<
  T extends ObjectType,
>(): ChangeQueryFunction<T> {
  const query = useUrlQuery();
  const setQuery = useSetUrlQuery();
  return useCallback(
    (queries, replace) => setQuery({ ...query, ...queries }, replace),
    [query, setQuery],
  );
}

/**
 * Returns the queries and query manipulation functions for the current query.
 */
export function useUrlQueryActions<T extends ObjectType>(): [
  ReturnType<typeof useUrlQuery<T>>,
  ReturnType<typeof useSetUrlQuery<T>>,
  ReturnType<typeof useUpsertUrlQuery<T>>,
] {
  const query = useUrlQuery<T>();
  const upsertQuery = useUpsertUrlQuery<T>();
  const setQuery = useSetUrlQuery<T>();
  return [query, setQuery, upsertQuery];
}

/**
 * Преобразует объект query параметров в строковые значения.
 * @param  query - Объект с параметрами запроса.
 * @returns Возвращает объект с параметрами в виде строк.
 */
export function stringifyQuery(
  query: Record<string, any>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, String(value)]),
  );
}
