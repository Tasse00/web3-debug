import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: './',
      component: '@/providers/Web3ConnectProvider',
      routes: [
        {
          path: './',
          component: '@/layouts/MainLayout',
          routes: [
            {
              path: './',
              component: '@/pages/index',
            },
          ]
        },
      ]
    }
  ],
  history: {
    type: 'hash',
  },
  fastRefresh: {},
});
