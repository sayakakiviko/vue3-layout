import { useUserStore } from './modules/user';
import { useMenuStore } from './modules/menu';
import { useNavTabStore } from './modules/navTab';
import { useSettingStore } from './modules/setting';

const pinia = createPinia();

export { useUserStore, useMenuStore, useNavTabStore, useSettingStore };
export default pinia;

import { defineStore, createPinia } from 'pinia';
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
