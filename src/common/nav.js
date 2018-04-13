import dynamic from 'dva/dynamic';
import page from './page';

// wrapper of dynamic
export const dynamicWrapper = (app, models, component) =>
  dynamic({
    app,
    models: () => models.map(m => import(`../models/${m}.js`)),
    component
  });

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      ...page(app), // 加载额外页面（不包含在nav中的）
      {
        name: '工作台',
        icon: 'dashboard',
        path: 'dashboard',
        component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Monitor'))
      }
    ]
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        path: 'user',
        hide: true,
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['user'], () => import('../routes/User/Login'))
          }
        ]
      }
    ]
  }
];
