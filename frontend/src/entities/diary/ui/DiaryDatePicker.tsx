import { Badge, Button } from '@mui/material';
import {
  BaseSingleInputFieldProps,
  DatePicker,
  DateValidationError,
  FieldSection,
  PickersDay,
  PickersDayProps,
  UseDateFieldProps,
} from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  useBoolean,
  formatDateDayWithTimeName,
  isFutureDate,
  getUTCDate,
} from 'shared/lib';
import { useDiaryStore } from '../query/diaryQuery';

function FilledDay<TDate extends Date>({
  highlightedUTCdays = [],
  day,
  outsideCurrentMonth,
  ...other
}: PickersDayProps<TDate> & { highlightedUTCdays?: string[] }) {
  const isSelected = highlightedUTCdays.includes(getUTCDate(day));
  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      color={isSelected ? 'primary' : undefined}
      badgeContent=""
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

interface ButtonFieldProps<TDate extends Date>
  extends UseDateFieldProps<TDate, false>,
    BaseSingleInputFieldProps<
      TDate | null,
      TDate,
      FieldSection,
      false,
      DateValidationError
    > {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function ButtonField<TDate extends Date>(props: ButtonFieldProps<TDate>) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
    sx,
  } = props;

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}
      sx={sx}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  );
}

export const DiaryDatePicker: React.FC<{
  date: string;
  onChange: (date: string) => void;
}> = observer(({ date, onChange }) => {
  const [isOpen, open, close] = useBoolean();
  const currentDate = new Date(date);
  const { filledUTCDates } = useDiaryStore();
  return (
    <DatePicker
      sx={{ ml: 1, input: { padding: '0.5rem' } }}
      value={currentDate}
      label={formatDateDayWithTimeName(currentDate)}
      onChange={(date) => onChange(getUTCDate(date || new Date()))}
      closeOnSelect
      slots={{
        day: FilledDay,
        field: ButtonField,
      }}
      slotProps={
        {
          day: {
            highlightedUTCdays: filledUTCDates,
          },
          field: {
            setOpen: open,
          },
        } as any
      }
      shouldDisableDate={isFutureDate}
      open={isOpen}
      onClose={close}
      onOpen={open}
    />
  );
});
