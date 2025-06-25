export const getPublicPath = (filepath: string) =>
  `${import.meta.env.VITE_ASSET_URL || ''}${import.meta.env.BASE_URL || ''}${filepath}`;
