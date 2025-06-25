import { Field, FieldAttributes, FieldProps } from 'formik';
import lodash from 'lodash';

export const MuiFormikField: React.FC<
  {
    children: (props: any, attributes: FieldProps) => React.ReactNode;
    type?: 'default' | 'image' | 'dict' | 'checkbox' | 'date';
    converterOnChange?: (value: any) => any;
  } & Omit<FieldAttributes<any>, 'children'>
> = ({ children, type, converterOnChange, ...props }) => (
  <Field name={props.name}>
    {({
      field: { name, value, onChange, onBlur }, // { name, value, onChange, onBlur }
      form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
      form,
      field,
      meta,
    }: FieldProps) => {
      const helperText = lodash.get(touched, name) && lodash.get(errors, name);
      const error =
        lodash.get(touched, name) && Boolean(lodash.get(errors, name));
      const typeProps: any = {};
      if (!type || type === 'default') {
        typeProps.value = value;
      } else if (type === 'image') {
        typeProps.src = value;
        typeProps.onChange = (base64Image: any) => {
          if (typeof base64Image !== 'string') return;
          setFieldValue(name as any, base64Image);
        };
        // typeProps.onCapture = (imageBase64: string) =>
        //   setFieldValue(name as any, imageBase64);
      } else if (type === 'dict') {
        typeProps.selected = value;
        typeProps.onChange = (selected: any) => {
          return setFieldValue(name as any, selected);
        };
        typeProps.props = {
          onBlur,
          name,
          error,
          helperText,
        };
      } else if (type === 'checkbox') {
        typeProps.onChange = (_: any, checked: boolean) =>
          setFieldValue(name, checked);
      } else if (type === 'date') {
        typeProps.value = new Date(value);
        typeProps.onChange = (date: Date) =>
          setFieldValue(name, converterOnChange?.(date || new Date()));
      }
      if (!['checkbox', 'dict'].includes(type!)) {
        typeProps.helperText = helperText;
        typeProps.error = error;
      }
      return children(
        {
          name,
          onBlur,
          onChange,
          ...typeProps,
        },
        { form, field, meta },
      );
    }}
  </Field>
);
