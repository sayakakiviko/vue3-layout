import { defineStore } from 'pinia';
import router from '@/router';

//默认要展示的tab标签
const defaultTabItem = {
  title: '首页',
  path: '/home',
  name: 'Home',
};

export const useNavTabStore = defineStore({
  id: 'navTab',
  state: () => ({
    tabList: [defaultTabItem], //保存页签tab的数组
    cacheList: [], // keep-alive缓存的数组, 元素是组件名
  }),
  actions: {
    /**
     * 添加一个页签, 如果当前路由已经打开, 则不再重复添加
     * @item {object} 路由对象
     * */
    addTabItem(item) {
      const ignoreTabList = ['Login', '404']; //不需要出现在tab的的路由
      if (ignoreTabList.includes(item.name)) return;
      const index = this.tabList.findIndex((i) => i.path === item.path); //要添加的标签是否存在于tabList里，找不到index则为-1，说明需要添加
      if (index >= 0) return;
      this.tabList.push(item);
    },
    /**
     * 删除一个页签
     * @path {string} 路由路径
     * */
    removeTabItem(path) {
      if (path === defaultTabItem.path) return; //避免删除默认tab
      const index = this.tabList.findIndex((item) => item.path === path); //找到要删除的tab的下标
      if (index >= 0) {
        const isActive =
          router.currentRoute.value.path === this.tabList[index]['path'];
        this.tabList.splice(index, 1);
        if (isActive) {
          router.push({ path: this.tabList[this.tabList.length - 1]['path'] });
        }
      }
    },
    /**
     * 添加一个缓存页签
     * @name {string} 路由的name
     * */
    addCacheItem(name) {
      if (this.cacheList.includes(name)) return;
      this.cacheList.push(name);
    },
    /**
     * 删除一个缓存页签
     * @name {string} 路由的name
     * */
    removeCacheItem(name) {
      const index = this.cacheList.findIndex((item) => item === name);
      index >= 0 && this.cacheList.splice(index, 1);
    },
  },
});
