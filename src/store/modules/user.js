import { defineStore } from 'pinia';
import VueI18n from '@/i18n';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}, //用户信息
  }),
  actions: {
    /**
     * 登录后设置用户登录信息
     * @userInfo {object} 用户信息
     * */
    login(userInfo) {
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      this.userInfo = userInfo;
      VueI18n.global.locale = userInfo.language;
      window.$message.success('登录成功');
    },
    /**
     * 退出登录
     * */
    logout() {
      sessionStorage.removeItem('userInfo');
      this.userInfo = {};
    },
    /**
     * 切换语言
     * @val {string} 语言：zh、en
     * */
    changeLanguage(val) {
      this.userInfo.language = val;
      VueI18n.global.locale = val;
    },
  },
});
