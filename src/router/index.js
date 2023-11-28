import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useUserStore, useBreadcrumbStore } from '@/store';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/** 全局前置路由守卫 */
router.beforeEach((to, from) => {
  if (sessionStorage.getItem('userInfo')) {
    //已登录
    if (from.path !== '/login' && to.path === '/login') return false; //登录后就不能再返回登录页了

    const { roles } = to.meta;
    //若前往的路由有权限设置
    if (roles && Array.isArray(roles)) {
      const { userInfo } = useUserStore();
      if (!roles.includes(userInfo.role)) {
        window.$message.error('您暂无进入此页面的权限');
        return false;
      }
    }
    // 路由跳转时确定当前面包屑
    const breadcrumbStore = useBreadcrumbStore();
    breadcrumbStore.breadcrumb = getBreadcrumb(to);
  } else {
    //未登录，需要判断是否正处于登录页，否则会无限循环
    if (from.path !== '/login' && to.path === '/login') {
      //处于登录页则放行
      return;
    } else {
      //否则跳转登录页
      window.$message.error('请登录');
      return '/login';
    }
  }
});

/**
 * 通过路由信息获取面包屑数据
 * @route {object} 当前路由
 * */
function getBreadcrumb(route) {
  let breadcrumbList = [];
  route.matched.forEach((el) => {
    if (el.meta.breadcrumb) {
      breadcrumbList.push(...el.meta.breadcrumb);
    }
  });
  return breadcrumbList;
}

export default router;
