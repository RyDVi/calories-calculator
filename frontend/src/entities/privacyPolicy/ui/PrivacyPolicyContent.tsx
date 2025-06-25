import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useQuery } from 'mst-query';
import { ErrorAlert, FullPageLoader } from 'shared/ui';
import { usePrivacyPolicyStore } from '../query/privacyPolicyQuery';

export const PrivacyPolicyContent = observer(() => {
  const privacyPolicyStore = usePrivacyPolicyStore();
  const { data, error, isLoading } = useQuery(
    privacyPolicyStore.privacyPolicyQuery,
    {
      refetchOnMount: 'never',
      refetchOnChanged: 'none',
    },
  );

  if (isLoading) {
    return <FullPageLoader />;
  }
  if (error) {
    return <ErrorAlert error={error} />;
  }
  if (!data?.privacy_policy) {
    throw new Error('Политика приватности отсутствует');
  }
  return <Box dangerouslySetInnerHTML={{ __html: data.privacy_policy }} />;
});
