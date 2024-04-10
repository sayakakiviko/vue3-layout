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
        path: '/usedComponents',
        name: 'usedComponents',
        redirect: '/usedComponents/proTablePart',
        // component: () => import('@/views/hello.vue'), // 路由懒加载
        menu: true,
        meta: { id: '2', title: '组件示例', icon: 'setting' },
        children: [
          {
            path: '/usedComponents/proTablePart',
            name: 'proTablePart',
            component: () => import('@/views/usedComponents/proTablePart.vue'), // 路由懒加载
            menu: true,
            meta: {
              keepAlive: true,
              id: '2-1',
              title: '表格组件',
              breadcrumb: [
                { title: '组件示例', name: 'usedComponents' },
                { title: '表格组件', name: 'proTablePart' },
              ],
            },
          },
        ],
      },
      {
        path: '/other',
        name: 'other',
        redirect: '/other/demo',
        menu: true,
        meta: { id: '3', title: '其他', icon: 'star', keepAlive: true },
        children: [
          {
            path: '/other/demo',
            name: 'demo',
            component: () => import('@/views/other/demo.vue'), // 路由懒加载
            menu: true,
            meta: {
              keepAlive: true,
              id: '3-1',
              title: '演示',
              icon: 'document',
              roles: ['user'], //roles的值代表哪些角色可以进入此路由
              breadcrumb: [
                { title: '其他', name: 'other' },
                { title: '演示', name: 'demo' },
              ],
            },
          },
          {
            path: '/other/directive',
            name: 'directive',
            component: () => import('@/views/other/directive.vue'), // 路由懒加载
            menu: true,
            meta: {
              id: '3-2',
              title: '自定义指令',
              breadcrumb: [
                { title: '其他', name: 'other' },
                { title: '自定义指令', name: 'directive' },
              ],
            },
          },
          {
            path: '/other/detail/:id',
            name: 'detail',
            component: () => import('@/views/other/detail.vue'), // 路由懒加载
            menu: true,
            meta: {
              id: '3-3',
              title: '详情页',
              breadcrumb: [
                { title: '其他', name: 'other' },
                { title: '详情页', name: 'detail' },
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
    meta: { title: '404', keepAlive: false },
    // 单独的前置路由守卫
    beforeEnter: (to, from) => {
      document.title = '欢迎学习vue3';
    },
  },
];

export default routes;
