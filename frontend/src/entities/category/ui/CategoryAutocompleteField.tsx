import { Box, BoxProps } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useInfiniteQuery } from 'mst-query';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  DictionaryAutocomplete,
  OmittedDictionaryMultiselectType,
} from 'entities/dictionary';
import { useTranslate } from 'shared/i18n';
import { useDebounce } from 'shared/lib';
import { CategoryInstance } from '../model/categoryModel';
import { useCategoryStore } from '../query/categoryQuery';

const CategoriesAutocomplete: React.FC<
  OmittedDictionaryMultiselectType<CategoryInstance>
> = observer(({ fieldProps, ...props }) => {
  const translate = useTranslate();
  const [text, setText] = useState('');
  const debouncedText = useDebounce(text, 1000);
  const [page, setPage] = useState(1);
  const categoryStore = useCategoryStore();
  const { data, isLoading } = useInfiniteQuery(categoryStore.categoriesQuery, {
    request: {
      search: debouncedText,
    },
    pagination: { page },
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const listboxNode = event.currentTarget;
      if (
        !isLoading &&
        data?.next &&
        listboxNode.scrollHeight - listboxNode.scrollTop <=
          listboxNode.clientHeight + 10
      ) {
        setPage((page) => page + 1);
      }
    },
    [data?.next, isLoading],
  );

  const ListBoxComponent = useMemo(
    () =>
      forwardRef<BoxProps, BoxProps>((props, ref) => (
        <Box {...props} ref={ref} onScroll={handleScroll} />
      )),
    [handleScroll],
  );
  const handleInputChange = useCallback((_: any, text: string) => {
    setPage(1);
    setText(text || '');
  }, []);

  return (
    <DictionaryAutocomplete<CategoryInstance>
      options={data?.results || []}
      {...props}
      inputValue={text}
      onInputChange={handleInputChange}
      ListboxComponent={ListBoxComponent}
      loading={isLoading || props.loading}
      fieldProps={{
        label: translate('Категории'),
        placeholder: translate('Выберите категории'),
        ...fieldProps,
      }}
    />
  );
});
export const CategoryAutocompleteField = observer(
  (props: OmittedDictionaryMultiselectType<CategoryInstance>) => (
    <CategoriesAutocomplete {...props} />
  ),
);
