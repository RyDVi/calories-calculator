import { buildApiUrl, makeRequest } from 'shared/api';

export const getDictionaries = (options: any = {}) =>
  makeRequest(buildApiUrl('/dictionaries'), options);
