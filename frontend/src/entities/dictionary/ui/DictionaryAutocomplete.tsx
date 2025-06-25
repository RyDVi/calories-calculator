import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Autocomplete,
  AutocompleteProps,
  Checkbox,
  TextField,
  TextFieldProps,
} from '@mui/material';

import { observer } from 'mobx-react-lite';

import { DictionaryInstance } from '../model/dictionaryModel';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface DictionaryMultiselectType<Type extends DictionaryInstance>
  extends Omit<
    AutocompleteProps<Type, true, false, false>,
    'renderInput' | 'onChange'
  > {
  selected: Type[];
  onChange: (selected: Type[]) => void;
  fieldProps?: TextFieldProps;
  renderInput: AutocompleteProps<Type, true, false, false>['renderInput'];
}

export type OmittedDictionaryMultiselectType<Type extends DictionaryInstance> =
  Omit<DictionaryMultiselectType<Type>, 'options'>;

export const DictionaryAutocomplete = observer(
  <Type extends DictionaryInstance>({
    onChange,
    selected = [],
    multiple,
    fieldProps,
    ...props
  }: DictionaryMultiselectType<Type>) => (
    <>
      <Autocomplete
        renderOption={
          multiple
            ? ({ key, ...optionProps }, option, { selected }) => (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )
            : undefined
        }
        //   renderInput={(params) => (
        //     <TextField {...params} label="Checkboxes" placeholder="Favorites" />
        //   )}
        onChange={(_, newSelected) =>
          onChange(
            multiple
              ? newSelected.map((x) => ({ ...x }))
              : [{ ...newSelected } as any],
          )
        }
        multiple={multiple}
        value={multiple ? selected : (selected[0] as any)}
        disableCloseOnSelect={multiple}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        isOptionEqualToValue={(dict1, dict2) => dict1.id === dict2.id}
        {...props}
        renderInput={
          props.renderInput ||
          ((props) => <TextField {...props} {...fieldProps} />)
        }
      />
    </>
  ),
);
