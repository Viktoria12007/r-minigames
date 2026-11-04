import { createBrowserRouter } from 'react-router';
import Layout from '../layouts/layout.tsx';
import Home from '../pages/home.tsx';
import Library from '../pages/library.tsx';
import NotFound from '../pages/not-found.tsx';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: 'home',
          Component: Home,
        },
        {
          path: 'library',
          Component: Library,
        },
        {
          path: '*',
          Component: NotFound,
        },
      ],
    },
  ],
  {
    basename: '/r-minigames',
  },
);
