import { useTranslate } from 'shared/i18n';
import { formatGramms } from 'shared/lib';

const IntValue = ({
  count,
  quantity,
  unitName,
}: {
  count: number;
  quantity: number;
  unitName?: string;
}) => {
  const translate = useTranslate();
  return (
    <>
      {formatGramms(quantity * count, unitName)} {translate('из')}{' '}
      {formatGramms(quantity, unitName)}
    </>
  );
};

interface FractionValueProps {
  intVal: number;
  fractionCount: number;
  count_fractions_in_product?: number | null;
  quantity: number;
  unitName?: string;
}

const FractionValue = ({
  intVal,
  fractionCount,
  count_fractions_in_product,
  quantity,
  unitName,
}: FractionValueProps) => {
  const translate = useTranslate();
  return (
    <>
      {intVal || ''}
      <sup>{fractionCount}</sup>&frasl;
      <sub>{count_fractions_in_product}</sub> {translate('от')}{' '}
      {formatGramms(quantity, unitName)}
    </>
  );
};

interface FullValueProps {
  count: number;
  quantity: number;
  unitName?: string;
}

export const FullOrFractionValue: React.FC<
  FractionValueProps | FullValueProps
> = (props) => {
  if (
    'count_fractions_in_product' in props &&
    !!props.count_fractions_in_product
  ) {
    if (props.fractionCount > 0) {
      return <FractionValue {...props} />;
    }
    return <IntValue {...props} count={props.intVal} />;
  }
  if ('count' in props) {
    return <IntValue {...props} />;
  }
  return null;
};
