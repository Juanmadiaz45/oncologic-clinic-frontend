interface PublicRouteConfig {
  path: string;
  element: React.ReactElement;
}

import LoginPage from '@/pages/auth/LoginPage';
import { ROUTES } from '@/constants';

export const publicRoutes: PublicRouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
];
