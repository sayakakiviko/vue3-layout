import { defineStore } from 'pinia';
import routes from '@/router/routes';
import { cloneDeep } from 'lodash';

let routeList = cloneDeep(routes); //路由表
let menuList = []; //路由表转为的菜单

/**
 * 将路由表转为侧边菜单
 * @arr {array} 路由表
 * */
const filterMenus = (arr) => {
  return arr.filter((item, index) => {
    !item.menu && arr.splice(index, 1); //删掉不需要显示在菜单上的路由
    item.children && item.children.length && filterMenus(item.children);
    return item.menu;
  });
};
/**
 * layout层路由的处理
 * @arr {array} 路由表
 * */
const layoutHandle = (arr) => {
  for (let item of arr) {
    if (item.name === 'Layout') {
      //为保持顺序不变需要reverse反转
      item.children.reverse().map((val) => {
        routeList.unshift(val);
      });

      //隐藏layout
      item.children = [];
      item.menu = false;
      break;
    }
  }
  menuList = filterMenus(routeList);
};
layoutHandle(routeList);

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    menuList, //菜单列表
    menuActive: '/home/index', //激活的菜单
  }),
  actions: {
    /**
     * 菜单激活项改变
     * @path {string} 路由路径
     * */
    changeActive(path) {
      this.menuActive = path;
    },
  },
});
