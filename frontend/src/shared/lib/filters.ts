import { useCallback, useMemo, useRef } from 'react';

import { deepFreeze } from './object';
import {
  ChangeQueryFunction,
  ObjectType,
  Queries,
  useUrlQueryActions,
} from './query';

type UrlQueryProcessor<
  FromFilters extends Record<string, any>,
  ToQuery extends ObjectType,
> = (queries: Partial<FromFilters>) => Partial<ToQuery>;

interface UseUrlQueryFiltersType<
  T extends ObjectType,
  ProcessedResult extends T = T,
> {
  /**
   * Значения по умолчанию. Если какое-либо значение будует отсутствовать в полученном списке query параметров, то оно заполнится значением отсюда.
   * Обязательно для заполнения. Обеспечивает гарантию наличия данных.
   */
  defaultQuery: Required<Queries<T>>;
  /**
   * Обрабатывает полученные query параметры нужным образом и типизирует их. Например, превращаем string в boolean проверкой на присутствие значения
   */
  fromQueryToFilters?: (queries: Required<Queries<T>>) => ProcessedResult;
  /**
   * Обрабатывает полученные данные перед отдачей их в query параметры урла
   */
  fromFiltersToQuery?: UrlQueryProcessor<ProcessedResult, T>;
  /**
   * Реплейсить (не запоминать изменения) все изменения урла или пушить (запоминать изменения)
   */
  replace?: boolean;
}

export function useUrlQueryFilters<
  T extends ObjectType,
  ProcessedResult extends Record<keyof T, any> = T,
>({
  defaultQuery,
  fromQueryToFilters,
  fromFiltersToQuery,
  replace,
}: UseUrlQueryFiltersType<T, ProcessedResult>) {
  const defaultQueryRef = useRef<Queries<T>>(
    defaultQuery || ({} as Queries<T>),
  );
  const processQueryRef = useRef<
    (queries: Required<Queries<T>>) => ProcessedResult
  >(fromQueryToFilters || ((queries) => queries as ProcessedResult));
  const processChangeUrlQueryRef = useRef<
    UrlQueryProcessor<ProcessedResult, T>
  >(fromFiltersToQuery || ((queries) => queries));

  const [urlQuery, upsertUrlQuery, setUrlQuery] = useUrlQueryActions<T>();
  const overridedQueries: ProcessedResult = useMemo(() => {
    const query = processQueryRef.current({
      ...urlQuery,
      ...Object.fromEntries(
        Object.entries(defaultQueryRef.current).map(([key, value]) => [
          key,
          urlQuery[key] || value,
        ]),
      ),
    } as Required<Queries<T>>);
    return deepFreeze(query);
  }, [urlQuery]);

  const customProcessQuery = useCallback(
    (urlQueryAction: ChangeQueryFunction<T>) =>
      (query: Partial<ProcessedResult>) =>
        urlQueryAction(processChangeUrlQueryRef.current(query), replace),
    [replace],
  );
  const processedUpsertUrlQuery: ChangeQueryFunction<ProcessedResult> = useMemo(
    () => customProcessQuery(upsertUrlQuery),
    [customProcessQuery, upsertUrlQuery],
  );
  const processedSetUrlQuery: ChangeQueryFunction<ProcessedResult> = useMemo(
    () => customProcessQuery(setUrlQuery),
    [customProcessQuery, setUrlQuery],
  );

  return [
    overridedQueries,
    processedUpsertUrlQuery,
    processedSetUrlQuery,
  ] as const;
}
