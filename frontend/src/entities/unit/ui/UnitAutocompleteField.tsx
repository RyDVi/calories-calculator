import { observer } from 'mobx-react-lite';
import {
  DictionaryAutocompleteFromStoreField,
  OmittedDictionaryMultiselectType,
} from 'entities/dictionary';
import { useTranslate } from 'shared/i18n';
import { UnitInstance } from '../model/unitModel';

export const UnitAutocompleteField = observer(
  <T extends UnitInstance>(props: OmittedDictionaryMultiselectType<T>) => {
    const translate = useTranslate();
    return (
      <DictionaryAutocompleteFromStoreField
        {...props}
        fieldProps={{
          label: translate('Единица измерения'),
          placeholder: translate('Выберите единицу измерения'),
          ...props.fieldProps,
        }}
        field="units"
      />
    );
  },
);
