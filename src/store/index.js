import { useUserStore } from './modules/user';
import { useMenuStore } from './modules/menu';
import { useBreadcrumbStore } from './modules/breadcrumb';
import { useNavTabStore } from './modules/navTab';
import { useSettingStore } from './modules/setting';
import { defineStore, createPinia } from 'pinia';

const pinia = createPinia();

export { useUserStore, useMenuStore, useBreadcrumbStore, useNavTabStore, useSettingStore };
export default pinia;

export const counterStore = defineStore('counter', {
  state: () => ({
    count: 10,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});

// 用户信息
export const userInfoStore = defineStore('userInfo', {
  state: () => ({
    name: '张三',
    age: 10,
  }),
  getters: {
    doubleCount: (state) => state.age * 2,
  },
  actions: {
    addAge() {
      this.age += 2;
    },
  },
});
