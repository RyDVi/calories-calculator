import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { SendBugForProduct } from 'widgets/SendBugForProduct';
import { paths } from 'shared/consts';
import { useTranslate } from 'shared/i18n';
import { safeUri, useUrlQueryFilters } from 'shared/lib';
import { useOverrideShell } from 'shared/providers';

const RecipeReportBugPage = observer(() => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const { product_id } =
    useParams<Parameters<typeof paths.productSendBug>[0]>();
  const [urlQuery] = useUrlQueryFilters<{ redirect_uri?: string }>({
    defaultQuery: {
      redirect_uri: '',
    },
    fromQueryToFilters: (query) => ({
      ...query,
      redirect_uri: safeUri(query.redirect_uri),
    }),
  });

  useOverrideShell({
    backAction: urlQuery.redirect_uri || paths.diary({}),
    actions: null,
    title: translate('Сообщить об ошибке'),
  });

  const handleAfterSendBugForProduct = useCallback(() => {
    if (urlQuery.redirect_uri) {
      return navigate(urlQuery.redirect_uri, { viewTransition: true });
    }
    navigate(paths.diary({}), { viewTransition: true });
  }, [navigate, urlQuery.redirect_uri]);

  return (
    <SendBugForProduct
      productId={product_id!}
      onAfterSendBugForProduct={handleAfterSendBugForProduct}
    />
  );
});

export default RecipeReportBugPage;
