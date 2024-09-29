export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/register', component: './User/Register' }],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
    footerRender: false,
  },
  //重定向
  // { path: '/', redirect: '/add_chart' },
  {
    path: '/add_chart',
    name: 'add_chart',
    icon: 'pieChart',
    component: './AddChart',
    footerRender: false,
  },
  {
    path: '/add_chart/async',
    name: 'add_chart_async',
    icon: 'barChart',
    component: './addChartAsync',
    footerRender: false,
  },
  {
    path: '/my_chart',
    name: 'my_chart',
    icon: 'barChart',
    component: './MyChart',
    footerRender: false,
  },

  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },
  // { icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
