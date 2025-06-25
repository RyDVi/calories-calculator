export const withSetPropAction = (mstInstance: any) => ({
  setProp(field: any, newValue: any) {
    mstInstance[field] = newValue;
  },
});

export const processMinNumber =
  (key: string, minNumber: number, otherProcessor?: any) =>
  (snapshot: any) => ({
    ...snapshot,
    ...(otherProcessor ? otherProcessor(snapshot) : {}),
    [key]: (snapshot?.[key] || 0) < minNumber ? minNumber : snapshot?.[key],
  });

export const concatFormikNames = (...names: (string | null | undefined)[]) =>
  names.filter(Boolean).join('.');
