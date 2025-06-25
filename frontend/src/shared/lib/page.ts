import { useEffect } from 'react';

export interface Paginated<Data> {
  results: Data[];
  count: number;
  next?: string | null;
  previous?: string | null;
}

export function useOnScollToEnd(
  {
    data,
    isLoading,
    scollableContainer,
  }: {
    data?: Paginated<any> | null;
    isLoading?: boolean;
    scollableContainer?: HTMLElement | null;
  },
  onScollToEnd: () => void,
) {
  useEffect(() => {
    const scrollHandler = (event: Event) => {
      if (isLoading || !data?.next) return;
      const { scrollHeight, scrollTop, clientHeight } =
        event.currentTarget as HTMLElement;
      if (scrollHeight - (scrollTop + clientHeight) < 30) {
        onScollToEnd();
      }
    };

    scollableContainer?.addEventListener('scroll', scrollHandler);
    return () => {
      scollableContainer?.removeEventListener('scroll', scrollHandler);
    };
  }, [data?.next, isLoading, onScollToEnd, scollableContainer]);
}
