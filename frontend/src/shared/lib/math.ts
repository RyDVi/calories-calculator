export const normalize = (value: number, min: number, max: number) =>
  ((value - min) * 100) / (max - min);
