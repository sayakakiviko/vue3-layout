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
    redirect: '/home/index',
    component: () => import('@/layout/index.vue'), // 路由懒加载
    children: [
      {
        path: '/home',
        redirect: '/home/index',
        meta: { title: '个人中心', icon: 'location' }, //icon：显示在菜单上的图标
        menu: true, //是否要显示在菜单上
        children: [
          {
            path: '/home/index',
            name: 'Home',
            component: () => import('@/views/home.vue'),
            meta: { title: '首页', icon: 'setting', keepAlive: true },
            menu: true,
          },
          {
            path: '/home/demo',
            name: 'Demo',
            component: () => import('@/views/demo.vue'), // 路由懒加载
            meta: { title: 'demo', keepAlive: false },
            menu: true,
          },
        ],
      },
      {
        path: '/hello',
        name: 'Hello',
        component: () => import('@/views/hello.vue'), // 路由懒加载
        meta: { title: '你好', icon: 'document', keepAlive: true },
        menu: true,
      },
    ],
  },
  //Layout容器外的路由
  {
    path: '/helloWorld',
    name: 'HelloWorld',
    component: () => import('@/components/HelloWorld.vue'),
    meta: { title: 'HelloWorld', keepAlive: false, roles: ['user'] }, //roles的值代表哪些角色可以进入此路由
    menu: true,
    // 单独的前置路由守卫
    beforeEnter: (to, from) => {
      document.title = '欢迎学习vue3';
    },
  },
];

export default routes;
