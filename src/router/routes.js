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
        name: 'Home',
        component: () => import('@/views/home.vue'), // 路由懒加载
        meta: { title: '首页', icon: 'location' }, //icon：显示在菜单上的图标
        menu: true, //是否要显示在菜单上
      },
      {
        path: '/hello',
        name: 'Hello',
        redirect: '/hello/index',
        // component: () => import('@/views/hello.vue'), // 路由懒加载
        meta: { title: 'hello', icon: 'setting', keepAlive: true },
        menu: true,
        children: [
          {
            path: '/hello/index',
            name: 'Hello',
            component: () => import('@/views/hello.vue'), // 路由懒加载
            meta: {
              keepAlive: true,
              title: '你好',
              icon: 'document',
              breadcrumb: [
                { title: 'hello', name: 'Hello' },
                {
                  title: '你好',
                  name: 'Hello',
                },
              ],
            },
            menu: true,
          },
          {
            path: '/hello/demo',
            name: 'Demo',
            component: () => import('@/views/demo.vue'), // 路由懒加载
            meta: {
              keepAlive: true,
              title: '演示',
              breadcrumb: [
                { title: 'hello', name: 'Hello' },
                {
                  title: '演示',
                  name: 'Demo',
                },
              ],
            },
            menu: true,
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
    meta: { title: '404', keepAlive: false, roles: ['user'] }, //roles的值代表哪些角色可以进入此路由
    menu: true,
    // 单独的前置路由守卫
    beforeEnter: (to, from) => {
      document.title = '欢迎学习vue3';
    },
  },
];

export default routes;
