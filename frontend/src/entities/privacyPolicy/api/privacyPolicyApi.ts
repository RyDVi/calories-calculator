import { buildApiUrl, makeRequest } from 'shared/api';

export const loadPrivacyPolicy = (options: any = {}) =>
  makeRequest(buildApiUrl('/project_settings/privacy_policy'), options);
