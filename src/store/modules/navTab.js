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
        const isActive = router.currentRoute.value.path === this.tabList[index]['path'];
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
    /**
     * 右键菜单关闭页签页签
     * @path {string} 右键的页签的路由路径
     * @type {string} left关闭左侧，right关闭右侧，other关闭其他，all关闭全部
     * @route {object} 当前路由路由
     * */
    closeNavTab(path, type, route) {
      const index = this.tabList.findIndex((item) => item.path === path); //找到右键的tab的下标
      let range = []; // 要移除的tab的区间
      switch (type) {
        case 'left':
        case 'right':
          range = (type === 'left' && [0, index]) || [index, this.tabList.length];

          //移除页签
          this.tabList = this.tabList.filter((item, i) => {
            return i <= range[0] || i >= range[1];
          });

          //若移除了当前激活的页签要重新跳转页面
          if (!this.tabList.some((val) => val.name === route.name)) {
            router.push({
              path: this.tabList[this.tabList.length - 1]['path'],
              query: this.tabList[this.tabList.length - 1]['query'],
            });
          }
          break;
        case 'other':
          this.tabList = this.tabList.filter((item, i) => index === i || i === 0); //移除页签
          router.push({
            path: this.tabList[this.tabList.length - 1]['path'],
            query: this.tabList[this.tabList.length - 1]['query'],
          });
          break;
        case 'all':
          this.tabList = [defaultTabItem];
          this.cacheList = [];
          router.push('/home');
          break;
      }
      //设置缓存页签
      this.cacheList = this.cacheList.filter((item) => {
        return this.tabList.some((val) => val.name === item);
      });
    },
  },
});
