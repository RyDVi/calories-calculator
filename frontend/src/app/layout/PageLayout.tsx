import { Container } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useShellActionsContext } from 'shared/providers';
import { bottomSafeArea, topSafeArea } from 'shared/lib';
import { FullPageLoader } from 'shared/ui';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';

const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPageContainer } = useShellActionsContext();
  return (
    <Container
      ref={setPageContainer}
      component="main"
      sx={{
        height: '100dvh',
        // 56px и 60.5px - размеры плавающих хедера и футера
        maxHeight: `calc(100dvh - 64px - 64px - ${topSafeArea()}px - ${window.Telegram.WebApp.safeAreaInset.bottom}px + ${window.Telegram.WebApp.contentSafeAreaInset.bottom}px)`,
        overflowY: 'auto',
        margin: 'auto',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        overscrollBehavior: 'none',
      }}
    >
      {children}
    </Container>
  );
};

// Safe area и titlebar-area. Пространство, занимаемое монобровью телефона (посередине камера, по бокам пустое пространство) и titlebar???
// left: env(titlebar-area-x);
// top: env(titlebar-area-y);
// width: env(titlebar-area-width);
// height: env(titlebar-area-height);
// env(safe-area-inset-top);
// env(safe-area-inset-right);
// env(safe-area-inset-bottom);
// env(safe-area-inset-left);

const PageLayout = observer(() => (
  <Container
    sx={{
      p: 0,
      paddingTop: topSafeArea(),
      paddingBottom: bottomSafeArea(),
      position: 'relative',
    }}
  >
    <AppHeader />
    <PageContainer>
      <Suspense fallback={<FullPageLoader />}>
        <Outlet />
      </Suspense>
    </PageContainer>
    <AppFooter />
  </Container>
));

PageLayout.displayName = 'PageLayout';

export default PageLayout;
