import { observer } from 'mobx-react-lite';
import { DictionariesInstance } from '../model/dictionariesModel';
import { DictionaryInstance } from '../model/dictionaryModel';
import { useDictionariesStore } from '../query/dictionaryQuery';
import {
  DictionaryAutocomplete,
  OmittedDictionaryMultiselectType,
} from './DictionaryAutocomplete';

export const DictionaryAutocompleteFromStoreField = observer(
  <T extends DictionaryInstance>({
    field,
    ...props
  }: {
    field: keyof DictionariesInstance;
  } & OmittedDictionaryMultiselectType<T>) => {
    const dictionariesStore = useDictionariesStore();
    return (
      <DictionaryAutocomplete
        options={dictionariesStore.dictionariesQuery.data?.[field] as any}
        {...props}
      />
    );
  },
);
