/** 路由表 */
const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: { title: '登录', keepAlive: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404.vue'),
  },
  //Layout容器内的路由。layout外有children的路由若想在菜单上展示，该路由不能携带component
  //若需要某个路由具备缓存功能，需要keepAlive为true，并且路由对应的页面的name与路由的name要保持一致
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import('@/layout/index.vue'), // 路由懒加载
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home.vue'), // 路由懒加载
        menu: true, //是否要显示在菜单上
        meta: { id: '1', title: '首页', icon: 'location' }, //icon：显示在菜单上的图标
      },
      {
        path: '/hello',
        name: 'hello',
        redirect: '/hello/index',
        // component: () => import('@/views/hello.vue'), // 路由懒加载
        menu: true,
        meta: { id: '2', title: 'hello', icon: 'setting', keepAlive: true },
        children: [
          {
            path: '/hello/index',
            name: 'hello',
            component: () => import('@/views/hello.vue'), // 路由懒加载
            menu: true,
            meta: {
              keepAlive: true,
              id: '2-1',
              title: '你好',
              icon: 'document',
              breadcrumb: [
                { title: 'hello', name: 'hello' },
                { title: '你好', name: 'hello' },
              ],
            },
          },
          {
            path: '/hello/demo',
            name: 'demo',
            component: () => import('@/views/demo.vue'), // 路由懒加载
            menu: true,
            meta: {
              keepAlive: true,
              id: '2-2',
              title: '演示',
              breadcrumb: [
                { title: 'hello', name: 'hello' },
                { title: '演示', name: 'demo' },
              ],
            },
          },
        ],
      },
      {
        path: '/usedComponents',
        name: 'usedComponents',
        redirect: '/usedComponents/proTablePart',
        // component: () => import('@/views/hello.vue'), // 路由懒加载
        menu: true,
        meta: { id: '3', title: '常用组件', icon: 'setting' },
        children: [
          {
            path: '/usedComponents/proTablePart',
            name: 'proTablePart',
            component: () => import('@/views/usedComponents/proTablePart.vue'), // 路由懒加载
            menu: true,
            meta: {
              id: '3-1',
              title: '表格组件',
              breadcrumb: [
                { title: '常用组件', name: 'usedComponents' },
                { title: '表格组件', name: 'proTablePart' },
              ],
            },
          },
        ],
      },
    ],
  },
  //Layout容器外的路由
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    menu: true,
    meta: { title: '404', keepAlive: false, roles: ['user'] }, //roles的值代表哪些角色可以进入此路由
    // 单独的前置路由守卫
    beforeEnter: (to, from) => {
      document.title = '欢迎学习vue3';
    },
  },
];

export default routes;
