import { lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { LanguageDetector, PageLayout, RootProtector } from 'app/layout';
import { ErrorPage } from 'pages/error';
import { paths } from 'shared/consts';

const router = createBrowserRouter(
  [
    {
      path: paths.root.pattern,
      element: (
        <>
          <RootProtector />
          <LanguageDetector />
          <PageLayout />
        </>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: paths.auth.pattern,
          Component: lazy(() => import('../../pages/auth/ui/AuthPage')),
        },
        {
          path: paths.diaryDetail.pattern,
          Component: lazy(() => import('../../pages/diary/ui/DiaryPage')),
        },
        {
          path: paths.productSendBug.pattern,
          Component: lazy(
            () => import('../../pages/sendReportBug/ui/SendReportBugPage'),
          ),
        },
        {
          path: paths.productNew.pattern,
          Component: lazy(
            () => import('../../pages/procuctCreate/ui/CreateProductPage'),
          ),
        },
        {
          path: paths.mealTimeEdit.pattern,
          Component: lazy(
            () => import('../../pages/mealtimeAdd/ui/MealTimeAddPage'),
          ),
        },
        {
          path: paths.profile.pattern,
          Component: lazy(() => import('../../pages/profile/ui/ProfilePage')),
        },
        {
          path: paths.statistics.pattern,
          Component: lazy(
            () => import('../../pages/statistics/ui/StatisticsPage'),
          ),
        },
        {
          path: paths.privacy.pattern,
          Component: lazy(
            () => import('../../pages/privacyPolicy/ui/PrivacyPolicyPage'),
          ),
        },
        {
          path: '*',
          element: <Navigate to={paths.root({})} />,
        },
      ],
    },
  ],
  {
    basename: process.env.BASE_URL,
    // future: {
    //   v7_fetcherPersist: true,
    //   v7_normalizeFormMethod: true,
    //   v7_partialHydration: true,
    //   v7_relativeSplatPath: true,
    //   v7_skipActionErrorRevalidation: true,
    // },
  },
);

const AppRouter = () => (
  <RouterProvider router={router} future={{ v7_startTransition: true }} />
);

export default AppRouter;
