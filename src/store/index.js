import { useUserStore } from './modules/user';
import { useMenuStore } from './modules/menu';
import { useBreadcrumbStore } from './modules/breadcrumb';
import { useNavTabStore } from './modules/navTab';
import { useSettingStore } from './modules/setting';
import { counterStore, userInfoStore } from './modules/demo'; //demo页用，项目正式开发后可删除
import { defineStore, createPinia } from 'pinia';

const pinia = createPinia();

export {
  useUserStore,
  useMenuStore,
  useBreadcrumbStore,
  useNavTabStore,
  useSettingStore,
  counterStore,
  userInfoStore,
};
export default pinia;
