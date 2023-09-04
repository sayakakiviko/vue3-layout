import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/** 全局前置路由守卫 */
router.beforeEach((to, from) => {
  if (sessionStorage.getItem('userInfo')) {
    //已登录
    if (from.path !== '/login' && to.path === '/login') return false; //登录后就不能再返回登录页了
    console.log(to, from);
  } else {
    //未登录，需要判断是否正处于登录页，否则会无限循环
    if (from.path !== '/login' && to.path === '/login') {
      //处于登录页则放行
      return;
    } else {
      //否则跳转登录页
      console.log('未登录');
      console.log(to);
      return '/login';
    }
  }
});

export default router;