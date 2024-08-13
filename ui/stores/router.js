
import { createRouter } from '../lib/router';

export const $router = createRouter(
  {
    home: '/',
    login: '/login',
  },
  {
    notFound: '/404',
  }
);
