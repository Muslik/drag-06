import { RouteConfig } from 'react-router-config';

import { Error404Page } from './error404';
import { HomePage } from './home';
import { paths } from './paths';

export const ROUTES: RouteConfig[] = [
  {
    path: paths.home(),
    exact: true,
    component: HomePage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
